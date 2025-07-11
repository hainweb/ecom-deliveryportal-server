const deliveryModel = require("../models/deliveryModel");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");

let otp = "";
module.exports = {
  getOrders: async (req, res) => {
    console.log("Api called");

    try {
      let orders = await deliveryModel.getOrders();

      orders.sort((a, b) => {
        const statusOrder = {
          Pending: 1,
          "Product take from godown": 2,
          "Product Delivered": 3,
          Completed: 4,
          Canceled: 5,
        };

        const getStatus = (o) =>
          o.cancel
            ? "Canceled"
            : o.cashadmin
            ? "Completed"
            : o.status3
            ? "Product Delivered"
            : o.status2
            ? "Product take from godown"
            : "Pending";

        return statusOrder[getStatus(a)] - statusOrder[getStatus(b)];
      });

      res.json({ success: true, orders });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching orders" });
    }
  },

  updateShipping: async (req, res) => {
    await deliveryModel.addShipping(req.params.id);
    res.json({ status: true, message: "Shipping updated" });
  },

  updateDelivered: async (req, res) => {
    await deliveryModel.addDelivered(req.params.id);
    res.json({ status: true, message: "Delivered status updated" });
  },

  updateCash: async (req, res) => {
    await deliveryModel.addCashUpdate(req.params.id);
    res.json({ status: true, message: "Cash status updated" });
  },

  login: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      if (!Email || !Password) {
        return res
          .status(400)
          .json({ message: "Email and Password are required" });
      }
      const delivery = await deliveryModel.verifyCredentials(Email, Password);
      if (!delivery) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // JWT payload (do not include password)
      const payload = {
        id: delivery._id,
        Name: delivery.Name,
        Email: delivery.Email,
        role: "delivery",
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .json({ message: "Login successful", token, user: payload });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const response = await deliveryModel.forgotPassword(email);
      if (!response) {
        return res
          .status(404)
          .json({ message: "Email not found", status: false });
      } else {
        otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

        sendEmail({
          to: email,
          subject: "Password Reset OTP",
          text: `Your OTP for password reset is ${otp}. Please use this to reset your password.`,
        }).catch((err) => {
          console.error("Error sending email:", err);
          return res
            .status(500)
            .json({ message: "Failed to send OTP", status: false });
        });
        console.log(`Sending OTP to ${email}`);
        res
          .status(200)
          .json({ message: "OTP sent to your email", status: true });
      }
    } catch (error) {
      console.error("Error in ForgotPassword:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyOtp: async (req, res) => {
    console.log("verify");

    try {
      const { email, otp: userOtp } = req.body;
      console.log("otp", otp, "user otp ", userOtp);

      if (!email || !userOtp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
      if (parseInt(userOtp) !== otp) {
        console.log("verifica failed");

        return res.status(400).json({ message: "Invalid OTP", status: false });
      }

      console.log("Otp verified");

      res
        .status(200)
        .json({ message: "OTP verified successfully", status: true });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res
          .status(400)
          .json({ message: "Email and new password are required" });
      }
      const response = await deliveryModel.resetPassword(email, newPassword);
      if (response) {
        res
          .status(200)
          .json({ message: "Password reset successfully", status: true });
      } else {
        res
          .status(500)
          .json({ message: "Failed to reset password", status: false });
      }
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

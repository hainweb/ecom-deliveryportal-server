const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

// Routes
router.post("/login", deliveryController.login);

router.get("/orders", deliveryController.getOrders);
router.get("/shipping/:id", deliveryController.updateShipping);
router.get("/delivered/:id", deliveryController.updateDelivered);
router.get("/cashupdate/:id", deliveryController.updateCash);


router.post("/forgot-password", deliveryController.forgotPassword); 
router.post("/verify-otp", deliveryController.verifyOtp);
router.post("/reset-password", deliveryController.resetPassword);




module.exports = router;

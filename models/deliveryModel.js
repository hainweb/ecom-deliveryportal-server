const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const deliveryCollecton = () => {
  return db.get().collection(collection.DELIVERY_COLLECTION);
};

module.exports = {
  getOrders: () => {
    return db.get().collection(collection.ORDER_COLLECTION).find().toArray();
  },

  addShipping: (orderId) => {
    const date = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status2: "Shipped",
            shipedDate: date,
          },
        }
      );
  },

  addDelivered: (orderId) => {
    const date = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status2: "Shipped",
            status3: "Product delivered",
            deliveredDate: date,
          },
        }
      );
  },

  addCashUpdate: (orderId) => {
    const date = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status2: "Shipped",
            status3: "Product delivered",
            cashadmin: "Cash sended",
            cashadminDate: date,
          },
        }
      );
  },

  async verifyCredentials(Email, Password) {
    const delivery = await deliveryCollecton().findOne({ Email });
    if (!delivery) return false;
    const isMatch = await bcrypt.compare(Password, delivery.Password);
    return isMatch ? delivery : false;
  },

  forgotPassword: async (email) => {
    const delivery = await deliveryCollecton().findOne({ Email: email });
    if (!delivery) return false;
    return true;
  },
  resetPassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await deliveryCollecton().updateOne(
      { Email: email },
      { $set: { Password: hashedPassword } }
    );
    return result.modifiedCount > 0;
  },
};

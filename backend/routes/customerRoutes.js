const express = require("express");

const customerController = require("../controllers/customerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(customerController.getAllCustomers)
    .post(customerController.uploadImages, customerController.resizeImages, customerController.createCustomer);

router
    .route("/:id")
    .get(customerController.getCustomer)
    .patch(customerController.uploadImages, customerController.resizeImages, customerController.updateCustomer)
    .delete(customerController.deleteCustomer);

module.exports = router;
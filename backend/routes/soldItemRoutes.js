const express = require("express");
const soldItemController = require("../controllers/soldItemController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(soldItemController.getAllSoldItems)
    .post(soldItemController.createSoldItem);

module.exports = router;
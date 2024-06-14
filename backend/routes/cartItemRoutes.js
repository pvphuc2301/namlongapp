const express = require("express");
const router = express.Router();

const cartItemController = require("../controllers/cartItemController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
    .route("/")
    .get(cartItemController.getAllCartItems)
    .post(cartItemController.generateApartmentCode, cartItemController.createCartItem);

router
    .route("/:id")
    .get(cartItemController.getCartItem)
    .patch((req, _, next) => {
        // set status to pending when update cart item
        if (req.body.status === undefined) {
            req.body.status = 'pending';
        }

        // for renewal
        if (req.body.status === 'archived') {
            req.body.status = 'pending';

            req.body.createdBy = req.user._id;
            req.body.createdAt = Date.now();
        }

        next();
    }, cartItemController.updateCartItem)
    .delete(cartItemController.deleteCartItem);

module.exports = router;
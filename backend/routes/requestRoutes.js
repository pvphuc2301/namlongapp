const express = require("express");
const requestController = require("./../controllers/requestController");
const soldItemController = require("./../controllers/soldItemController");
const authController = require("./../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const CartItem = require("../models/cartItemModel");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(requestController.getAllRequests)
    .post(requestController.createRequest);

router
    .route("/:id")
    .get(requestController.getRequest)
    .patch(requestController.updateRequest, catchAsync(async (req, res, next) => {

        if (req.result.status === 'approved') {

            let cartItem = await CartItem.findById(req.result.cartItem);

            // update status of cart item
            cartItem.status = 'archived';

            await cartItem.save();

            if (req.result.reason === 'Căn đã bán') {
                // repare data for create sold item
                req.body = {
                    apartmentCode: cartItem.apartmentCode,
                    floor: cartItem.floor,
                    position: cartItem.position,
                    area: cartItem.area,
                    main: cartItem.main._id,
                    sub: cartItem.sub._id,
                    block: cartItem.block._id,
                    originalPrice: cartItem.originalPrice,
                    price: cartItem.price,
                    diff: cartItem.diff,
                    sale: cartItem.sale._id,
                    note: cartItem.note,
                    createdBy: cartItem.createdBy._id,
                    createdAt: cartItem.createdAt,
                    updatedBy: cartItem.updatedBy._id,
                    updatedAt: cartItem.updatedAt
                };

                return next();
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: req.result
            }
        })
    }),
        soldItemController.createSoldItem,)
    .delete(requestController.deleteRequest);


module.exports = router
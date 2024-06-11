const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

router.use(authController.protect);

router.route('')
    .get(userController.getAllUsers);

router.route('/:id')
    .patch(authController.restrictTo('manager', 'admin'), userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser)
    .delete(authController.restrictTo('manager', 'admin'), userController.deleteUser);

module.exports = router;
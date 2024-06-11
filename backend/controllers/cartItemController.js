const factory = require('./handlerFactory');
const CartItem = require('../models/cartItemModel');
const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');

exports.getApartmentCode = (req, res, next) => {
}

exports.generateApartmentCode = catchAsync(async (req, _, next) => {
    if ((!req.body.sub && !req.body.block) || !Number(req.body.floor) || !Number(req.body.position)) {
        return next();
    }

    let blockStr = '';
    let floorStr = '';
    let positionStr = '';

    let project;

    if (req.body.block) {
        project = await Project.findById(req.body.block);
    } else {
        project = await Project.findById(req.body.sub);
    }

    if (!project) return next();

    const floor = Number(req.body.floor);
    const position = Number(req.body.position);

    if (project.type === 'block') {
        blockStr = project.name;
    }

    if (floor === 0) {
        floorStr = '';
    } else if (floor === 13) {
        floorStr = '-12A';
    } else if (floor === 14) {
        floorStr = '-12B';
    } else {
        floorStr = `${floor}`.padStart(3, '0');
    }

    // padStart(2, '0') is used to pad the string with 0 to reach the length of 2
    positionStr = `${position}`.padStart(2, '0');

    req.body.apartmentCode = `${blockStr}-${floorStr}.${positionStr}`;

    next();
})

exports.getAllCartItems = factory.getAll(CartItem);
exports.getCartItem = factory.getOne(CartItem);
exports.createCartItem = factory.createOne(CartItem);
exports.updateCartItem = factory.updateOne(CartItem);
exports.deleteCartItem = factory.deleteOne(CartItem)
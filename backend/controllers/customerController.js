const Customer = require('../models/customerModel');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImages = upload.fields([
    { name: 'identityCardFront', maxCount: 1 },
    { name: 'identityCardBack', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]);

exports.resizeImages = catchAsync(async (req, res, next) => {
    // if (!req.files.imageCover && !req.files.images) return next();
    // 1) Cover image
    if (req.files?.photo) {
        req.body.photo = `customers-${req.params.id}-${Date.now()}-photo.jpeg`;
        await sharp(req.files.photo[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/img/customers/${req.body.photo}`);
    }

    if (req.files?.identityCardFront) {
        req.body.identityCardFront = `customers-${req.params.id}-${Date.now()}-identityCardFront.jpeg`;
        await sharp(req.files.identityCardFront[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/img/customers/${req.body.identityCardFront}`);
    }

    if (req.files?.identityCardBack) {
        req.body.identityCardBack = `customers-${req.params.id}-${Date.now()}-identityCardBack.jpeg`;
        await sharp(req.files.identityCardBack[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/img/customers/${req.body.identityCardBack}`);
    }

    next();
});

exports.getAllCustomers = factory.getAll(Customer);
exports.createCustomer = factory.createOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);

const factory = require('./handlerFactory');
const Document = require('../models/documentModel');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../public/uploads`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: multerStorage
});

exports.uploadAttachments = upload.fields([
    { name: 'attachments', maxCount: 3 }
]);

exports.resizeAttachments = catchAsync(async (req, _, next) => {
    console.log(req.body.attachments)
    if (!req.files?.attachments) return next();

    if (req.body.attachments) {
        req.body.attachments = Array.isArray(req.body.attachments) ? req.body.attachments : [req.body.attachments];
    } else {
        req.body.attachments = [];
    }

    console.log('attachments', req.body.attachments);

    await Promise.all(req.files.attachments.map(async (file, i) => {
        req.body.attachments.push(file.filename);
    }));

    console.log('attachments', req.body.attachments);


    next();
});

exports.getDocument = factory.getOne(Document);
exports.getAllDocuments = factory.getAll(Document);
exports.createDocument = factory.createOne(Document);
exports.updateDocument = factory.updateOne(Document);
exports.deleteDocument = factory.deleteOne(Document)
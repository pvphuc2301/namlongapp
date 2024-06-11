const factory = require('./handlerFactory');
const Project = require('../models/projectModel');
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

exports.uploadProjectImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
    // if (!req.files.imageCover && !req.files.images) return next();
    // 1) Cover image
    if (req.files?.imageCover) {
        req.body.imageCover = `project-${req.params.id}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../public/img/projects/${req.body.imageCover}`);
    }

    if (req.files?.images) {
        // 2) Images
        // first uploaded: 
        // exist 1 file
        // more than 1 file

        if (req.body.images) {
            req.body.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        } else {
            req.body.images = [];
        }

        await Promise.all(req.files.images.map(async (file, i) => {
            const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`${__dirname}/../public/img/projects/${filename}`);
            req.body.images.push(filename);
        }))
    }

    next();
});

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project);
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

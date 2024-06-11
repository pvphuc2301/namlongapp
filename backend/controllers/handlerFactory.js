const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    // const doc = await Model.findByIdAndDelete(req.params.id);
    const doc = await Model.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        updatedAt: Date.now()
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updateOne = (Model, useNext) => catchAsync(async (req, res, next) => {
    req.body.updatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return updated document
        runValidators: true // validate before update
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    if (useNext) {
        req.result = doc;
        return next();
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = (Model) => catchAsync(async (req, res, next) => {

    console.log('body', req.body);
    req.body.createdBy = req.user._id;

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});
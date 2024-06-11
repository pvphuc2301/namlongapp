const mongoose = require('mongoose');

const soldItemSchema = new mongoose.Schema({
    apartmentCode: {
        type: String,
        required: [true, 'Apartment code is required']
    },
    floor: {
        type: Number,
        required: [true, 'Floor is required']
    },
    position: {
        type: Number,
        required: [true, 'Position is required']
    },
    area: {
        type: Number,
        required: [true, 'Area is required']
    },
    main: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'main is required']
    },
    sub: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'sub is required']
    },
    block: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'block is required']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Original price is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    diff: Number,
    sale: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    note: String,
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    updatedAt: Date
});

soldItemSchema.pre(/^find/, function (next) {

    this.populate({
        path: 'main',
        select: 'name'
    }).populate({
        path: 'sub',
        select: 'name'
    }).populate({
        path: 'block',
        select: 'name'
    }).populate({
        path: 'sale',
        select: 'name'
    });
    next();
});

const SoldItem = mongoose.model('SoldItem', soldItemSchema);
module.exports = SoldItem;
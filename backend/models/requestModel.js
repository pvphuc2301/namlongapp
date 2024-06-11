const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    cartItem: {
        type: mongoose.Schema.ObjectId,
        ref: 'CartItem'
    },
    type: {
        type: String,
        enum: ['stop transaction'],
        required: [true, 'Type is required']
    },
    reason: {
        type: String,
        enum: ['Khách ngưng bán', 'Căn đã bán'],
        required: [true, 'Reason is required']
    },
    note: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectReason: String,
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date
    }
});

requestSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'cartItem',
        select: 'apartmentCode'
    });

    next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
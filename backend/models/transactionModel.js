const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'Giao dịch CĐT',
            'Giao dịch chuyển nhượng'
        ],
        required: [true, 'Type is required']
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    main: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'Main project is required']
    },
    sub: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'Sub project is required']
    },
    product: {
        type: String,
        required: [true, 'Product is required']
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: [true, 'Seller is required']
    },
    buyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: [true, 'Buyer is required']
    },
    active: {
        type: Boolean,
        default: true
    },
    sale: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    });


transactionSchema.pre(/^find/, function (next) {
    this.populate({ path: 'sale buyer seller' });
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
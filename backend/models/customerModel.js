const moongose = require('mongoose');

const customerSchema = new moongose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    gender: {
        type: String,
        enum: ['', 'male', 'female'],
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    phone: String,
    dob: Date,
    identityCard: String,
    issuedDate: String,
    issuedBy: String,
    identityCardFront: String,
    identityCardBack: String,
    photo: {
        type: String,
        default: 'default.jpeg'
    },
    // por: String,ffffffff
    // porWard: String,
    // porDistrict: String,
    // porCity: String,

    // ca: String,
    // caWard: String,
    // caDistrict: String,
    // caCity: String,

    currentAddress: String,
    permanentAddress: String,

    accountNumber: String,
    bankId: Number,
    bankBranch: String,
    sale: {
        type: moongose.Schema.ObjectId,
        ref: 'User'
    },
    note: String,
    active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    });

const Customer = moongose.model('Customer', customerSchema);

module.exports = Customer;
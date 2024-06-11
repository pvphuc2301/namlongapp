const mongoose = require('mongoose');

const documentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Document type name is required'],
        unique: true
    },
    active: {
        type: Boolean,
        default: true,
        // select: false
    },
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

documentTypeSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
})

const DocumentType = mongoose.model('DocumentType', documentTypeSchema);
module.exports = DocumentType;

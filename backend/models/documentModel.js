const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Document name is required'],
        unique: true
    },
    description: String,
    active: {
        type: Boolean,
        default: true,
        // select: false
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    },
    type: {
        type: mongoose.Schema.ObjectId,
        ref: 'DocumentType'
    },
    attachments: [String],
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

documentSchema.pre(/^find/, function (next) {

    this.find({ active: { $ne: false } });

    this.populate({
        path: 'project',
        select: 'name'
    });

    this.populate({
        path: 'type',
        select: 'name'
    });

    next();
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;

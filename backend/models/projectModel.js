const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        unique: true
    },
    parentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    },
    type: {
        type: String,
        enum: ['main', 'sub', 'block'],
        default: 'main'
    },
    description: {
        type: String
    },
    images: [String],
    imageCover: String,
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

projectSchema.pre(/^find/, function (next) {

    this.find({ active: { $ne: false } });
    next();
})

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

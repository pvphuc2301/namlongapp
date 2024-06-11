const factory = require('./handlerFactory');
const DocumentType = require('../models/documentTypeModel');

exports.getAllDocumentTypes = factory.getAll(DocumentType);
exports.createDocumentType = factory.createOne(DocumentType);
exports.getDocumentType = factory.getOne(DocumentType);
exports.updateDocumentType = factory.updateOne(DocumentType);
exports.deleteDocumentType = factory.deleteOne(DocumentType)
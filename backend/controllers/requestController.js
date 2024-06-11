const Request = require('../models/requestModel');
const factory = require('./handlerFactory');


exports.getAllRequests = factory.getAll(Request);
exports.createRequest = factory.createOne(Request);
exports.getRequest = factory.getOne(Request);
exports.updateRequest = factory.updateOne(Request, true);
exports.deleteRequest = factory.deleteOne(Request)
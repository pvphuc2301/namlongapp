const SoldItem = require('../models/soldItemModel');
const factory = require('./handlerFactory');

exports.getAllSoldItems = factory.getAll(SoldItem);
exports.createSoldItem = factory.createOne(SoldItem);
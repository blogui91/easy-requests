'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.Trait = exports.Service = undefined;

var _TraitBuilder = require('./Traits/TraitBuilder');

var _Model = require('./Traits/Model.trait');

var _Model2 = _interopRequireDefault(_Model);

var _BaseService = require('./Base.service.js');

var _BaseService2 = _interopRequireDefault(_BaseService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Service = _BaseService2.default;
exports.Trait = _TraitBuilder.trait;
exports.Model = _Model2.default;

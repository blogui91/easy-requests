'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.Trait = exports.Service = undefined;

var _easyRequests = require('./src/easy-requests.js');

var _easyRequests2 = _interopRequireDefault(_easyRequests);

var _TraitBuilder = require('./Traits/TraitBuilder');

var _Model = require('./Traits/Model.trait');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Service = _easyRequests2.default;
exports.Trait = _TraitBuilder.trait;
exports.Model = _Model2.default;

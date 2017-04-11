'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 
 *	Easy requests |
 *	(c) 2017 by Cesar Santana 
 */

var axios = require('axios');
var pluralize = require('pluralize');
var _ = require('lodash');

var Service = function () {
	/**
  * Create a new instance.
  *
  */
	function Service() {
		_classCallCheck(this, Service);

		this.http = axios;
		this.config = {
			origin: window.location.origin,
			prefix: '',
			endpoint: pluralize(_.kebabCase(this.getClassName())).toLowerCase()
		};
	}

	/**
  * Returns name of the constructor.
  *
  * @returns String
  */

	_createClass(Service, [{
		key: 'getClassName',
		value: function getClassName() {
			return this.constructor.name;
		}

		/**
   * Builds url.
   *
   * @returns String
   */

	}, {
		key: 'buildUrl',
		value: function buildUrl() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			var prefix = this.config.prefix;
			var origin = this.config.origin;
			var endpoint = this.config.endpoint;

			return this.sanitizeUrl(origin + "/" + prefix + "/" + endpoint + "/" + id + "/");
		}

		/**
   * Remove duplicated slashes.
   *
   * @returns String
   */

	}, {
		key: 'sanitizeUrl',
		value: function sanitizeUrl(endpoint) {
			return endpoint.replace(/([^:])(\/\/+)/g, '$1/');
		}
	}, {
		key: 'getResource',


		/**
   * Make GET request to determinated URL.
   *
   * @returns Promise
   */

		value: function getResource() {
			var _this = this;

			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var route = this.buildUrl();
			var promise_request = new Promise(function (resolve, reject) {
				_this.http.get(route, {
					params: params
				}).then(function (posts) {
					resolve(posts.data);
				}).catch(function (error) {
					reject(error);
				});
			});

			return promise_request;
		}

		/**
   * Make POST request to determinated URL to create a resource.
   *
   * @returns Promise
   */

	}, {
		key: 'createResource',
		value: function createResource(data) {
			var _this2 = this;

			if (!data) {
				throw "data is needed";
				return;
			}
			var route = this.buildUrl();
			var promise_request = new Promise(function (resolve, reject) {
				_this2.http.post(route, data).then(function (data) {
					resolve(data.data);
				}).catch(function (err) {
					reject(err);
				});
			});
			return promise_request;
		}

		/**
   * Make GET request to determinated URL to get a resource.
   *
   * @returns Promise
   */

	}, {
		key: 'findResource',
		value: function findResource(id) {
			var _this3 = this;

			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (!id) {
				throw "ID is needed";
				return;
			}
			var route = this.buildUrl(id);
			var resource_promise = new Promise(function (resolve, reject) {
				_this3.http.get(route, {
					params: params
				}).then(function (item) {
					resolve(item.data);
				}).catch(function (err) {
					reject(err);
				});
			});

			return resource_promise;
		}

		/**
   * Make PUT request to determinated URL to update a resource.
   *
   * @returns Promise
   */

	}, {
		key: 'updateResource',
		value: function updateResource(id, data) {
			var _this4 = this;

			var endpoint = this.buildUrl(id);
			var resource_promise = new Promise(function (resolve, reject) {
				_this4.http.put(endpoint, data).then(function (data) {
					resolve(data.data);
				}).catch(function (err) {
					reject(err);
				});
			});

			return resource_promise;
		}

		/**
   * Make DELETE request to determinated URL to delete a resource.
   *
   * @returns Promise
   */

	}, {
		key: 'deleteResource',
		value: function deleteResource(id) {
			var _this5 = this;

			if (!id) {
				throw "ID to delete is needed";
				return;
			}
			var endpoint = this.buildUrl(id);
			var resource_promise = new Promise(function (resolve, reject) {
				_this5.http.delete(endpoint).then(function (data) {
					resolve(data.data); // Deberiamos definir las convenciones para cuando recibamos una collección
				}).catch(function (err) {
					reject(err);
				});
			});
			return resource_promise;
		}
	}], [{
		key: 'get',
		value: function get() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var service = new this();
			return service.getResource(params);
		}
	}, {
		key: 'create',
		value: function create(data) {
			var service = new this();
			return service.createResource(params);
		}
	}, {
		key: 'find',
		value: function find(id) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var service = new this();
			return service.findResource(id, params);
		}
	}, {
		key: 'delete',
		value: function _delete(id) {
			var service = new this();
			return service.deleteResource(id);
		}
	}, {
		key: 'update',
		value: function update(id, data) {
			var service = new this();
			return service.updateResource(id, data);
		}
	}]);

	return Service;
}();

exports.default = Service;

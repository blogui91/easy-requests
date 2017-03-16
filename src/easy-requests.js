/* 
 *	Easy requests |
 *	(c) 2017 by Cesar Santana 
 */

var axios = require('axios');
var pluralize = require('pluralize');

class Service {
	/**
	 * Create a new instance.
	 *
	 */
	constructor() {
		this.http = axios;
		this.config = {
			origin: window.location.origin,
			prefix: '',
			endpoint: pluralize(this.getClassName())
				.toLowerCase()
		}
	}

	/**
	 * Returns name of the constructor.
	 *
	 * @returns String
	 */

	getClassName() {
		return this.constructor.name;
	}


	/**
	 * Builds url.
	 *
	 * @returns String
	 */

	buildUrl(id = '') {
		let prefix = this.config.prefix;
		let origin = this.config.origin;
		let endpoint = this.config.endpoint;

		return this.sanitizeUrl(origin + "/" + prefix + "/" + endpoint + "/" + id + "/");
	}

	/**
	 * Remove duplicated slashes.
	 *
	 * @returns String
	 */

	sanitizeUrl(endpoint) {
		return endpoint.replace(/([^:])(\/\/+)/g, '$1/');
	}


	/**
	 * Make GET request to determinated URL.
	 *
	 * @returns Promise
	 */

	get(params = {}) {
		var route = this.buildUrl();
		var promise_request = new Promise((resolve, reject) => {
			this.http.get(route, {
					params
				})
				.then((posts) => {
					resolve(posts.data);
				})
				.catch(error => {
					reject(error);
				})
		});

		return promise_request
	}

	/**
	 * Make POST request to determinated URL to create a resource.
	 *
	 * @returns Promise
	 */

	create(data) {
		if (!data) {
			throw "data is needed";
			return;
		}
		var route = this.buildUrl();
		var promise_request = new Promise((resolve, reject) => {
			this.http.post(route, data)
				.then((data) => {
					resolve(data.data);
				})
				.catch((err) => {
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

	find(id, params = {}) {
		if (!id) {
			throw "ID is needed";
			return;
		}
		var route = this.buildUrl(id);
		var resource_promise = new Promise((resolve, reject) => {
			this.http.get(route, {
					params
				})
				.then((item) => {
					resolve(item.data);
				})
				.catch((err) => {
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
	update(id, data) {
		var endpoint = this.buildUrl(id);
		var resource_promise = new Promise((resolve, reject) => {
			this.http.put(endpoint, data)
				.then((data) => {
					resolve(data.data);
				})
				.catch((err) => {
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
	delete(id) {
		var endpoint = this.buildUrl(id);
		var resource_promise = new Promise((resolve, reject) => {
			this.http.delete(endpoint)
				.then((data) => {
					resolve(data.data); // Deberiamos definir las convenciones para cuando recibamos una collección
				})
				.catch((err) => {
					reject(err);
				});
		});
		return resource_promise;
	}
}

export default Service;
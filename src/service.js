var axios = require('axios');
var pluralize = require('pluralize');

class Service {
	constructor() {
		this.http = axios;
		this.config = {
			origin: window.location.origin,
			prefix: '',
			endpoint: pluralize(this.getClassName())
				.toLowerCase()
		}
	}

	getClassName() {
		return this.constructor.name;
	}

	buildUrl(id = '') {
		let prefix = this.config.prefix;
		let origin = this.config.origin;
		let endpoint = this.config.endpoint;

		return this.removeDuplicatedSlashes(origin + "/" + prefix + "/" + endpoint + "/" + id + "/");
	}

	removeDuplicatedSlashes(endpoint) {
		return endpoint.replace(/([^:])(\/\/+)/g, '$1/');
	}

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
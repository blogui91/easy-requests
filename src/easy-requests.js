/* 
 *	Easy requests |
 *	(c) 2017 by Cesar Santana 
 */

var axios = require('axios');
var pluralize = require('pluralize');
var _ = require('lodash');

class Service {
	/**
	 * Create a new instance.
	 *
	 */
	constructor() {
		this.http = axios;
		this.parent_id = null; //important when you are using a model that depends of other, for example http://local.dev/clients/{parent_id}/service/{id}
		this.config = {
			origin: window.location.origin,
			prefix: '',
			endpoint: pluralize(_.kebabCase(this.getClassName()))
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
		let prefix = this.buildPrefix();
		let origin = this.config.origin;
		let endpoint = this.config.endpoint;

		return this.sanitizeUrl(origin + "/" + prefix + "/" + endpoint + "/" + id );
	}


	/**
	 * Builds prefix url.
	 *
	 * @returns String
	 */
    buildPrefix(){
        if(this.parent_id){
            return this.config.prefix + '/' + this.parent_id
        }
        return this.config.prefix
    }

	/**
	 * Remove duplicated slashes.
	 *
	 * @returns String
	 */

	sanitizeUrl(endpoint) {
		return endpoint.replace(/([^:])(\/\/+)/g, '$1/');
	}

	static newInstance() {
		return new this();
	}


	static get(params = {}, parent_id) {
		let service = new this();
		return service.getResource(params, parent_id);
	}

	static create(data, parent_id) {
		let service = new this();
		return service.createResource(data, parent_id);
	}

	static find(id, params = {}, parent_id) {
		let service = new this();
		return service.findResource(id, params, parent_id);
	}

	static delete(id, parent_id) {
		let service = new this();
		return service.deleteResource(id, parent_id);
	}

	static update(id, data, parent_id) {
		let service = new this();
		return service.updateResource(id, data, parent_id);
	}

	/**
	 * Make GET request to determinated URL.
	 *
	 * @returns Promise
	 */

	getResource(params = {}, parent_id = null) {
		this.parent_id = parent_id;
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

	createResource(data, parent_id = null) {
		if (!data) {
			throw "data is needed";
			return;
		}
		this.parent_id = parent_id;
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

	findResource(id, params = {}, parent_id = null) {
		if (!id) {
			throw "ID is needed";
			return;
		}
		this.parent_id = parent_id;
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
	updateResource(id, data, parent_id = null) {
		this.parent_id = parent_id;
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
	deleteResource(id, parent_id = null) {
		if (!id) {
			throw "ID to delete is needed";
			return;
		}
		this.parent_id = parent_id;
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


	handleRequest(data){
		let { method , route , payload , urlParams } = data;

		try{
			method = method.toLowerCase();
		}catch(error){
			console.error("define a valid method, "+method+" received")
		}

		let params = {
			...urlParams
		}

		let resource_promise = new Promise((resolve, reject) => {
			let action

			if(method == 'get' ){
				action = this.http[method](route, {params})
			}else if(method == 'put' || method == 'post' || method == 'patch'){
				action = this.http[method](route, payload)
			}else if(method == 'delete'){
				action = this.http[method](route)
			}

			action
				.then((data) => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
		});

		return resource_promise
	}

}

export default Service;
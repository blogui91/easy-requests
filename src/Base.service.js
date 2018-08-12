/* 
 *  Easy requests |
 *  (c) 2018 by Cesar Santana 
 */

import axios from 'axios'
import pluralize from 'pluralize'
import {
  kebabCase
} from 'lodash'

class Service {
  /**
   * Create a new instance.
   *
   */
  constructor() {
    this._http = axios
    this.parent_id = null //important when you are using a model that depends of other, for example http://local.dev/clients/{parent_id}/service/{id}
    this.config = {
      origin: window.location.origin,
      prefix: '',
      endpoint: pluralize(kebabCase(this.getClassName()))
        .toLowerCase()
    }
  }

  /**
   * Returns name of the constructor.
   *
   * @returns String
   */

  getClassName() {
    return this.constructor.name
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

    return this.sanitizeUrl(origin + "/" + prefix + "/" + endpoint + "/" + id);
  }


  /**
   * Builds prefix url.
   *
   * @returns String
   */
  buildPrefix() {
    if (this.parent_id) {
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
    return new Service();
  }


  static get(params = {}, parent_id) {
    let service = new Service()
    params = service.beforeFetch(params)
    return service.getResource(params, parent_id)
  }

  beforeFind(data) {
    return data
  }
  found(data) {
    return data
  }

  beforeFetch(data) {
    return data
  }
  fetched(data) {
    return data
  }

  beforeCreate(data) {
    return data
  }
  created(created) {
    return created
  }

  beforeUpdate(data) {
    return data
  }
  updated(data) {
    return data
  }

  beforeDelete(data) {
    return data
  }
  deleted(data) {
    return data
  }

  static create(data, parent_id) {
    let service = new Service()
    data = service.beforeCreate(data)
    return service.createResource(data, parent_id)
  }

  static find(id, params = {}, parent_id) {
    let service = new Service()
    id = service.beforeFind(id)
    return service.findResource(id, params, parent_id)
  }

  static delete(id, parent_id) {
    let service = new Service()
    id = service.beforeDelete(id)
    return service.deleteResource(id, parent_id)
  }

  static update(id, data, parent_id) {
    let service = new Service()
    data = service.beforeUpdate(data)
    return service.updateResource(id, data, parent_id)
  }

  /**
   * Make GET request to determinated URL.
   *
   * @returns Promise
   */

  getResource(params = {}, parent_id = null) {
    this.parent_id = parent_id
    var route = this.buildUrl();
    var promise_request = new Promise((resolve, reject) => {
      this._http.get(route, {
          params
        })
        .then((response) => {
          resolve(this.fetched(response));
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
      this._http.post(route, data)
        .then((data) => {
          resolve(this.created(data));
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
      this._http.get(route, {
          params
        })
        .then((response) => {
          resolve(this.found(response));
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
      this._http.put(endpoint, data)
        .then((response) => {
          resolve(this.updated(response));
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
      throw "ID to delete is needed"
      return
    }
    this.parent_id = parent_id
    var endpoint = this.buildUrl(id)
    var resource_promise = new Promise((resolve, reject) => {
      this._http.delete(endpoint)
        .then((data) => {
          resolve(this.deleted(data)) // Deberiamos definir las convenciones para cuando recibamos una collección
        })
        .catch((err) => {
          reject(err)
        })
    })
    return resource_promise
  }


  handleRequest(data, hookName) {
    let {
      method,
      route,
      payload,
      urlParams
    } = data

    try {
      method = method.toLowerCase()
    } catch (error) {
      console.error("define a valid method, " + method + " received")
    }

    let params = {
      ...urlParams
    }

    let resource_promise = new Promise((resolve, reject) => {
      let action

      if (method == 'get') {
        action = this._http[method](route, {
          params
        })
      } else if (method == 'put' || method == 'post' || method == 'patch') {
        action = this._http[method](route, payload)
      } else if (method == 'delete') {
        action = this._http[method](route)
      }

      action
        .then((data) => {
          if (hookName) {
            if (this[hookName]) {
              data = this[hookName](data)
            }
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    })

    return resource_promise
  }

}

export default Service

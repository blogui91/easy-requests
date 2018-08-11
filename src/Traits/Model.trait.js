let BaseModel = (superclass) => class extends superclass {
  props = []
  attributes = {}
  _isBeingDeleted = false
  _isBeingCreated = true
  _isDeleted = false
  _exists = false

  defineColumns (columns, data = null) {
    this.props = columns
    this._run(data)
    return this
  }

  save () {
    const form = this.beforeSave()
    if (this.attributes.id) {
      return this.update()
    }
    this._isBeingCreated = true
    return new Promise((resolve, reject) => {
      this.createResource(form)
        .then(response => {
          this.fill(this.dataToFillAfterSave(response))
          this._setItemExistence(true)
          this._isBeingCreated = false
          resolve(response)
        })
        .catch(error => {
          this._isBeingCreated = false
          reject(error)
        })
    })
  }

  update () {
    const form = this.beforeUpdate()
    const { id } = form
    this._isBeingUpdated = true
    return new Promise((resolve, reject) => {
      this.updateResource(id, form)
        .then(response => {
          this._isBeingUpdated = false
          this.fill(this.dataToFillAfterUpdate(response))
          resolve(response)
        })
        .catch(error => {
          this._isBeingUpdated = false
          reject(error)
        })
    })
  }

  destroy () {
    const form = this.beforeDestroy()
    const { id } = form
    this._isBeingDeleted = true
    return new Promise((resolve, reject) => {
      this.deleteResource(id)
        .then(response => {
          this._isBeingDeleted = false
          this._setItemExistence(false)
          resolve(response)
        })
        .catch(error => {
          this._isBeingDeleted = false
          reject(error)
        })
    })
  }

  fill (data) {
    for (let key in this.attributes) {
      if (typeof data[key] !== 'undefined') {
        this.attributes[key] = data[key]
      }
    }
    return this
  }

  dataToFillAfterSave (axiosResponse) {
    // { "data":{ ... },"status":XXX,"statusText":"","headers":{ ... }","content-type":"application/json  .. etc} ;
    return axiosResponse.data
  }

  dataToFillAfterUpdate (axiosResponse) {
    // { "data":{ ... },"status":XXX,"statusText":"","headers":{ ... }","content-type":"application/json  .. etc} ;
    return axiosResponse.data
  }

  serialize () {
    const attributes = this.beforeSerialize()
    return attributes
  }

  beforeSerialize () {
    return JSON.parse(JSON.stringify(this.attributes))
  }

  beforeUpdate () {
    return JSON.parse(JSON.stringify(this.attributes))
  }

  beforeSave () {
    return JSON.parse(JSON.stringify(this.attributes))
  }

  beforeDestroy () {
    return JSON.parse(JSON.stringify(this.attributes))
  }

  itemExists () {
    return this.attributes.id || false
  }

  _checkExistence (data) {
    if (!data) {
      this._setItemExistence(false)
    } else {
      if (this.itemExists()) {
        this._setItemExistence(true)
      }
    }
  }

  _setItemExistence (status = false) {
    if (status) {
      this._isBeingCreated = false
      this._isDeleted = false
      this._exists = true
    } else {
      this._isBeingCreated = true
      this._exists = false
      this._isDeleted = undefined
    }
  }

  _run (data) {
    // Check if props in an array
    if (this.props.constructor === Array) {
      if (this.props.length > 0 ) {
        this.props.forEach(prop => {
          if (typeof this[prop] === 'undefined') {
            this._defineNewProperty(prop)
            this.attributes[prop] = null
          }
        })
        if (data) {
          this.fill(data)
          this.checkExistence(data)
        }
      } else {
        console.warn('Please make sure of declaring the props for your model!')
      }
    } else if (this.props.constructor === Object) {
      if ((JSON.stringify(this.props) === '{}')) {
        let props = Object.keys(this.props)
        props.forEach(prop => {
          // Create setter and getter for the prop
          this._defineNewProperty(prop)

          // Set defaults
          if (this.props[prop].default) {
            this.attributes[prop] = this.props[prop].default
          }
        })
        if (data) {
          this.fill(data)
          this.checkExistence(data)
        }
      }
    } else {
      console.warn('Please make sure of declaring the props for your model!')
    }
  }

  _defineNewProperty (attribute) {
    var self = this
    var setgetter = {
      get: function get () {
        return self.attributes[attribute]
      },
      set: function set (value) {
        self.attributes[attribute] = value
      },
      enumerable: true
    }
    Object.defineProperty(this, attribute, setgetter)
  }
}

export default BaseModel

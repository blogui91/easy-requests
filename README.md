# Easy requests

## Instalation
```
    npm install easy-requests
    yarn add easy-requests
```

## Description
Easy requests is a small library which you will be able to make CRUD requests in easy manner just by extending a class! 
Now you can also use it like a model (v3)

```js
import Service from 'easy-requests'
class User extends Service
{
  constructor(){
    super({
      baseUrl: 'https://api.example.com/',
      endpoint: 'users', // This value if not specified, will take the name of the current class, sometimes it may not work, as webpack or some bundlers usually changes the name of the variables.
      prefix: 'api'
    });
  }
}
```
Once that you have extended Service class, you may use methods 
```js
var getParams = { per_page : 10 }; 
var findParams = { paramOne : "value" }
[GET] User.get(getParams)         http://domain.com/users?per_page=10
[GET] User.find(id,findParams)    http://domain.com/users/2342?paramOne=value 
[POST] User.create(new_user)      http://domain.com/users   
[PUT] User.update(id) 		  http://domain.com/users/2342		
[DELETE] User.delete(id)	  http://domain.com/users/2342
```
## We also be able to add custom routes like below in next example:

#### PostService.js
```js
import Service from 'easy-requests'

class Post extends Service {
  constructor() {
    super();
  }

  unpublishedPosts(params) {
    let post = new Post()
    let route = post.buildUrl('unpublished-posts'); //http://localhost:8000/my-posts/unpublished-posts 
    return post._http.get(route, {
      params
    })
  }
}

export default Post
```

#### Notes
1. If you don't know how a promise works take a look in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
2. If you have any question about how http request provider works, please check Axios[https://github.com/mzabriskie/axios] Documentation.

#### app.js
```js

import Post from 'services/PostService'  // We don't have to instance our Class anymore! (Like in previous versions below 1.1.0) 

let posts_list = [];
// Option 1
Post.get()
  .then(posts =>{
	  posts_list = posts;
  })
  .catch(error =>{
    console.log('Error :c ', error);
  })

//Option 2
// We can also use it with async/await
posts_list = await Post.get(); //Get Post collection
let post = await Post.find(2);
```

## New feature: Models

Basicaly we just have to import Model and Trait. Where Trait() will allow you to extend your service with extra clases.
```
import {
  Service,
  Model,
  Trait
} from 'easy-requests'

class User extends Trait(Service).use(Model) {
  constructor () {
    super({
      endpoint: 'users'
      baseUrl: 'https://jsonplaceholder.typicode.com/'
    })
    this.defineColumns(['id', 'name', 'username', 'phone', 'email']) // Required
  }
}

const user = new User()
user.fill({
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@email.com',
  phone: '000000000'
})

user.save()   // http://api.carbonodev.com/api/users [POST]
  .then(response => {
    // New user
  })
  .catch(error => {
    throw error
  })

user.update() // http://api.carbonodev.com/api/users/{id} [PUT]
  .then(response => {
    // User updated
  })
  .catch(error => {
    throw error
  })

user.delete() // http://api.carbonodev.com/api/users/{id} [DELETE]
  .then(response => {
    // User deleted
  })
  .catch(error => {
    throw error
  })
```

# Note

You may need to send CSRF-TOKEN header for each request, Most of backend frameworks like Laravel, AdonisJS, SailsJS need it.

You can add it in your class by doing

```js
import Service from 'easy-request'
class Post extends Service
{
  constructor(){
    super();
    this.http.default.headers.common = {
      'X-CSRF-TOKEN': {{YOUR-CSRF-TOKEN}},
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
}
```

Or adding this in your app.js

```js
window.axios = require('axios');

window.axios.defaults.headers.common = {
	'X-CSRF-TOKEN': {{YOUR-CSRF-TOKEN}},
	'X-Requested-With': 'XMLHttpRequest',
};
```

# Contributing

Please feel free in openning an issue if you have any problem or have any idea to improve, even in creating pull requests :)

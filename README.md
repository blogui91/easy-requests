# Easy requests

# V3 IN PROCESS!

## Instalation
```
    npm install easy-requests
```

## description
Easy requests is a small library which you will be able to make CRUD requests in easy manner just by extending a class! 
```js
import Service from 'easy-requests'
class User extends Service
{
  constructor(){
    super();
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

	static unpublishedPosts(params) {
		let PostI = new Post() 
			
		let route = PostI.buildUrl('unpublished-posts'); //http://localhost:8000/my-posts/unpublished-posts 

		let data = {
			route, 
			method : 'delete',
			payload : {
				title : "hello world",
				description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat ipsa tempore a quam, nesciunt, obcaecati temporibus libero dolorem quisquam omnis laborum, quidem eligendi commodi aspernatur esse. Consectetur dolorum, quis quam."
			},
			urlParams : {
				per_page : 5,
				page : 4
			}
		}

		return PostI.handleRequest(data);
	}
}

export default Post
```

#### Notes
##### 1. If you don't know how a promise works take a look in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
##### 2. If you have any question about how http request provider works, please check Axios[https://github.com/mzabriskie/axios] Documentation.

#### app.js
```js

import Post from './services/PostService'  // We don't have to instance our Class anymore! (Like in previous versions below 1.1.0) 

let posts_list = [];
// Option 1

let post_promise = Post.get();

post_promise.then(posts =>{
	posts_list = posts;
}).catch(error =>{
    console.log("Error :c ", error);
})


//Option 2
// We can also use it with async/await 2017!!
async function getMyPosts() {

	posts_list = await Post.get(); //Get Post collection

	let post = await Post.find(2, {
		published: true 
	});  //Params which axios will send as http://mydomain.com/posts?published=true

	let post = await Post.getUnpublishedPosts();
	
	console.log("this is my post Object!: ", post);
}

getMyPosts();

## New feature: Models

Basicly we just have to import Model and Trait. Where Trait() will allow you to extend your service with extra clases.

import {
  Service,
  Model,
  Trait
} from '../src/easy-requests'

class User extends Trait(Service).use(Model) {
  constructor () {
    super()
    this.config.endpoint = 'users'
    this.config.origin = 'https://jsonplaceholder.typicode.com/'
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

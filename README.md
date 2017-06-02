# Easy requests

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

	static customMethod() {
		let PostService = new Post();

		let route = PostService.buildUrl('unpublished') //this line build our full route returning something like http://localhost:8000/posts/unpublished/

		// We are creating a function that receives two params to resolve and reject a promise,
		let request = (resolve, reject) => {
			//PostService.http.{verb} Allow us to make the http request  using the verbs [GET|POST|DELETE|PUT] etc
			PostService.http.get(route)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		}
		// basicly this is the structure that a promise instance must receive which it will be declared below. 	

		// Create a promise which will resolve our request , 
		let request_promise = new Promise(request)

		return request_promise;
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

	let postsList = await Post.get(); //Get Post collection
	
	// You don't need to resolve it as a promise!
	posts_list = postsList;

	let post = await PostService.find(2, {
		published: true 
	});  //Params which axios will send as http://mydomain.com/posts?published=true

	let post = await PostService.getUnpublishedPosts();
	
	console.log("this is my post Object!: ", post);
}

getMyPosts();
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


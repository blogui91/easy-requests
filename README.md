# Easy requests

## Instalation
```
    npm install easy-requests-js
```

## description
Easy requests is a small library which you will be able to make CRUD requests in easy manner just by extending a class! 
```js
import Service from 'easy-request'
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
## We also be able to add custom routes like below and the next example:

#### PostService.js
```js
import Service from 'easy-request'

class Post extends Service { //Endpointname depends of class name
	constructor() {
		super();

		//Overriding values
		this.config.origin = "http://localhost:8000"; //http://localhost:8000/posts
		this.config.endpoint = '/my-posts'; // we override endpoint default name to, http://localhost:8000/my-posts 
		//this.config.prefix = 'admin'; //http://localhost:8000/admin/my-posts
	}

	//Custom methods
	getUnpublishedPosts(params) {
		var route = this.buildUrl() + "/unpublished-posts"; //http://localhost:8000/my-posts/unpublished-posts 

		//if you want to send params to the url, send it as second parameter in this.http.get function
		// for more information check axios documentation [https://github.com/mzabriskie/axios]
		var request_promise = new Promise((resolve, reject) => {
			this.http.get(route, {
					params
				})
				.then(response => {
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});

		return request_promise;
	}
}
```

#### app.js
```js
import PostService from './services/PostService'

let posts_list = [];
let Post = new PostService();

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


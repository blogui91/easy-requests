# Easy requests
##Example:

```
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

myApp.js
```
var PostService = new Post();

//Use it with async/await ES7!!

async function getMyPosts() {
	let postsList = await PostService.get(); //Get Post collection

	postsList.forEach(post => {
		console.log(post.title);
	});

	let post = await PostService.find(2, {
		published: true //Params which axios will send as http://mydomain.com/posts?published=true
	});


	let post = await PostService.getUnpublishedPosts({  //Custom service
		published : false //Params which axios will send as http://mydomain.com/posts?published=false
	});

	console.log("this is my post Object!: ", post);
}


getMyPosts();


```

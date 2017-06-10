require("babel-core/register");
require("babel-polyfill");

import Service from '../src/easy-requests'

class Post extends Service { //Endpointname depends of class name
	constructor() {
		super();

		//Overriding values
		//this.config.origin = "http://localhost:8000"; //http://localhost:8000/posts
		//this.config.endpoint = '/my-posts'; // we override endpoint default name to, http://localhost:8000/my-posts 
		//this.config.prefix = 'admin'; //http://localhost:8000/admin/my-posts

		this.config.origin = 'http://jsonplaceholder.typicode.com'
	}


	static getUnpublishedPosts(params) {
		let PostI = new Post() 
		let route = PostI.buildUrl() //+ "/unpublished-posts"; //http://localhost:8000/my-posts/unpublished-posts 

		//if you want to send params to the url, send it as second parameter in this.http.get function
		// for more information check axios documentation [https://github.com/mzabriskie/axios]
		let request_promise = new Promise((resolve, reject) => {
			PostI.http.get(route, {
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

	static unpublishedPosts(params) {
		let PostI = new Post() 
			
		let route = PostI.buildUrl(); //http://localhost:8000/my-posts/unpublished-posts 

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

//Use it with async/await ES7!!

 function getMyPosts() {
	let postsList =  Post.unpublishedPosts(); //Get Post collection

	postsList.then(success => {
		document.write(JSON.stringify(success))
	})

	
 }

getMyPosts();
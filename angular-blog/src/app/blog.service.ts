import { Injectable } from '@angular/core';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}


@Injectable({
  providedIn: 'root'
})
export class BlogService {
	fetchPosts(username: string): Promise<Post[]>{
		let posts: Post[] = [];
		fetch(`api/${username}`)
			.then(function(response){
					if (response.status != 200){
						console.log("Error sending request. Error code: " + response.status);
						return;
					}
					else{
						let resposts = JSON.parse(response);
						for (let post of resposts){
							let newpost: Post = {
								postid: post.postid,
								created: post.created,
								modified: post.modified,
								title: post.title,
								body: post.body
							};
							posts.push(newpost);

						}
					}
				});
		return posts;
	}
  constructor() { }
}

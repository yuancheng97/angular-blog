import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,of } from 'rxjs';

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
	private current: Post;
	public isDraftNew:boolean;
	//posts is the current posts in the list
	public posts: Post[];
	private handleError(err: any): Promise<any>{
		console.log(err.message);
		return Promise.reject(new Error(String(err.status)));
	}

	public currentUser: string;

	private parseJWT(token) 
	{
	    let base64Url = token.split('.')[1];
	    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	    let obj = JSON.parse(atob(base64));
	    return obj.usr;
	}

  constructor(private http: HttpClient) { 
  	if (!document.cookie){
  		alert("Please login.");
  		return;
  	} else{
  		this.currentUser = this.parseJWT(document.cookie)
  	}

  }


	fetchPosts(username: string): Promise<Post[]>{
		let url = `/api/${username}`;
		return this.http.get<Post []>(url).toPromise()
		.catch(this.handleError);
		
	}

	getPost(username: string, postid: number): Promise<Post> {
		let url = `/api/${username}/${postid}`;
		return this.http.get<Post>(url).toPromise()
		.catch(this.handleError);
	}

	newPost(username: string, post: Post): Promise<void> {
		let postid = post.postid;
		let url = `/api/${username}/${postid}`;
		return this.http.post<Post>(url, post).toPromise()
		.catch(this.handleError);
	}

	updatePost(username: string, post: Post): Promise<void> {
		let postid = post.postid;
		let url = `/api/${username}/${postid}`;
		return this.http.put<Post>(url, post).toPromise()
		.catch(this.handleError);		
	}

	deletePost(username: string, postid: number): Promise<void> {
		let url = `/api/${username}/${postid}`;
		return this.http.delete(url).toPromise()
		.catch(this.handleError);		
	}


	setCurrentDraft(post: Post): void{
		this.current = post;
	}

	getCurrentDraft(): Post{
		return this.current;
	}

/*
	fetchPosts(username: string): Promise<Post[]>{
		return new Promise<Post []>( (resolve, reject) =>{
			fetch(`api/${username}`).then(
				function(response){
					if (response.status != 200){
						reject(new Error(String(response.status)));
					}
					else{
						let posts: Post[] = [];						
						let resposts = JSON.parse(response.text());
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
						resolve(posts);
					}
			});
		});
	}
*/
}

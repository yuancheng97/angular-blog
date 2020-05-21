import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	selectedPost: Post;

	posts: Post[];

	username: String;

	messages: String[] = [];

  constructor(private blogService: BlogService) { 

  }

  ngOnInit(): void {
  	this.getPost();

  }

  getPost(): void {
  	this.blogService.fetchPosts(this.blogService.currentUser)
  		.then(posts => this.posts = posts);
  }

  onSelect(post: Post): void{
  	this.blogService.setCurrentDraft(post);
  	this.selectedPost = post;

  	this.messages.push(`Selected the post with id = ${post.postid} and title = ${post.title}`);
  }

  onNew(): void{
  	let postid: number = -1;
  	for (let post of this.posts){
  		postid = Math.max(post.postid, postid);
  	}
  	let newPost: Post = {
  		postid: postid+1,
  		created: new Date(Date.now()),
  		modified: new Date(Date.now()),
  		title:"",
  		body:""
  	}
  	this.blogService.setCurrentDraft(newPost);

  	this.messages.push(`Created the post with id = ${newPost.postid}`);

  }

}

import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Input } from '@angular/core';
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

  @Input() refresh():void{
    console.log("refreshing");
    this.getPost();
  }

  constructor(private blogService: BlogService, private router: Router) { 

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
    this.blogService.isDraftNew = false;
  	this.selectedPost = post;
    let url = `/edit/${post.postid}`;
    this.router.navigateByUrl(url);

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
    this.blogService.isDraftNew = true;
    let url = `/edit/${newPost.postid}`;
    this.router.navigateByUrl(url);
  	this.messages.push(`Created the post with id = ${newPost.postid}`);


  }

}

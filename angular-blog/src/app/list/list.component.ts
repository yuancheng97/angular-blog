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

	//posts: Post[];

	username: String;

  /*@Input() refresh():void{
    console.log("refreshing");
    this.getPost();
  }*/

  constructor(public blogService: BlogService, private router: Router,
    private route: ActivatedRoute) { 
    //this.route.paramMap.subscribe(() => this.getPost());
  }

  

  ngOnInit(): void {
  	this.getPost();

  }

  getPost(): void {
  	this.blogService.fetchPosts(this.blogService.currentUser)
      .then(
        //posts => this.posts = posts
          posts=>this.blogService.posts = posts
        );
  }

  onSelect(post: Post): void{
  	this.blogService.setCurrentDraft(post);
    this.blogService.isDraftNew = false;
  	this.selectedPost = post;
    let url = `/edit/${post.postid}`;
    this.router.navigateByUrl(url);
  }

  onNew(): void{
  	let postid: number = -1;
    for (let post of this.blogService.posts){
  		postid = Math.max(post.postid, postid);
  	}
  	let newPost: Post = {
  		postid: postid+1,
  		created: new Date(),
  		modified: new Date(),
  		title:"",
  		body:""
  	}
  	this.blogService.setCurrentDraft(newPost);
    this.blogService.isDraftNew = true;
    let url = `/edit/${newPost.postid}`;
    this.router.navigateByUrl(url);


  }

}

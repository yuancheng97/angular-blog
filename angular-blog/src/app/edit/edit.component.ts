import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})


export class EditComponent implements OnInit {
	post: Post ;
	body: string;
	title: string;
	isNew: boolean;
	//@Output() refresh = new EventEmitter<number>();

	constructor(private blogService: BlogService, private location: Location, 
	 private route: ActivatedRoute,private router:Router) { 
		this.route.paramMap.subscribe(() => this.getPost());}

	ngOnInit(): void {
		this.getPost();
	}
	preview():void{
		this.blogService.setCurrentDraft(this.post);
		let url = `/preview/${this.post.postid}`;
    	this.router.navigateByUrl(url);
		
	}
	save():void{
		console.log("new flag: "+this.blogService.isDraftNew);
		console.log("post title: "+this.post.title);
		console.log("post body: "+this.post.body);
		console.log("record title: "+this.title);
		console.log("record body: "+this.body);
		if(!this.blogService.isDraftNew && this.post.title == this.title &&this.post.body== this.body)
			return;
		if(this.blogService.isDraftNew){
			//new post
			this.blogService.newPost(this.blogService.currentUser,this.post).then(
				()=>{
				  	this.blogService.fetchPosts(this.blogService.currentUser)
  					.then(posts=>{
  						this.blogService.posts = posts;
  						console.log("post size is: "+this.blogService.posts.length);
  						console.log("made new post");}
  						)
					
				}
				)
		}
		else{
			//changed old post
			this.blogService.updatePost(this.blogService.currentUser,this.post).
			then(()=>{
				
				this.blogService.fetchPosts(this.blogService.currentUser)
  					.then(posts=>{
  						this.blogService.posts = posts;
  						console.log("posts size is: "+this.blogService.posts.length);
						console.log("updated the post");
					})
					
			}
			);

		}

	}

	delete():void{
		if(this.blogService.isDraftNew){
			this.router.navigate(['/']);
			return;
		}
		this.blogService.deletePost(this.blogService.currentUser,this.post.postid).
		then(()=>{
			this.blogService.fetchPosts(this.blogService.currentUser)
				.then(posts=>{
					this.blogService.posts = posts;
					console.log("posts size is: "+this.blogService.posts.length);
					console.log("deleted the post");
					this.router.navigate(['/']);
			})
			}).catch(err=>console.log(err));
	}

	/*
	goBack(): void {
	  this.location.back();
	}
*/
	getPost(): void {
		
		const postid = +this.route.snapshot.paramMap.get('id');
		console.log("id in url: "+postid);
		console.log("draft: "+this.blogService.getCurrentDraft());
		this.post = this.blogService.getCurrentDraft();
		if(!this.post|| this.post.postid!=postid){
			//direct url acess from outside
		
		  	this.blogService.getPost(this.blogService.currentUser,postid)
		    .then(post => {
		    	this.post = post;
		    	this.title = this.post.title;
				this.body = this.post.body;
				this.blogService.isDraftNew = false;
				}
		    ).
		    catch(err=>
		    	{console.log(err);
		    	alert("wrong postid");
		    	this.router.navigate(['/']);
		    	}
		    )
		}
		else{
			//from new or clicking
			
			this.title = this.post.title;
			this.body = this.post.body;
		}


	}
}

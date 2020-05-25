import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute,Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
	private post: Post;
	private body: string;
	private title: string;
	parsedBody: string;
	parsedTitle: string;

  constructor(private blogService: BlogService, private route: ActivatedRoute,
  	private router:Router) {
	this.route.paramMap.subscribe(() => this.getPost());}

  ngOnInit(): void {
  	this.getPost();
  }

  edit(): void{
  	let url=`edit/${this.post.postid}`;
  	this.router.navigateByUrl(url);
  }

  getPost(): void {
  	const postid = +this.route.snapshot.paramMap.get('id');
	console.log("id in url: "+postid);
	console.log("draft: "+this.blogService.getCurrentDraft());
	this.post = this.blogService.getCurrentDraft();

	let htmlRenderer = new HtmlRenderer();
	let parser = new Parser();

	if(!this.post|| this.post.postid!=postid){
		//direct url acess from outside
	
	  	this.blogService.getPost(this.blogService.currentUser,postid)
	    .then(post => {
	    	this.post = post;
	    	this.title = this.post.title;
			this.body = this.post.body;
			this.parsedBody = htmlRenderer.render(parser.parse(this.body));
			this.parsedTitle = htmlRenderer.render(parser.parse(this.title));
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
		this.parsedBody = htmlRenderer.render(parser.parse(this.body));
		this.parsedTitle = htmlRenderer.render(parser.parse(this.title));

	}



  }

}

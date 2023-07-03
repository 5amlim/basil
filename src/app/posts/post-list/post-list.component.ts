import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']

})

export class PostListComponent implements OnInit, OnDestroy {
    posts : Post[] = []
    isLoading = false
    private postsSub: Subscription = new Subscription();

    constructor(private postsService: PostsService ) {
    }

    ngOnInit() {
        this.isLoading = true
        this.postsService.getPosts()
        this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => { 
                this.isLoading = false
                this.posts = posts
            }
        )
    }

    onDelete(postId:string){
        console.log(postId)
        this.postsService.deletePost(postId)
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    } 
}
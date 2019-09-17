import { Component, ViewChild, ElementRef } from "@angular/core";
import { AuthProvider } from '../../providers/auth/auth';
import { HomeProvider } from '../../providers/home/home';
import {
  IonicPage,
  NavParams,
  Content,
  Events,
  ViewController
} from "ionic-angular";

import moment from 'moment';

@IonicPage()
@Component({
  selector: "page-modal-comments",
  templateUrl: "modal-comments.html"
})
export class ModalCommentsPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  showEmojiPicker = false;

  private comments: Array<any>;
  private post: string;
  private postId: number;
  private user: IUser;

  constructor(
    private authProvider: AuthProvider,
    private homeProvider: HomeProvider,
    navParams: NavParams,
    private viewCtrl: ViewController,
    private events: Events
  ) {
    this.postId = parseInt(navParams.get('postId'));
    this.user = this.authProvider.getUserInfo();
    this.comments = [];
    this.loadComments();
  }

  private loadComments() {
    this.homeProvider.getPostComments(this.postId)
    .finally(() => {
      //
    })
    .subscribe((res) => {
      console.log("load comments success:", res);
      res.comentarios.map(comment => {
        comment.fechaRegistro = moment(comment.fechaRegistro).fromNow();
      })
      this.comments = res.comentarios;
    }, err => {
      console.log('load comments error:', err);
    })
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.focus();
    }, 500);
  }

  /*switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }*/

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  postComment() {
    if(this.post != undefined || this.post != null || this.post.trim() != '') {
      this.homeProvider.postComment(this.user.email, this.postId, this.post)
      .finally(() => {
        //Do something...
      })
      .subscribe(
        res => {
          console.log("post comment success:", res);
          this.comments.push({
            comentario: this.post,
            nombreUsuario: this.user.displayName,
            fechaRegistro: moment().fromNow(),
          });
          this.post = '';
          let numComments = 1;
          this.events.publish('home:commentsCount', numComments);
        },
        err => {
          console.log("post comment error:", err);
        }
      );
    }
  }

  dismissView() {
    this.viewCtrl.dismiss();
  }
}

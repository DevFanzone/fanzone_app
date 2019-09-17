import { Component, NgZone, ViewEncapsulation } from "@angular/core";
import { NavController, IonicPage, InfiniteScroll, NavParams, ModalController, Events, Platform } from "ionic-angular";
import { HomeProvider } from "../../providers/home/home";
import { AppSettings } from "../../utils/setting";
import { SocialSharing } from "@ionic-native/social-sharing";

import "rxjs/add/operator/finally";
import { Observable } from "rxjs/Observable";

import { AuthProvider } from "../../providers/auth/auth";
import { MessageProvider } from "../../providers/message/message";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Storage } from '@ionic/storage';
import { MyApp } from "../../app/app.component";
import { VgAPI } from "videogular2/src/core/services/vg-api";

@IonicPage({
  segment: "home/:isExclusive/:keyword"
})
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  private subscriptionReq: any;
  private currentAudio: any;

  private loading: boolean;
  private isRefresh: boolean;
  private menuLoaded: boolean;

  private isSearch: boolean;
  private isGeneralPost: boolean;
  private isExclusive: boolean;
  private keyword: string;
  private currentInfiniteScroll: InfiniteScroll;

  private maxItemPerPage: number;
  private offset: number;

  private maxItemPerPageAds: number;
  private offsetAds: number;
  private postsAds: Array<any>;

  private user: IUser;
  private collectionId: number;
  private collections: Array<any>;
  private posts: Array<any>;

  private splashView: Array<any>;
  private BtnDalay: Array<any>;
  private api: VgAPI;
  private idVideo: any;
  private target: any;
  private inWait = false;
  private videoInView: number;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private homeProvider: HomeProvider,
    private messageProvider: MessageProvider,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    private events: Events,
    private ngZone: NgZone,
    private storage: Storage,
    private myapp: MyApp,
    private platform: Platform
  ) {
    this.isSearch = false;
    this.isExclusive = this.navParams.get("isExclusive") == 1;
    this.keyword = this.navParams.get("keyword");

    this.loading = true;
    this.menuLoaded = false;
    this.user = this.authProvider.getUserInfo();
    this.posts = [];
    this.maxItemPerPage = 4;
    this.maxItemPerPageAds = 1;
    this.offsetAds = 0;
    this.listenEvents();
    this.BtnDalay = [];

    platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        var videos = document.getElementsByTagName("video");
        for (var i = 0; i < videos.length; i++) {
          videos[i].pause();
        }
      });
    });

  }

  ionViewDidLoad() {
    this.authProvider.login().subscribe(
      res => {
        this.authProvider.setApiToken(res.access_token);

        this.loadMenu();
      },
      err => {
        console.log("Error login:", err);
      }
    );
  }

  private cancelSubscription(): void {
    if (this.subscriptionReq) this.subscriptionReq.unsubscribe();
  }

  private loadMenu() {
    this.cancelSubscription();
    this.menuLoaded = false;
    this.loading = true;
    this.posts = [];
    this.subscriptionReq = this.homeProvider.getCollections(AppSettings.ATLETA_ID).subscribe(
      res => {
        this.collections = res.categorias;
        this.collections.forEach((e, i) => {
          this.BtnDalay[e.id] = false;
        });

        this.menuLoaded = true;

        if (this.keyword) {
          this.onSearch(this.keyword);
        } else {
          this.loadPosts();
        }

      },
      err => {
        console.log("Error:", err);
      }
    );
  }

  private listenEvents() {
    this.events.subscribe("home:onSearch", keyword => {
      this.onSearch(keyword);
    });
    this.events.subscribe("home:exclusiveContent", () => {
      this.exclusiveContent();
    });
    this.events.subscribe("home:normalContent", () => {
      this.normalContent();
    });
  }

  exclusiveContent() {
    this.isExclusive = true;
    this.loadPosts();
  }

  normalContent() {
    this.isExclusive = false;
    this.loadPosts();
  }

  doRefresh(event) {
    this.isRefresh = true
    this.loadPosts()

    setTimeout(() => {
      event.complete();
      this.isRefresh = false;
    }, 2000);
  }

  public loadPosts() {
    this.cancelSubscription();
    if (this.inWait === false) {
      this.inWait = true;
      if (this.currentInfiniteScroll) this.currentInfiniteScroll.enable(true);
      this.isSearch = false;
      this.loading = true;
      this.collectionId = undefined;
      this.isGeneralPost = true;
      this.offset = 0;
      this.offsetAds = 0;
      this.posts = [];
      this.postsAds = [];

      let loadPosts: Observable<any> = this.isExclusive
        ? this.homeProvider.getExclusivePosts(AppSettings.ATLETA_ID, this.maxItemPerPage, this.offset)
        : this.homeProvider.getLatestPosts(AppSettings.ATLETA_ID, this.maxItemPerPage, this.offset);

      this.subscriptionReq = loadPosts
        .subscribe(async res => {
          console.log("success:", res);
          for (let i = 0; i < res.publicaciones.length; i++) {
            this.offset++;
            await this.getSponsoredPosts(res.publicaciones[i], this.offset);
          }
          this.loading = false;
        },
          err => {
            this.loading = false;
            console.log("Error:", err);
          }
        );

      setTimeout(() => {
        this.inWait = false
      }, 1500)
    }
  }

  onPlayerReady(api: VgAPI) {
    this.cdOfVideo()
    this.api = api;
  }

  functionToTriggerOnScroll() {
    var vids = document.getElementsByTagName('video')
    for (var i = 0; i < vids.length; i++) {
      //#t=0.1
      if (this.isElementInViewport(vids.item(i))) {
        // animate charts...
        if (this.videoInView != i && (vids.item(i).paused || vids.item(i).ended || vids.item(i).seeking || vids.item(i).readyState < vids.item(i).HAVE_FUTURE_DATA)) {
          const mainVideo: HTMLVideoElement = <HTMLVideoElement>vids.item(i);
          mainVideo.play();
          this.videoInView = i;
          //mainVideo.muted = true;
        }
      } else {
        if (this.videoInView == i) this.videoInView = undefined;
        const mainVideo: HTMLVideoElement = <HTMLVideoElement>vids.item(i);
        mainVideo.pause();
      }
    }
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  loadCollectionPosts(collectionId: number, urlSplah: string, lastUpdateSplash: any) {
    this.cancelSubscription();
    if (this.inWait === false) {
      this.inWait = true;
      this.isSearch = false;
      if (this.currentInfiniteScroll) this.currentInfiniteScroll.enable(true);
      this.loading = true;
      this.collectionId = collectionId;
      this.isGeneralPost = false;
      this.offset = 0;
      this.offsetAds = 0;
      this.posts = [];
      this.postsAds = [];

      this.BtnDalay[collectionId] = true;
      setTimeout(() => {
        this.BtnDalay[collectionId] = false
      }, 2000);

      /*var objAux = {status: true, date:new Date()};
      this.storage.set('splash'+collectionId, JSON.stringify(objAux));*/

      if (urlSplah) {
        this.storage.get('splash' + collectionId).then((val) => {
          var obj = JSON.parse(val);
          if (obj == null || !obj['status'] || obj['date'] != lastUpdateSplash) {

            /*=== Set url and enable splash ===*/
            this.myapp.splashView = true;
            this.myapp.splashImage = urlSplah
            /*=== Set url and enable splash ===*/

            var objAux = { status: true, date: lastUpdateSplash };
            this.storage.set('splash' + collectionId, JSON.stringify(objAux));
            this.myapp.eventSplash();
          }
        });
      }

      this.subscriptionReq = this.homeProvider
        .getPostsInCollection(collectionId, this.maxItemPerPage, this.offset)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(async res => {
          for (let i = 0; i < res.publicaciones.length; i++) {
            this.offset++;
            this.getSponsoredPosts(res.publicaciones[i], this.offset).then(() => {
              this.functionToTriggerOnScroll();
            });
          }
          this.loading = false;
        },
          err => {
            console.log("Error:", err);
          });
      setTimeout(() => {
        this.inWait = false
      }, 1000)
    }
  }

  morePosts(infiniteScroll: InfiniteScroll) {
    this.cancelSubscription();

    this.currentInfiniteScroll = infiniteScroll;
    let loadPosts: Observable<any> = this.isGeneralPost ? (this.isExclusive)
      ? this.homeProvider.getExclusivePosts(AppSettings.ATLETA_ID, this.maxItemPerPage, this.offset)
      : this.homeProvider.getLatestPosts(AppSettings.ATLETA_ID, this.maxItemPerPage, this.offset)
      : this.homeProvider.getPostsInCollection(this.collectionId, this.maxItemPerPage, this.offset);

    this.subscriptionReq = loadPosts
      .finally(() => {
        infiniteScroll.complete();
      })
      .subscribe(async res => {
        let auxPosts = res.publicaciones;
        if (auxPosts.length > 0) {
          for (let i = 0; i < res.publicaciones.length; i++) {
            this.offset++;
            await this.getSponsoredPosts(res.publicaciones[i], this.offset);
          }
        } else {
          infiniteScroll.enable(false);
        }
      },
        err => {
          alert(err);
        }
      );
  }

  private getSponsoredPosts(post: any, offset: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (offset % 4 == 0) {
        this.homeProvider.getSponsoredPosts(AppSettings.ATLETA_ID, this.maxItemPerPageAds, this.offsetAds).subscribe(data => {
          this.posts = this.posts.concat(data.publicaciones);
          this.offsetAds = this.offsetAds + this.maxItemPerPageAds;

          this.posts.push(post);

          setTimeout(() => {
            resolve('ok');
          }, 1000);
        }, err => {
          console.log("Error" + err);
          reject(err);
        }
        );
      } else {
        this.posts.push(post);
        resolve('ok');
      }
    });
  }

  private getSponsoredSearchPosts(maxItemPerPageAds: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.homeProvider.getSponsoredPosts(AppSettings.ATLETA_ID, maxItemPerPageAds, this.offsetAds).subscribe(
        data => {
          this.postsAds = this.postsAds.concat(data.publicaciones);
          this.offsetAds = this.offsetAds + maxItemPerPageAds;
          resolve(data.publicaciones);
        },
        err => {
          reject("Error" + err)
        }
      );
    });
  }

  private onSearch(keyword: string) {
    this.cancelSubscription();

    this.isSearch = true;
    this.loading = true;
    this.offset = 0;
    this.offsetAds = 0;
    this.posts = [];
    this.postsAds = [];
    this.subscriptionReq = this.homeProvider
      .searchPosts(AppSettings.ATLETA_ID, keyword)
      .subscribe(async res => {
        let auxPost = res.publicaciones;
        await this.getSponsoredSearchPosts(parseInt((auxPost.length / 3).toString()));
        this.posts = this.mergeSearchPosts(auxPost, this.postsAds);
        this.loading = false;
      },
        err => {
          this.loading = false;
          console.log("Search post error:", err);
        }
      );
  }

  private mergeSearchPosts(posts, postsAds): Array<any> {
    let auxPosts = posts;
    let newArrayPosts = [];
    let auxAds = 0;
    for (let i = 0; i < auxPosts.length; i++) {
      if (i % 3 == 0) {
        if (auxAds < postsAds.length) {
          if (i > 0) {
            newArrayPosts.push(postsAds[auxAds]);
          }
        }
        newArrayPosts.push(auxPosts[i]);
        auxAds++;
      } else {
        newArrayPosts.push(auxPosts[i]);
      }
    }
    return newArrayPosts;
  }

  shareViaFacebook(post: any): void {
    if (this.user.isPremium) {
      let image: string = "";
      if (post.media.length > 0) {
        image = post.media[0].urlArchivoOriginal;
      }
      this.socialSharing.shareViaFacebook(post.descripcionPost, image);
    } else {
      post.addAnim = true;
    }
  }

  shareViaTwitter(post: any): void {
    if (this.user.isPremium) {
      let image: string = "";
      if (post.media.length > 0) {
        image = post.media[0].urlArchivoOriginal;
      }
      this.socialSharing.shareViaTwitter(post.descripcionPost, image);
    } else {
      post.addAnim = true;
    }
  }

  openModalComments(post: any) {
    if (this.user.isPremium || (post.commentsCount > 0 && !this.user.isPremium)) {
      let modalComments = this.modalCtrl.create("ModalCommentsPage", {
        postId: post.id
      });

      modalComments.onWillDismiss(() => {
        this.events.unsubscribe("home:commentsCount");
      });
      modalComments.present();
      this.events.subscribe("home:commentsCount", (numComments: number) => {
        post.commentsCount += numComments;
      });
    }
    if (!this.user.isPremium) {
      post.addAnim = true;
    }
  }

  postLike(post: any) {
    if (this.user.isPremium) {
      this.homeProvider
        .postLike(this.user.email, post.id)
        .finally(() => {
          //Do something...
        })
        .subscribe(
          res => {
            let message = "Like in post success.";
            if (res.errorAPI) {
              message = "You have already done like in this post";
            } else {
              post.likesCount++;
            }
            this.messageProvider
              .toastAlert({ message, duration: 2000 })
              .present();
          },
          err => {
            console.log("post like error:", err);
          }
        );
    } else {
      post.addAnim = true;
    }
  }

  openShopify(): void {
    this.iab.create(AppSettings.URL_SHOPIFY, "_blank");
  }

  handleVideo(myVideo: any) {
    this.ngZone.run(() => {
      var videos = document.getElementsByTagName("video");
      for (var i = 0; i < videos.length; i++) {
        if (videos[i] != myVideo) {
          if (!videos[i].paused) {
            videos[i].pause();
          }
        }
      }
    });
  }

  playAudio(myAudio: any) {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    this.currentAudio = myAudio;
    myAudio.play();
  }

  mute(media) {
    if (media.muted == false) {
      media.muted = true;
    } else {
      media.muted = false;
    }
  }

  // Método para validar autoplay de los videos en slides y primer video
  cdOfVideo() {
    var vids = document.getElementsByTagName('video')
    for (var i = 0; i < vids.length; i++) {
      if (this.isElementInViewport(vids.item(i))) {
        vids.item(i).play();
      } else {
        vids.item(i).pause();
      }
    }
  }
}

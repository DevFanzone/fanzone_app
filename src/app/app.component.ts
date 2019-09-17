import { Component, ViewChild, ElementRef } from "@angular/core";
import { Platform, Nav, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MessageProvider } from "../providers/message/message";
import { AuthProvider } from "../providers/auth/auth";
import { ImageLoaderConfig } from "ionic-image-loader";
import { NetworkProvider } from "../providers/network/network";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('splasLife') splasLife: ElementRef;
  rootPage: any = "SplashPage";
  splashView: boolean;
  splashImage: string;
  timeSaplash : any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private events: Events,
    private auth: AuthProvider,
    private message: MessageProvider,
    private networkProvider: NetworkProvider,
    private imageLoaderConfig: ImageLoaderConfig
  ) {
    platform.ready().then(() => {
      this.configImageLoader();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if (platform.is("android")) {
        statusBar.backgroundColorByHexString("#9f2307");
      } else {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString("#9f2307");
      }
      statusBar.styleLightContent();

      splashScreen.hide();

      this.registerEvents();

    });

    this.splashView = false;
    this.splashImage = '';
  }


    touchend(event){
      console.log(event);
      clearTimeout(this.timeSaplash);
      this.splasLife.nativeElement.setAttribute("class","splashView2 animated bounceOut");
      var root = this;
      setTimeout(()=>{ root.splashView = false; }, 500);
      //this.splasLife.nativeElement.setAttribute("style","visibility: hidden;");
    }

    eventSplash(){
      clearTimeout(this.timeSaplash);
      var root = this;
      this.timeSaplash = setTimeout(() => {
          root.splasLife.nativeElement.setAttribute("class","splashView2 animated bounceOut");
          var root2 = this;
        setTimeout(()=>{ root2.splashView = false;}, 500);
      }, 4000);
    }

  private configImageLoader() {
    // enable debug mode to get console logs and stuff
    this.imageLoaderConfig.enableDebugMode();
    // set a fallback url to use by default in case an image is not found
    this.imageLoaderConfig.setFallbackUrl('assets/imgs/tile-empty.png');

    this.imageLoaderConfig.setImageReturnType('base64');

    //this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setSpinnerColor('redturn');
    this.imageLoaderConfig.setSpinnerName('bubbles');

    this.imageLoaderConfig.maxCacheSize = ((2 * 1024 * 1024) * 10);
    this.imageLoaderConfig.maxCacheAge = 60 * 9000;
  }

  public registerEvents() {
    this.events.subscribe("auth:unauthorized", () => {
      this.nav.setRoot('HomePage', {isExclusive: 0});
      /*this.auth
        .logout()
        .then(() => {
          this.nav.setRoot("LoginPage").then(() => {
            this.message.showAlertMessage(
              "For security your session expired, please log in again",
              "Session expired"
            );
          });
        })
        .catch(err => {
          this.message.showAlertMessage(err);
        });*/
    });

    this.events.subscribe("ui:showHeader", () => {

    })
  }
}

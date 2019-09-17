import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { MessageProvider } from '../../providers/message/message';


@IonicPage()
@Component({
  selector: "page-support",
  templateUrl: "support.html"
})
export class SupportPage {
  form1: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private messageProvider: MessageProvider
  ) {
    this.form1 = formBuilder.group({
      email: ["",Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$"),Validators.required])],
      name: ["", Validators.required],
      body: ["", Validators.required]
    });
  }

  composeEmail() {

    let issue = `${this.form1.controls['body'].value} <br/> ${this.form1.controls['name'].value} <br/> ${this.form1.controls['email'].value}`;

    this.messageProvider.supportEmail('Support Adrián González', issue).subscribe(
      res =>{

       let  msg = res.errorAPI 
          ? 'Error: Email not sent correctly.'
          : 'Email sent correctly.'

          this.messageProvider.toastAlert({
          duration: 3000,
          message: msg      
        }).present();

        this.form1.reset();
      },
      err =>{
        console.log("Error:", err);
      });

  }
}

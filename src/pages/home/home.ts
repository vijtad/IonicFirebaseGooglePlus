import { Component } from '@angular/core';

import { NavController, AlertController, Platform } from 'ionic-angular';

import { AngularFire, FirebaseAuthState,  } from 'angularfire2';
import {GooglePlus} from 'ionic-native';
import firebase from 'firebase'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userProfile: any = null;

  constructor(public navCtrl: NavController, public af: AngularFire,
        public alertController : AlertController,
        private platform: Platform     
  ) {

  }

  googlePlusLogin() 
  {

      this.af.auth.subscribe((data: FirebaseAuthState) => {

        this.af.auth.unsubscribe()
        console.log("in auth subscribe", data)

        this.platform.ready().then(() => {
           GooglePlus.login({
				'webClientId' : 'Enter_Your_WebClient_From_Firebase'
           })
           .then((userData) => {

                console.log("userData " + JSON.stringify(userData));
                console.log("firebase " + firebase);
                var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);

                 firebase.auth().signInWithCredential(provider)
                  .then((success) => {
                    console.log("Firebase success: " + JSON.stringify(success));
                    this.displayAlert(JSON.stringify(success),"signInWithCredential successful")
                    this.userProfile = success;

                  })
                  .catch((error) => {
                    console.log("Firebase failure: " + JSON.stringify(error));
                        this.displayAlert(error,"signInWithCredential failed")
                  });

                 })
             .catch((gplusErr) => {
                    console.log("GooglePlus failure: " + JSON.stringify(gplusErr));
                        this.displayAlert(JSON.stringify(gplusErr),"GooglePlus failed")
                  });

            })
       })

  }

  displayAlert(value,title)
  {
      let coolAlert = this.alertController.create({
      title: title,
      message: JSON.stringify(value),
      buttons: [
                    {
                        text: "OK"
                    }
               ]
      });
      coolAlert.present();

    }



}


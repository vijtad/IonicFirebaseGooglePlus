import { Component } from '@angular/core';

import { NavController, AlertController, Platform } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import {GooglePlus} from 'ionic-native';

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
             'webClientId' : '<Enter your webclient ID here'
           })
           .then((userData) => {

                var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);

                 firebase.auth().signInWithCredential(provider)
                  .then((success) => {
                    console.log("Firebase success: " + JSON.stringify(success));
                    this.displayAlert(success,"signInWithCredential successful")
                    this.userProfile = success;

                  })
                  .catch((error) => {
                    console.log("Firebase failure: " + JSON.stringify(error));
                        this.displayAlert(error,"signInWithCredential failed")
                  });

                 })
             .catch((error) => {
                    console.log("Firebase failure: " + JSON.stringify(error));
                        this.displayAlert(error,"signInWithCredential failed")
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
                        text: "Cancel"
                    },
                    {
                        text: "Save",
                        handler: data => {
                        }
                    }
               ]
      });
      coolAlert.present();

    }



}
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { StorageService } from "../client-service/storage.service";
import { UtilService } from "../client-service/util.service";
import { FirebaseConfig } from 'src/app/helpers/validators/config/firebaseConfig';
import { RoutingService } from '../client-service/routing.service';

@Injectable()
export class AuthenticationService {

  db: firebase.firestore.Firestore;

  constructor(public storage: StorageService, public util: UtilService,public routingService : RoutingService) {
    firebase.initializeApp(FirebaseConfig);
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  async logoutUser() {
    try {
      await firebase.auth().signOut();
      this.storage.RemoveAllProperties();
      this.routingService.goToSignIn();
    } catch (e) {
      console.log(e);
    }
  }

  userDetails() {
    return firebase.auth().currentUser;
  }

  async recoverPassword(email: string) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return true;
    } catch (e) {
      this.util.showToast(e.message);
      return false;
    }
  }

  async authenticateWithFirebase(email, password) {
    try {
      let check: firebase.auth.UserCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      return check;
    } catch (e) {
    this.util.showToast(e.message);
      return false;
    }
  }

  async createUser(email, password) {
    try {
      let check: firebase.auth.UserCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return check;
    } catch (e) {
      this.util.showToast(e.message);
      return false;
    }
  }

}

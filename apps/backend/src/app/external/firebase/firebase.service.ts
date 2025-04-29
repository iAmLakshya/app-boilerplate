import { Injectable, OnModuleInit } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { getFirebaseAdmin } from '@/utils/firebase/server';

const firebaseServerAdmin = getFirebaseAdmin();
@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: firebase.app.App;

  async onModuleInit() {
    this.firebaseApp = firebaseServerAdmin.app();
  }

  getAuth(): firebase.auth.Auth {
    return this.firebaseApp.auth();
  }

  getFirestore() {
    return this.firebaseApp.firestore();
  }
}

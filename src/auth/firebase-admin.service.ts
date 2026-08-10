import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_BUCKET,
      });
    }
  }
  async verifyIdToken(idToken: string) {
    return await getAuth().verifyIdToken(idToken);
  }
}

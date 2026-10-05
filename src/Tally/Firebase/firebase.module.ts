import { Global, Module } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

export const FIRESTORE = 'FIRESTORE';

// A "token": just a unique string name for the thing we're providing.
// Services will later ask NestJS for "FIRESTORE" and get the database object.
// It's exported as a constant so you never mistype the string elsewhere.

@Global()
@Module({
  providers: [
    {
      provide: FIRESTORE,
      useFactory: () => {  // create custom providers dynamically 
        if (!getApps().length) {
          const serviceAccount = JSON.parse(
            readFileSync(join(process.cwd(), 'firebase-secret-key.json'), 'utf8'),
          );
          initializeApp({ credential: cert(serviceAccount) });
        }
        return getFirestore();
      },
    },
  ],
  exports: [FIRESTORE],
})
export class FirebaseModule {}
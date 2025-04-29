import * as admin from 'firebase-admin';

// Helper function to format the private key
const formatPrivateKey = (key: string | undefined) => {
  if (!key) return undefined;
  // Replace escaped newlines if stored in env var as a single line string
  return key.replace(/\\n/g, '\n');
};

// Check if already initialized
export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: formatPrivateKey(process.env['FIREBASE_ADMIN_PRIVATE_KEY']),
        clientEmail: process.env['FIREBASE_ADMIN_CLIENT_EMAIL'],
        projectId: process.env['FIREBASE_ADMIN_PROJECT_ID'],
      }),
      // Optional: databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    });
    console.log('Firebase Admin Initialized.');
  }

  return admin;
};

export const getFirebaseServerAuth = () => getFirebaseAdmin().auth();

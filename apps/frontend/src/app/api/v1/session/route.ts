import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseServerAuth } from '@/utils/firebase/server';
import Constants from '@/constants';

const SESSION_TIMEOUT = 60 * 5;
const EXPIRATION_IN = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const firebaseServerAuth = getFirebaseServerAuth();

    // Validate the ID token
    const decodedIdToken = await firebaseServerAuth.verifyIdToken(idToken);
    const NOW_SECONDS = Math.floor(Date.now() / 1000);

    // Only process if the user just signed in in the last 5 minutes.
    if (NOW_SECONDS - decodedIdToken.auth_time >= SESSION_TIMEOUT) {
      return NextResponse.json(
        { error: 'Unauthorized, Session timeout' },
        { status: 401 }
      );
    }

    const sessionCookie = await firebaseServerAuth.createSessionCookie(
      idToken,
      { expiresIn: EXPIRATION_IN }
    );

    // Set the cookie
    (await cookies()).set(Constants.auth.SESSION_COOKIE, sessionCookie, {
      maxAge: EXPIRATION_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(Constants.auth.SESSION_COOKIE);
  return NextResponse.json({ success: true });
}

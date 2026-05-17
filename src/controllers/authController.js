import { AuthenticationError, ValidationError } from '../utils/APIError.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { verifyFirebaseIdToken } from '../utils/firebaseTokenVerifier.js';

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { idToken } = req.body || {};

    if (!idToken) {
      throw new ValidationError('idToken is required');
    }

    let decodedToken;

    try {
      decodedToken = await verifyFirebaseIdToken(idToken);
    } catch (error) {
      throw new AuthenticationError('Invalid Firebase ID token');
    }
    const signInProvider = decodedToken.firebase?.sign_in_provider;

    if (signInProvider !== 'google.com') {
      throw new AuthenticationError('Token is not issued by Google provider');
    }

    const user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      emailVerified: Boolean(decodedToken.email_verified),
      provider: signInProvider,
    };

    return ResponseFormatter.success(res, 200, 'Google login verified', {
      user,
      firebase: {
        authTime: decodedToken.auth_time,
        signInProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

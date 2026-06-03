import { AuthenticationError, InternalServerError, ValidationError } from '../utils/APIError.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { verifyFirebaseIdToken } from '../utils/firebaseTokenVerifier.js';
import { supabase } from '../utils/supabaseClient.js';

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

    if (!user.email) {
      throw new ValidationError('Email is required to create profile');
    }

    const profilePayload = {
      firebase_uid: user.uid,
      email: user.email,
      full_name: user.name,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'firebase_uid' })
      .select('id, firebase_uid, email, full_name, updated_at')
      .single();

    if (profileError) {
      throw new InternalServerError('Failed to save profile', profileError);
    }

    const { error: skillsetError } = await supabase.from('user_skillsets').upsert(
      {
        user_id: profile.id,
        skills: [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (skillsetError) {
      throw new InternalServerError('Failed to initialize skillset', skillsetError);
    }

    return ResponseFormatter.success(res, 200, 'Google login verified', {
      user,
      profile,
      firebase: {
        authTime: decodedToken.auth_time,
        signInProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

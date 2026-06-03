import { AuthenticationError, InternalServerError, ValidationError } from '../utils/APIError.js';
import jwt from 'jsonwebtoken';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { verifyFirebaseIdToken } from '../utils/firebaseTokenVerifier.js';
import { supabase } from '../utils/supabaseClient.js';
import { config } from '../config/environment.js';

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

    if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
      throw new InternalServerError('JWT secrets are not configured');
    }

    const accessExpiresAt = new Date(Date.now() + config.jwt.accessTtlMinutes * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000);

    const accessToken = jwt.sign(
      {
        sub: user.uid,
        email: user.email,
        provider: signInProvider,
        firebase_uid: user.uid,
      },
      config.jwt.accessSecret,
      { expiresIn: `${config.jwt.accessTtlMinutes}m` }
    );

    const refreshToken = jwt.sign(
      {
        sub: user.uid,
        firebase_uid: user.uid,
      },
      config.jwt.refreshSecret,
      { expiresIn: `${config.jwt.refreshTtlDays}d` }
    );

    const profilePayload = {
      firebase_uid: user.uid,
      email: user.email,
      full_name: user.name,
      picture_url: user.picture,
      provider: signInProvider,
      access_token: accessToken,
      refresh_token: refreshToken,
      access_expires_at: accessExpiresAt.toISOString(),
      refresh_expires_at: refreshExpiresAt.toISOString(),
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
      tokens: {
        accessToken,
        refreshToken,
        accessExpiresAt: accessExpiresAt.toISOString(),
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
      firebase: {
        authTime: decodedToken.auth_time,
        signInProvider,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      throw new ValidationError('refreshToken is required');
    }

    if (!config.jwt.refreshSecret || !config.jwt.accessSecret) {
      throw new InternalServerError('JWT secrets are not configured');
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, firebase_uid, refresh_token, refresh_expires_at')
      .eq('firebase_uid', payload.sub)
      .single();

    if (profileError || !profile) {
      throw new AuthenticationError('Refresh token not recognized');
    }

    if (profile.refresh_token !== refreshToken) {
      throw new AuthenticationError('Refresh token mismatch');
    }

    if (profile.refresh_expires_at && new Date(profile.refresh_expires_at) < new Date()) {
      throw new AuthenticationError('Refresh token expired');
    }

    const accessExpiresAt = new Date(Date.now() + config.jwt.accessTtlMinutes * 60 * 1000);
    const accessToken = jwt.sign(
      {
        sub: payload.sub,
        firebase_uid: payload.sub,
      },
      config.jwt.accessSecret,
      { expiresIn: `${config.jwt.accessTtlMinutes}m` }
    );

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        access_token: accessToken,
        access_expires_at: accessExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (updateError) {
      throw new InternalServerError('Failed to update access token', updateError);
    }

    return ResponseFormatter.success(res, 200, 'Access token refreshed', {
      accessToken,
      accessExpiresAt: accessExpiresAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

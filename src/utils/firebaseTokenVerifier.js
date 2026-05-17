import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const CERTS_TIMEOUT_MS = 5000;

let cachedCerts = null;
let cacheExpiryMs = 0;

const getMaxAgeSeconds = (cacheControl) => {
  const match = /max-age=(\d+)/.exec(cacheControl || '');
  return match ? Number(match[1]) : 0;
};

const fetchCerts = async () => {
  const response = await axios.get(CERTS_URL, {
    timeout: CERTS_TIMEOUT_MS,
    validateStatus: () => true,
  });

  if (response.status !== 200 || !response.data) {
    throw new Error('Failed to fetch Firebase public certs');
  }

  cachedCerts = response.data;
  const maxAgeSeconds = getMaxAgeSeconds(response.headers['cache-control']);
  cacheExpiryMs = Date.now() + maxAgeSeconds * 1000;

  return cachedCerts;
};

const getCerts = async () => {
  if (cachedCerts && Date.now() < cacheExpiryMs) {
    return cachedCerts;
  }

  return fetchCerts();
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (!config.firebase.projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }

  if (typeof idToken !== 'string' || !idToken.includes('.')) {
    throw new Error('Invalid Firebase ID token');
  }

  const decoded = jwt.decode(idToken, { complete: true });
  const kid = decoded?.header?.kid;

  if (!kid) {
    throw new Error('Invalid Firebase ID token header');
  }

  const certs = await getCerts();
  const cert = certs[kid];

  if (!cert) {
    throw new Error('Firebase public key not found for token');
  }

  const issuer = `https://securetoken.google.com/${config.firebase.projectId}`;

  return jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience: config.firebase.projectId,
    issuer,
  });
};

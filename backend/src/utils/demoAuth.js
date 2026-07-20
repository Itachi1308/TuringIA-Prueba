import { jwtVerify, SignJWT } from 'jose';
import { findDemoUserByEmail } from '../data/demoUsers.js';
import { buildUserFromAuthData } from './authProfile.js';

const issuer = 'nexotech-demo-auth';
const audience = 'authenticated';
const accessTokenTtlSeconds = 2 * 60 * 60;
const refreshTokenTtlSeconds = 7 * 24 * 60 * 60;

const getSecret = () => new TextEncoder().encode(
  process.env.DEMO_AUTH_SECRET || process.env.SUPABASE_SECRET_KEY || 'nexotech-demo-auth-secret',
);

const buildToken = async (user, tokenUse, ttlSeconds) => new SignJWT({
  email: user.email,
  token_use: tokenUse,
  app_metadata: { role: user.role },
  user_metadata: { name: user.name },
})
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject(user.id)
  .setIssuedAt()
  .setIssuer(issuer)
  .setAudience(audience)
  .setExpirationTime(`${ttlSeconds}s`)
  .sign(getSecret());

export const isSupabaseAuthUnavailable = (error) => {
  const message = error?.message || '';

  return message.includes('Faltan variables de Supabase')
    || message.includes('supabaseUrl is required')
    || message.includes('Invalid API key')
    || message.includes('No API key found')
    || error?.code === 'PGRST205';
};

export const buildDemoAuthResponse = async (user) => ({
  token: await buildToken(user, 'access', accessTokenTtlSeconds),
  refreshToken: await buildToken(user, 'refresh', refreshTokenTtlSeconds),
  expiresAt: Math.floor(Date.now() / 1000) + accessTokenTtlSeconds,
  user: buildUserFromAuthData({
    id: user.id,
    email: user.email,
    app_metadata: { role: user.role },
    user_metadata: { name: user.name },
  }),
});

export const verifyDemoToken = async (token, expectedUse = 'access') => {
  const { payload } = await jwtVerify(token, getSecret(), { issuer, audience });

  if (payload.token_use !== expectedUse || typeof payload.email !== 'string') {
    throw new Error('Token demo invalido.');
  }

  const user = findDemoUserByEmail(payload.email);
  if (!user) {
    throw new Error('Usuario demo no encontrado.');
  }

  return buildUserFromAuthData({
    id: user.id,
    email: user.email,
    app_metadata: { role: user.role },
    user_metadata: { name: user.name },
  });
};

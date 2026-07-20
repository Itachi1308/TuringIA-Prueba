import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const defaultSupabaseUrl = 'https://fahjewvnxdvaezyzxpzf.supabase.co';
const defaultSupabasePublishableKey = 'sb_publishable_eSh6wEIvSZ4Q8nEycvnNnA_HMYVOejR';

const authOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

let publicClient;

export const getSupabaseUrl = () => process.env.SUPABASE_URL || defaultSupabaseUrl;

export const getSupabasePublishableKey = () => (
  process.env.SUPABASE_PUBLISHABLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || defaultSupabasePublishableKey
);

export const getSupabaseJwksUrl = () => (
  process.env.SUPABASE_JWKS_URL || `${getSupabaseUrl()}/auth/v1/.well-known/jwks.json`
);

export const getSupabaseIssuer = () => `${getSupabaseUrl()}/auth/v1`;

const ensurePublicConfig = () => {
  if (!getSupabaseUrl() || !getSupabasePublishableKey()) {
    const error = new Error('Faltan variables públicas de Supabase.');
    error.status = 500;
    throw error;
  }
};

const getPublicClient = () => {
  ensurePublicConfig();
  publicClient ??= createClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    { auth: authOptions },
  );

  return publicClient;
};

const lazyClient = (getClient) => new Proxy(
  {},
  {
    get(target, property) {
      void target;
      const client = getClient();
      const value = client[property];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  },
);

export const supabasePublic = lazyClient(getPublicClient);

export const createSupabaseUserClient = (token) => {
  ensurePublicConfig();

  return createClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      auth: authOptions,
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
};

export const throwSupabaseError = (error) => {
  if (!error) return;

  const normalizedError = new Error(error.message || 'Error de Supabase.');
  normalizedError.code = error.code;
  normalizedError.details = error.details;
  normalizedError.hint = error.hint;
  normalizedError.status = error.status;
  throw normalizedError;
};

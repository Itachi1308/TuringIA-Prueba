import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_JWKS_URL',
];

const authOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

let publicClient;
let adminClient;

const ensureSupabaseConfig = () => {
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    const error = new Error(`Faltan variables de Supabase: ${missingVariables.join(', ')}`);
    error.status = 500;
    throw error;
  }
};

const getPublicClient = () => {
  ensureSupabaseConfig();
  publicClient ??= createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    { auth: authOptions },
  );

  return publicClient;
};

const getAdminClient = () => {
  ensureSupabaseConfig();
  adminClient ??= createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: authOptions },
  );

  return adminClient;
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
export const supabaseAdmin = lazyClient(getAdminClient);

export const throwSupabaseError = (error) => {
  if (!error) return;

  const normalizedError = new Error(error.message || 'Error de Supabase.');
  normalizedError.code = error.code;
  normalizedError.details = error.details;
  normalizedError.hint = error.hint;
  normalizedError.status = error.status;
  throw normalizedError;
};

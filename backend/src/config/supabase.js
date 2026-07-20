import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_JWKS_URL',
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Faltan variables de Supabase: ${missingVariables.join(', ')}`);
}

const authOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

export const supabasePublic = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  { auth: authOptions },
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: authOptions },
);

export const throwSupabaseError = (error) => {
  if (!error) return;

  const normalizedError = new Error(error.message || 'Error de Supabase.');
  normalizedError.code = error.code;
  normalizedError.details = error.details;
  normalizedError.hint = error.hint;
  normalizedError.status = error.status;
  throw normalizedError;
};

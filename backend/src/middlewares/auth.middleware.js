import { createRemoteJWKSet, jwtVerify } from 'jose';
import { supabaseAdmin, throwSupabaseError } from '../config/supabase.js';

let jwks;

const getJwks = () => {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(process.env.SUPABASE_JWKS_URL));
  }

  return jwks;
};

export const authenticate = async (request, response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token de acceso requerido.' });
  }

  const token = authorization.slice(7);

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: 'authenticated',
    });

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, role')
      .eq('id', payload.sub)
      .maybeSingle();

    throwSupabaseError(error);

    if (!profile) {
      return response.status(403).json({ message: 'El usuario no tiene un perfil autorizado.' });
    }

    request.user = {
      sub: payload.sub,
      id: profile.id,
      name: profile.name,
      email: typeof payload.email === 'string' ? payload.email : '',
      role: profile.role,
    };

    return next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return response.status(401).json({ message: 'Token inválido o vencido.' });
  }
};

export const authorize = (...roles) => (request, response, next) => {
  if (!request.user || !roles.includes(request.user.role)) {
    return response.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
  }

  return next();
};

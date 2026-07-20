import { supabaseAdmin, supabasePublic, throwSupabaseError } from '../config/supabase.js';
import { findDemoUserByCredentials } from '../data/demoUsers.js';
import { buildUserFromAuthData, isProfileLookupUnavailable } from '../utils/authProfile.js';
import { buildDemoAuthResponse, isSupabaseAuthUnavailable, verifyDemoToken } from '../utils/demoAuth.js';

const getProfile = async (authUser) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, role')
      .eq('id', authUser.id)
      .maybeSingle();

    throwSupabaseError(error);

    if (!data) {
      return buildUserFromAuthData(authUser);
    }

    return {
      id: data.id,
      sub: data.id,
      name: data.name,
      email: authUser.email || '',
      role: data.role,
    };
  } catch (error) {
    if (isProfileLookupUnavailable(error)) {
      return buildUserFromAuthData(authUser);
    }

    throw error;
  }
};

const buildAuthResponse = async (session, authUser) => ({
  token: session.access_token,
  refreshToken: session.refresh_token,
  expiresAt: session.expires_at,
  user: await getProfile(authUser),
});

export const login = async (request, response) => {
  const { email, password } = request.body;
  const demoUser = findDemoUserByCredentials({ email, password });

  try {
    const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      if (demoUser) {
        return response.json(await buildDemoAuthResponse(demoUser));
      }

      return response.status(401).json({ message: 'Correo o contrasena incorrectos.' });
    }

    return response.json(await buildAuthResponse(data.session, data.user));
  } catch (error) {
    if (demoUser && isSupabaseAuthUnavailable(error)) {
      return response.json(await buildDemoAuthResponse(demoUser));
    }

    throw error;
  }
};

export const refresh = async (request, response) => {
  const { refreshToken } = request.body;

  try {
    const { data, error } = await supabasePublic.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      const demoUser = await verifyDemoToken(refreshToken, 'refresh').catch(() => null);
      if (demoUser) {
        return response.json(await buildDemoAuthResponse(demoUser));
      }

      return response.status(401).json({ message: 'La sesion ya no es valida. Inicia sesion nuevamente.' });
    }

    return response.json(await buildAuthResponse(data.session, data.user));
  } catch (error) {
    const demoUser = await verifyDemoToken(refreshToken, 'refresh').catch(() => null);
    if (demoUser && isSupabaseAuthUnavailable(error)) {
      return response.json(await buildDemoAuthResponse(demoUser));
    }

    throw error;
  }
};

export const me = async (request, response) => response.json({ user: request.user });

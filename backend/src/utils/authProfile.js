export const isProfileLookupUnavailable = (error) => {
  const message = error?.message || '';

  return error?.code === 'PGRST205'
    || message.includes("public.profiles")
    || message.includes('Faltan variables de Supabase');
};

export const buildUserFromAuthData = ({
  id,
  sub,
  email = '',
  user_metadata: userMetadata = {},
  app_metadata: appMetadata = {},
}) => {
  const userId = id || sub;
  const name = userMetadata.name || userMetadata.full_name || email.split('@')[0] || 'Usuario NexoTech';
  const role = appMetadata.role === 'admin' ? 'admin' : 'user';

  return {
    id: userId,
    sub: userId,
    name,
    email,
    role,
  };
};

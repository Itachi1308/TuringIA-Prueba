export const demoUsers = [
  {
    id: 'demo-admin',
    email: 'admin@nexotech.mx',
    password: 'Admin123!',
    name: 'Administrador NexoTech',
    role: 'admin',
  },
  {
    id: 'demo-user',
    email: 'user@nexotech.mx',
    password: 'User123!',
    name: 'Usuario de demostración',
    role: 'user',
  },
];

export const findDemoUserByCredentials = ({ email = '', password = '' }) => demoUsers.find(
  (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
);

export const findDemoUserByEmail = (email = '') => demoUsers.find(
  (user) => user.email.toLowerCase() === email.toLowerCase(),
);

export const routes = {
  home: '/',
  activity: '/activity',
  event: '/event',
  calendarEvent: '/calendar-event',
  login: '/auth/login',
  profileList: '/profilelist',
  myProfile: '/myprofile',
  profileDetailsBase: '/profile',
  signup: '/auth/signup',
  afterRegister: '/auth/after-register',
  authCallback: '/auth/callback',
  forgotPassword: '/auth/forgot-password',
};

export const routeTitles = {
  [routes.home]: 'Home',
  [routes.activity]: 'Activity',
  [routes.event]: 'Events',
  [routes.calendarEvent]: 'Event Calendar',
  [routes.login]: 'Login',
  [routes.profileList]: 'Athletes',
  [routes.myProfile]: 'My Profile',
  [routes.profileDetailsBase]: 'Profile',
  [routes.signup]: 'Register',
  [routes.afterRegister]: 'Registration successful',
  [routes.authCallback]: 'Authentication callback',
  [routes.forgotPassword]: 'Forgot password',
};

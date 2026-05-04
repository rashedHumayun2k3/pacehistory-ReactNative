import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLayout from '../components/common/AppLayout';
import ActivityLogHistory from '../components/activity/ActivityLogHistory';
import EventListingPage from '../components/event/EventListingPage';
import AfterRegisterPage from '../pages/AfterRegisterPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MyProfilePage from '../pages/MyProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfileDetailsPage from '../pages/ProfileDetailsPage';
import ProfileEventDetailsPage from '../pages/ProfileEventDetailsPage';
import ProfileListPage from '../pages/ProfileListPage';
import SignupPage from '../pages/SignupPage';
import { routes, routeTitles } from './routes';

const normalizePath = path => {
  if (!path || path === '') {
    return routes.home;
  }

  const cleanPath = path.split('?')[0].split('#')[0];
  return cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;
};

const getCurrentPath = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return normalizePath(window.location.pathname);
  }

  return routes.home;
};

function useRouter() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => setPath(getCurrentPath());
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = nextPath => {
    const normalizedPath = normalizePath(nextPath);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.location.pathname !== normalizedPath) {
        window.history.pushState({}, routeTitles[normalizedPath] || 'PaceHistory', normalizedPath);
      }
    }

    setPath(normalizedPath);
  };

  return { path, navigate };
}

export default function AppRouter() {
  const { path, navigate } = useRouter();
  const screen = useMemo(() => getScreenForPath(path), [path]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <AppLayout path={path} navigate={navigate}>
          {screen.type === 'home' ? (
            <HomePage navigate={navigate} />
          ) : screen.type === 'activity' ? (
            <ActivityLogHistory onBack={() => navigate(routes.home)} />
          ) : screen.type === 'event' ? (
            <EventListingPage navigation={{ navigate }} />
          ) : screen.type === 'calendarEvent' ? (
            <EventListingPage navigation={{ navigate }} />
          ) : screen.type === 'login' ? (
            <LoginPage navigate={navigate} />
          ) : screen.type === 'profileList' ? (
            <ProfileListPage navigate={navigate} />
          ) : screen.type === 'myProfile' ? (
            <MyProfilePage navigate={navigate} />
          ) : screen.type === 'profileDetails' ? (
            <ProfileDetailsPage id={screen.id} navigate={navigate} />
          ) : screen.type === 'profileEventDetails' ? (
            <ProfileEventDetailsPage
              id={screen.id}
              navigate={navigate}
              resultID={screen.resultID}
            />
          ) : screen.type === 'signup' ? (
            <SignupPage navigate={navigate} />
          ) : screen.type === 'afterRegister' ? (
            <AfterRegisterPage navigate={navigate} />
          ) : screen.type === 'authCallback' ? (
            <AuthCallbackPage navigate={navigate} />
          ) : screen.type === 'forgotPassword' ? (
            <ForgotPasswordPage navigate={navigate} />
          ) : (
            <NotFoundPage navigate={navigate} path={path} />
          )}
        </AppLayout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getScreenForPath(path) {
  const eventDetailsMatch = path.match(/^\/profile\/([^/]+)\/eventdetails\/([^/]+)$/);

  if (eventDetailsMatch) {
    return {
      type: 'profileEventDetails',
      id: decodeURIComponent(eventDetailsMatch[1]),
      resultID: decodeURIComponent(eventDetailsMatch[2]),
    };
  }

  const profileMatch = path.match(/^\/profile\/([^/]+)$/);

  if (profileMatch) {
    return { type: 'profileDetails', id: decodeURIComponent(profileMatch[1]) };
  }

  switch (path) {
    case routes.home:
      return { type: 'home' };
    case routes.activity:
      return { type: 'activity' };
    case routes.event:
      return { type: 'event' };
    case routes.calendarEvent:
      return { type: 'calendarEvent' };
    case routes.login:
      return { type: 'login' };
    case routes.profileList:
      return { type: 'profileList' };
    case routes.myProfile:
      return { type: 'myProfile' };
    case routes.signup:
      return { type: 'signup' };
    case routes.afterRegister:
      return { type: 'afterRegister' };
    case routes.authCallback:
      return { type: 'authCallback' };
    case routes.forgotPassword:
      return { type: 'forgotPassword' };
    default:
      return { type: 'notFound' };
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#152238',
  },
  screen: {
    flex: 1,
  },
});

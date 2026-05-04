import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Footer from './Footer';
import Header from './Header';
import NavigationList from './NavigationList';
import ResponsiveNav from './ResponsiveNav';

type AppLayoutProps = {
  children: ReactNode;
  path: string;
  navigate: (path: string) => void;
};

const authPaths = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/confirm-email',
  '/reset-password',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
]);

const AppLayout = ({ children, path, navigate }: AppLayoutProps) => {
  const isAuthPage = authPaths.has(path);

  if (isAuthPage) {
    return (
      <View style={styles.layout}>
        <ResponsiveNav
          renderNavigationList={toggleMenu => (
            <NavigationList
              embedded
              navigate={navigate}
              onClose={toggleMenu}
              pathname={path}
            />
          )}
        />
        <Header navigate={navigate} path={path} />
        <View style={styles.authLayout}>{children}</View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.layout}>
      <ResponsiveNav
        renderNavigationList={toggleMenu => (
          <NavigationList
            embedded
            navigate={navigate}
            onClose={toggleMenu}
            pathname={path}
          />
        )}
      />
      <Header navigate={navigate} path={path} />

      <View style={styles.main}>
        <View style={styles.feedContainer}>
          <View style={styles.content}>{children}</View>
        </View>
      </View>

      <Footer />
    </View>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  authLayout: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  feedContainer: {
    alignSelf: 'center',
    flex: 1,
    gap: 16,
    maxWidth: 1100,
    width: '100%',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
});

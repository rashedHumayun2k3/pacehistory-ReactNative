import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUserLoginMode } from '../../store/slices/authSlice';
import { routes } from '../../routes/routes';

interface NavLink {
  link: string;
  name: string;
  icon: string;
  onClick?: () => void;
}

type NavigationListProps = {
  embedded?: boolean;
  isOpen?: boolean;
  navigate: (path: string) => void;
  onClose: () => void;
  pathname: string;
};

const NavigationList: React.FC<NavigationListProps> = ({
  embedded = false,
  isOpen,
  navigate,
  onClose,
  pathname,
}) => {
  const [activeNavLinks, setActiveNavLinks] = useState<NavLink[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { loginAs } = useSelector((state: RootState) => state.authStore);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('userProfile');

      setIsLoggedIn(!!token);

      if (storedUser && storedUser !== '[]') {
        try {
          const userParam = JSON.parse(storedUser);

          if (userParam?.id) {
            dispatch(fetchUserLoginMode({ emailId: userParam.email }));
          }
        } catch (error) {
          console.error('Error parsing user profile from AsyncStorage:', error);
        }
      }
    };

    loadUserData();
  }, [dispatch]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('userProfile');
    await AsyncStorage.setItem('userProfile', '[]');

    setIsLoggedIn(false);
    onClose();
    navigate(routes.login);
  };

  const navigateTo = (nav: NavLink) => {
    if (nav.onClick) {
      nav.onClick();
      return;
    }

    onClose();
    navigate(routeMap[nav.link] ?? nav.link);
  };

  const defaultNavLinks = (): NavLink[] => {
    if (loginAs === 'Group Owner') {
      return [
        { link: '/', name: 'Home', icon: 'home' },
        { link: '/myevents', name: 'My Events', icon: 'calendar-alt' },
        { link: '/group-insights', name: 'Group Manager', icon: 'layer-group' },
        { link: '/calendar-event', name: 'Event Calendar', icon: 'calendar' },
        ...(isLoggedIn
          ? [{ link: '#', name: 'Logout', icon: 'sign-out-alt', onClick: handleLogout }]
          : [{ link: '/login', name: 'Login/Register', icon: 'sign-in-alt' }]),
      ];
    }

    return [
      { link: '/', name: 'Home', icon: 'home' },
      { link: '/profilelist', name: 'Athletes', icon: 'users' },
      { link: '/profile/101', name: 'Sample Profile', icon: 'id-card' },
      { link: '/event', name: 'Events', icon: 'calendar-alt' },
      { link: '/myprofile', name: 'My Profile', icon: 'user-circle' },
      { link: '/group-insights', name: 'Groups', icon: 'layer-group' },
      { link: '/calendar-event', name: 'Event Calendar', icon: 'calendar' },
      { link: '/routes', name: 'Routes', icon: 'route' },
      { link: '/blog-news', name: 'Blog/News List', icon: 'blog' },
      ...(isLoggedIn
        ? [{ link: '#', name: 'Logout', icon: 'sign-out-alt', onClick: handleLogout }]
        : [{ link: '/login', name: 'Login/Register', icon: 'sign-in-alt' }]),
    ];
  };

  const profileNavLinks = (): NavLink[] => [
    { link: '/', name: 'Home', icon: 'home' },
    { link: '/myprofile', name: 'My Profile', icon: 'user-circle' },
    { link: '/myscheduled', name: 'My Scheduled Events', icon: 'calendar-check' },
    { link: '/settings-myprofile', name: 'Settings', icon: 'cog' },
    ...(isLoggedIn
      ? [{ link: '#', name: 'Logout', icon: 'sign-out-alt', onClick: handleLogout }]
      : [{ link: '/login', name: 'Login/Register', icon: 'sign-in-alt' }]),
  ];

  const blogNewsNavLinks = (): NavLink[] => [
    { link: '/', name: 'Home', icon: 'home' },
    { link: '/blog-news', name: 'Blog/News List', icon: 'blog' },
    ...(isLoggedIn
      ? [{ link: '#', name: 'Logout', icon: 'sign-out-alt', onClick: handleLogout }]
      : [{ link: '/login', name: 'Login/Register', icon: 'sign-in-alt' }]),
  ];

  useEffect(() => {
    if (
      pathname.startsWith('/myprofile') ||
      pathname.startsWith('/settings-myprofile') ||
      pathname.startsWith('/myscheduled')
    ) {
      setActiveNavLinks(profileNavLinks());
    } else if (pathname.startsWith('/blog-news')) {
      setActiveNavLinks(blogNewsNavLinks());
    } else {
      setActiveNavLinks(defaultNavLinks());
    }
  }, [pathname, isLoggedIn, loginAs]);

  if (!embedded && !isOpen) {
    return null;
  }

  const listContent = (
    <View style={styles.listGroup}>
      {activeNavLinks.map((nav, index) => {
        const active = isActive(nav.link);

        return (
          <Pressable
            accessibilityRole="button"
            key={`${nav.link}-${index}`}
            onPress={() => navigateTo(nav)}
            style={[styles.listGroupItem, active && styles.activeListGroupItem]}
          >
            <FontAwesome5
              name={nav.icon}
              size={16}
              color={active ? '#ffffff' : '#333333'}
              style={styles.icon}
            />

            <Text style={[styles.listGroupText, active && styles.activeListGroupText]}>
              {nav.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (embedded) {
    return listContent;
  }

  return (
    <View style={styles.overlay}>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.backdrop} />

      <View style={styles.panel}>
        {listContent}
      </View>
    </View>
  );
};

const routeMap: Record<string, string> = {
  '/': routes.home,
  '/profilelist': '/profilelist',
  '/profile/101': '/profile/101',
  '/event': '/event',
  '/myprofile': '/myprofile',
  '/myevents': '/myevents',
  '/group-insights': '/group-insights',
  '/calendar-event': routes.calendarEvent,
  '/routes': '/routes',
  '/blog-news': '/blog-news',
  '/myscheduled': '/myscheduled',
  '/settings-myprofile': '/settings-myprofile',
  '/login': routes.login,
};

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    bottom: 0,
    left: 0,
    maxWidth: 320,
    paddingTop: 18,
    position: 'absolute',
    top: 0,
    width: '82%',
  },
  listGroup: {
    width: '100%',
  },
  listGroupItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  activeListGroupItem: {
    backgroundColor: '#d8302f',
  },
  icon: {
    marginRight: 8,
    width: 24,
  },
  listGroupText: {
    color: '#333333',
    fontSize: 15,
  },
  activeListGroupText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default NavigationList;

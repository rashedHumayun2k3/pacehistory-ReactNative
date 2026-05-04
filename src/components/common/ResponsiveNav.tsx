import React, { useEffect, useRef, useState } from 'react';

const { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } = require('react-native');

interface ResponsiveNavProps {
  children?: React.ReactNode;
  renderNavigationList?: (toggleMenu: () => void) => React.ReactNode;
}

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({ children, renderNavigationList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideX = useRef(new Animated.Value(-300)).current;

  const toggleMenu = () => {
    setIsOpen(open => !open);
  };

  useEffect(() => {
    Animated.timing(slideX, {
      duration: 300,
      easing: Easing.out(Easing.ease),
      toValue: isOpen ? 0 : -300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideX]);

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        accessibilityLabel="Open navigation menu"
        onPress={toggleMenu}
        style={styles.hamburger}
      >
        <Text style={styles.hamburgerText}>☰</Text>
      </Pressable>

      <Modal animationType="none" onRequestClose={toggleMenu} transparent visible={isOpen}>
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="Close navigation overlay"
            onPress={toggleMenu}
            style={styles.overlay}
          />

          <Animated.View
            style={[styles.navContainer, { transform: [{ translateX: slideX }] }]}
          >
            <Pressable
              accessibilityLabel="Close navigation menu"
              onPress={toggleMenu}
              style={[styles.closeButton, styles.marginBottom10]}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>

            {renderNavigationList ? renderNavigationList(toggleMenu) : children}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    bottom: 0,
    left: 0,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  hamburger: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    elevation: 9,
    justifyContent: 'center',
    left: 16,
    minHeight: 40,
    position: 'absolute',
    top: 16,
    width: 60,
    zIndex: 1001,
  },
  hamburgerText: {
    color: '#000000',
    fontSize: 24,
    lineHeight: 28,
  },
  modalRoot: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  navContainer: {
    backgroundColor: '#ffffff',
    bottom: 0,
    elevation: 8,
    flexDirection: 'column',
    left: 0,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    top: 0,
    width: 250,
    zIndex: 1000,
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#af0000',
    borderColor: '#eeeeee',
    borderRadius: 3,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 21,
    lineHeight: 24,
  },
  marginBottom10: {
    marginBottom: 10,
  },
});

export default ResponsiveNav;

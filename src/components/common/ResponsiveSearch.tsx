import React, { useState } from 'react';

const { Pressable, StyleSheet, Text, View } = require('react-native');

interface ResponsiveSearchProps {
  children?: React.ReactNode;
}

const ResponsiveSearch: React.FC<ResponsiveSearchProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(open => !open);

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable onPress={toggleMenu} style={[styles.primaryButton, styles.w90]}>
        <Text style={styles.primaryButtonText}>Search</Text>
      </Pressable>

      {isOpen ? <Pressable onPress={toggleMenu} style={styles.overlay} /> : null}

      <View
        style={[
          styles.searchContainerMobile,
          isOpen ? styles.searchContainerMobileOpen : styles.searchContainerMobileClosed,
        ]}
      >
        <Pressable
          accessibilityLabel="Close search panel"
          onPress={toggleMenu}
          style={[styles.closeButton, styles.marginBottom10]}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 5,
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  w90: {
    width: '90%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  searchContainerMobile: {
    backgroundColor: '#ffffff',
    bottom: 0,
    elevation: 8,
    flexDirection: 'column',
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    top: 0,
    width: '90%',
    zIndex: 1000,
  },
  searchContainerMobileClosed: {
    transform: [{ translateX: 400 }],
  },
  searchContainerMobileOpen: {
    transform: [{ translateX: 0 }],
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
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

export default ResponsiveSearch;

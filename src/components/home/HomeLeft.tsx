import React from 'react';

const { StyleSheet, View } = require('react-native');

interface HomeLeftProps {
  children?: React.ReactNode;
  renderNavigationList?: (toggleMenu: () => void) => React.ReactNode;
}

const HomeLeft: React.FC<HomeLeftProps> = ({ children, renderNavigationList }) => {
  const toggleMenu = () => {
    console.log('navigation toggle');
  };

  return (
    <View style={styles.leftSidebar}>
      <View style={styles.listGroup}>
        {renderNavigationList ? renderNavigationList(toggleMenu) : children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftSidebar: {
    backgroundColor: '#f0f2f5',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: 240,
  },
  listGroup: {
    borderRadius: 4,
    elevation: 1,
    flexDirection: 'column',
    marginBottom: 0,
    paddingLeft: 0,
    paddingTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.075,
    shadowRadius: 2,
    width: '100%',
  },
});

export default HomeLeft;

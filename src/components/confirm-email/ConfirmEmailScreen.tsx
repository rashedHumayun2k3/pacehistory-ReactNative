import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchUserActiveByToken } from '../redux/slices/userProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const ConfirmEmailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<any>();

  const token = route.params?.token;

  const { userProfile } = useSelector(
    (state: RootState) => state.userProfile
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchUserActiveByToken(token));
    }
  }, [token]);

  useEffect(() => {
    if (userProfile) {
      saveUserData(userProfile);
      navigation.navigate('Home');
    }
  }, [userProfile]);

  const saveUserData = async (profile: any) => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // adjust path
        style={styles.logo}
      />

      <Text style={styles.text}>
        Token validation is in progress. Please wait...
      </Text>

      <ActivityIndicator size="large" color="#ffcc00" />
    </View>
  );
};

export default ConfirmEmailScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
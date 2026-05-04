import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// 🔁 Helper to get token
const getToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

// 🔁 Helper for API headers
const getHeaders = (token: string | null) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: token ? `Bearer ${token}` : '',
});

export const fetchTrackingRouteInsertUpdate = createAsyncThunk(
  'trackingRouteInsertUpdate/fetchTrackingRouteInsertUpdate',
  async (routeData: any, { rejectWithValue }) => {
    try {
      const token = await getToken();

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      const response = await fetch(`${BASE_URL}/Group/InsertUpdateRoute`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(routeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Error occurred');
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetRouteListResult = createAsyncThunk(
  'routeSelect/fetchGetRouteListResult',
  async ({ countryCode, stateName, routeName }: any, { rejectWithValue }) => {
    try {
      const token = await getToken();

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      const url = `${BASE_URL}/Group/GetRouteListByAdmin?countryCode=${countryCode}&stateName=${stateName}&routeName=${routeName}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetRouteInformation = createAsyncThunk(
  'routeSelect/fetchGetRouteInformation',
  async ({ routeId }: any, { rejectWithValue }) => {
    try {
      const token = await getToken();

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      const response = await fetch(`${BASE_URL}/Group/RouteDetailsById/${routeId}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetRouteStateListResult = createAsyncThunk(
  'routeSelect/fetchGetRouteStateListResult',
  async ({ countryCode }: any, { rejectWithValue }) => {
    try {
      const token = await getToken();

      if (!token) {
        return rejectWithValue('Authentication token missing');
      }

      const response = await fetch(
        `${BASE_URL}/Group/GetRouteStateByCountry?countryCode=${countryCode}`,
        {
          method: 'GET',
          headers: getHeaders(token),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
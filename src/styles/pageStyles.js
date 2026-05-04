import { StyleSheet } from 'react-native';

export const pageStyles = StyleSheet.create({
  centeredContent: {
    alignSelf: 'center',
    maxWidth: 460,
    width: '100%',
  },
  header: {
    marginBottom: 32,
  },
  brand: {
    color: '#7dd3fc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: '#bed0e4',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#07111f',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  routeButton: {
    alignItems: 'center',
    borderColor: '#d7e0ea',
    borderRadius: 8,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    marginBottom: 12,
  },
  routeButtonPrimary: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  routeButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '800',
  },
  routeButtonTextPrimary: {
    color: '#ffffff',
  },
});

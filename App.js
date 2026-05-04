import { Provider } from 'react-redux';
import AppRouter from './src/routes/AppRouter';
import { store } from './src/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

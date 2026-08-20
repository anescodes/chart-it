import { AuthProvider } from './context/auth.context';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
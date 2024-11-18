import { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Definir la interfaz para los props
interface LoginPageProps {
  onLoginSuccess: (data: { token: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const router = useIonRouter(); // Cambiado de useHistory a useIonRouter
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
  
    if (!validateEmail(email)) {
      setError('El correo electrónico no es válido');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:3300/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
  
      // Asegurarse de que los datos estén presentes antes de almacenarlos
      if (data.token && data.resUser && Array.isArray(data.resUser) && data.resUser.length > 0) {
        const user = data.resUser[0]; // Suponiendo que resUser es un arreglo con un solo usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(data);
        router.push('/home', 'forward');
      } else {
        throw new Error('Datos de usuario no válidos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-pink-100 via-white to-blue-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated ice cream decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-80"
            style={{
              background:
                i % 2 === 0
                  ? 'linear-gradient(45deg, #FFB5E8 0%, #FFC8E6 100%)'
                  : 'linear-gradient(45deg, #ADE4FF 0%, #CAF0FF 100%)',
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${Math.random() * 15 + 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative bg-white/95 shadow-xl transition-all duration-300 hover:shadow-pink-200/50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300" />

        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full blur-xl opacity-70 animate-pulse" />
            <img
              src="/src/assets/perfil2.jpeg"
              alt="Logo Heladería"
              className="w-24 h-24 rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110 relative z-10 border-4 border-white"
            />
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              ¡Bienvenido!
            </span>
          </CardTitle>
          <p className="text-gray-500">Inicia sesión para ingresar a Creamy Soft</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail
                className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-300 ${
                  focusedInput === 'email' ? 'text-pink-500' : 'text-gray-400'
                }`}
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                className={`pl-10 h-12 transition-all duration-300 border-2 rounded-xl ${
                  focusedInput === 'email'
                    ? 'border-pink-400 ring-2 ring-pink-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
                required
                aria-label="Correo electrónico"
              />
            </div>

            <div className="relative group">
              <Lock
                className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-300 ${
                  focusedInput === 'password' ? 'text-pink-500' : 'text-gray-400'
                }`}
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
                className={`pl-10 h-12 transition-all duration-300 border-2 rounded-xl ${
                  focusedInput === 'password'
                    ? 'border-pink-400 ring-2 ring-pink-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
                required
                aria-label="Contraseña"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4 animate-shake rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-102 rounded-xl font-semibold text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

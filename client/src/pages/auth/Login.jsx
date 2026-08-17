import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AlertCircle, Droplets } from 'lucide-react';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(phone, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'operator') {
        navigate('/operator');
      } else {
        navigate('/villager');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="bg-gov-blue p-2 rounded-lg">
              <Droplets className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">JalTrack</h1>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access for Jal Jeevan Mission Administrators
          </p>
        </div>
        
        <Card className="p-8 shadow-lg border-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm border border-red-100">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            
            <Input
              label="Phone Number"
              required
              placeholder="e.g. 9999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} JalTrack Government Portal.
        </div>
      </div>
    </div>
  );
};

export default Login;

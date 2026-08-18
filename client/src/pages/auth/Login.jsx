import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Droplets,
  User,
  ShieldCheck,
  HardHat,
  Lock,
  Mail,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('VILLAGER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'VILLAGER',
      name: 'Villager',
      description: 'Access water services and report problems',
      icon: User,
    },
    {
      id: 'OPERATOR',
      name: 'Operator',
      description: 'Manage village water operations',
      icon: HardHat,
    },
    {
      id: 'ADMIN',
      name: 'Admin',
      description: 'Manage the JalTrack system',
      icon: ShieldCheck,
    },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(email.trim(), password);

      console.log('Logged in user:', user);

      const userRole = user?.role?.toLowerCase();

      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'operator') {
        navigate('/operator');
      } else if (userRole === 'villager') {
        navigate('/villager');
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      console.error('Login error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-default flex flex-col">

      {/* Header */}
      <header className="bg-gov-blue text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="bg-water-blue p-2 rounded-lg">
              <Droplets size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                JALTRACK
              </h1>

              <p className="text-xs text-blue-200">
                Rural Drinking Water Management
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-sm text-blue-100">
            Digital Water Management Platform
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-5xl">

          {/* Title */}
          <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-water-blue/10 text-water-blue mb-4">
              <Droplets size={34} />
            </div>

            <h2 className="text-3xl font-bold text-gov-blue">
              Welcome to JalTrack
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to access your JalTrack dashboard
            </p>

          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="grid md:grid-cols-2">

              {/* Role Selection */}
              <div className="bg-gov-blue p-8 md:p-10 text-white">

                <h3 className="text-xl font-semibold mb-2">
                  Select your role
                </h3>

                <p className="text-blue-200 text-sm mb-7">
                  Choose the portal you want to access.
                </p>

                <div className="space-y-4">

                  {roles.map((item) => {
                    const Icon = item.icon;
                    const selected = role === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRole(item.id);
                          setError('');
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          selected
                            ? 'bg-white text-gov-blue border-white shadow-md'
                            : 'bg-gov-light/40 text-white border-blue-400/30 hover:bg-gov-light'
                        }`}
                      >

                        <div className="flex items-center gap-4">

                          <div
                            className={`p-3 rounded-lg ${
                              selected
                                ? 'bg-water-blue/10 text-water-blue'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <Icon size={23} />
                          </div>

                          <div>
                            <h4 className="font-semibold">
                              {item.name}
                            </h4>

                            <p
                              className={`text-xs mt-1 ${
                                selected
                                  ? 'text-gray-500'
                                  : 'text-blue-200'
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>

                        </div>

                      </button>
                    );
                  })}

                </div>

              </div>

              {/* Login Form */}
              <div className="p-8 md:p-10">

                <div className="mb-7">

                  <p className="text-sm text-water-blue font-medium uppercase tracking-wide">
                    {role}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {role === 'VILLAGER'
                      ? 'Villager Login'
                      : role === 'OPERATOR'
                      ? 'Operator Login'
                      : 'Admin Login'}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Enter your registered credentials to continue.
                  </p>

                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-water-blue/30 focus:border-water-blue"
                        disabled={isLoading}
                      />

                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-water-blue/30 focus:border-water-blue"
                        disabled={isLoading}
                      />

                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  {/* Login */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-water-blue hover:bg-gov-light disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                </form>

                <div className="mt-7 pt-5 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-400">
                    JalTrack • Rural Drinking Water Management System
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2026 JalTrack. Digital Water Management Platform.
      </footer>

    </div>
  );
};

export default Login;
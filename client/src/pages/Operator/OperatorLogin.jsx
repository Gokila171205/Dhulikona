import React, { useState } from 'react';
import { Droplets, Lock, Mail, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const OperatorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Store authentication information
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Go to operator dashboard
      navigate('/operator');

    } catch (err) {
      console.error('Login failed:', err);

      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F766E]">
            <Droplets
              size={30}
              className="text-white"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A]">
            JalTrack
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Smart Water Management. Transparent Communities.
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-[#0F172A]">
              Operator Login
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Sign in to manage your village water system.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#0F172A]"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="operator@jaltrack.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#0F172A]"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}

            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#64748B]">
          JalTrack Operator Portal
        </p>

      </div>

    </div>
  );
};

export default OperatorLogin;
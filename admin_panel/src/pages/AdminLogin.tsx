import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import OtpInput from '../components/OtpInput';
import api from '../api';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [step, setStep] = useState<'LOGIN' | '2FA'>('LOGIN');
  const [adminId, setAdminId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      if (response.data.success) {
        if (response.data.data.requires2FA) {
          setAdminId(response.data.data.adminId);
          setStep('2FA');
        } else {
          localStorage.setItem('adminToken', response.data.data.token);
          localStorage.setItem('adminData', JSON.stringify(response.data.data));
          navigate('/dashboard');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e?: React.FormEvent, code?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/admin/auth/verify-2fa', { adminId, code: code || twoFactorCode });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.data));
        navigate('/dashboard');
      } else {
        setError(response.data.message || '2FA verification failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#1B3A6B] rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hanan Data Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the control panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          
          {step === 'LOGIN' ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] sm:text-sm transition-all"
                    placeholder="admin@hanandata.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] sm:text-sm transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#1B3A6B] focus:ring-[#1B3A6B] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1B3A6B] hover:bg-[#2A5A9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A6B] transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify2FA}>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center mb-2">
                  Enter 2FA Code from Authenticator App
                </label>
                <div className="mt-1 flex justify-center">
                  <OtpInput
                    value={twoFactorCode}
                    onChange={setTwoFactorCode}
                    onComplete={(val) => handleVerify2FA(undefined, val)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || twoFactorCode.length < 6}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1B3A6B] hover:bg-[#2A5A9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A6B] transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

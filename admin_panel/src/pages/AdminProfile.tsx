import { useState, useEffect } from 'react';
import { Shield, Key, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import OtpInput from '../components/OtpInput';
import api from '../api';

export function AdminProfile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    // We would ideally fetch the current 2FA status from a /admin/profile endpoint.
    // For now, let's assume it's disabled initially or fetch it from local storage.
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    if (adminData.twoFactorEnabled) {
      setTwoFactorEnabled(true);
    }
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await api.post('/admin/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleSetup2FA = async () => {
    try {
      const res = await api.get('/admin/auth/2fa/setup');
      if (res.data.success) {
        setQrCode(res.data.data.qrCode);
      }
    } catch (err: any) {
      toast.error('Failed to setup 2FA');
    }
  };

  const handleEnable2FA = async (e?: React.FormEvent | string, codeOverride?: string) => {
    // If e is a string (from onComplete), use it. If e is an event, prevent default.
    const code = typeof e === 'string' ? e : (codeOverride || verifyCode);
    if (typeof e !== 'string' && e?.preventDefault) {
      e.preventDefault();
    }
    
    try {
      await api.post('/admin/auth/2fa/enable', { code });
      toast.success('2FA enabled successfully');
      setTwoFactorEnabled(true);
      setQrCode('');
      setVerifyCode('');
      
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      adminData.twoFactorEnabled = true;
      localStorage.setItem('adminData', JSON.stringify(adminData));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to enable 2FA');
    }
  };

  const handleDisable2FA = async () => {
    try {
      await api.post('/admin/auth/2fa/disable');
      toast.success('2FA disabled successfully');
      setTwoFactorEnabled(false);
      
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      adminData.twoFactorEnabled = false;
      localStorage.setItem('adminData', JSON.stringify(adminData));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to disable 2FA');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Security Profile</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <Key className="w-5 h-5 text-[#1B3A6B]" />
          <h3 className="font-bold text-gray-900">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" 
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="px-6 py-2.5 bg-[#1B3A6B] text-white font-medium rounded-lg hover:bg-[#2A5A9E] transition-colors">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <Shield className="w-5 h-5 text-[#1B3A6B]" />
          <h3 className="font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1B3A6B]" />
                Authenticator App
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Protect your admin account using an authenticator app like Google Authenticator.
              </p>
            </div>
            {twoFactorEnabled ? (
              <button onClick={handleDisable2FA} className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors">
                Disable 2FA
              </button>
            ) : (
              <button onClick={handleSetup2FA} className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors">
                Setup 2FA
              </button>
            )}
          </div>

          {qrCode && !twoFactorEnabled && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-4">Scan this QR code with your Authenticator App.</p>
              <img src={qrCode} alt="2FA QR Code" className="mx-auto w-48 h-48 mb-4 border" />
              <div className="max-w-xs mx-auto">
                <label className="block text-center text-sm font-medium text-gray-700 mb-2">Enter Verification Code</label>
                <div className="flex flex-col gap-4 items-center">
                  <OtpInput 
                    value={verifyCode}
                    onChange={setVerifyCode}
                    onComplete={(val) => handleEnable2FA(val)}
                  />
                  <button onClick={handleEnable2FA as any} className="w-full px-4 py-2 bg-[#1B3A6B] text-white font-medium rounded-lg hover:bg-[#2A5A9E] transition-colors">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

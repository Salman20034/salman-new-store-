import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Phone, Mail, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { apiService } from '../services/apiService';

export const Auth = () => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // For email flow
  const [resetStep, setResetStep] = useState<'none' | 'email' | 'new-password'>('none');
  const [resetUserId, setResetUserId] = useState<string | null>(null);

  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiService.verifyUser({ identifier: email });
      setResetUserId(response.id);
      setResetStep('new-password');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.resetPassword({ user_id: resetUserId, password });
      alert('Password reset successfully! Please login.');
      setResetStep('none');
      setIsLogin(true);
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (resetStep === 'email') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Forgot Password</h2>
          <p className="text-[#6B6B6B] mb-8">Enter your email or phone to verify your account.</p>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <Input 
              label="Email or Phone" 
              floatingLabel 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your account identifier" 
              icon={<Mail size={18} />}
              required 
            />
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>Verify Account</Button>
            <button type="button" onClick={() => setResetStep('none')} className="w-full text-sm text-[#6B6B6B] hover:text-[#013220]">Back to Login</button>
          </form>
        </div>
      </div>
    );
  }

  if (resetStep === 'new-password') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Set New Password</h2>
          <p className="text-[#6B6B6B] mb-8">Account verified! Please enter your new secure password.</p>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input 
              label="New Password" 
              floatingLabel 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>Reset Password</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white">
      {/* Left Side - Banner */}
      <div className="hidden md:flex md:w-1/2 bg-[#013220] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 text-white max-w-md">
          <div className="bg-white rounded-2xl p-4 inline-block mb-8 shadow-lg">
            <Logo className="w-20 h-20" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6">
            Fresh groceries,<br />delivered to your door.
          </h1>
          <p className="text-white/80 text-lg">
            Join MK Store today and experience the best quality local produce in Cheerattamala.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <div className="md:hidden flex justify-center mb-6">
              <Logo className="w-24 h-24" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-2">
              {authMethod === 'otp' ? (step === 'input' ? 'Login or Sign up' : 'Verify Phone') : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h2>
            <p className="text-[#6B6B6B]">
              {authMethod === 'otp' 
                ? (step === 'input' ? 'Enter your phone number to continue' : `We've sent an OTP to ${phone}`)
                : (isLogin ? 'Login with your email and password' : 'Sign up with your email')
              }
            </p>
          </div>

          {authMethod === 'otp' ? (
            step === 'input' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <Input 
                  label="Phone Number" 
                  floatingLabel 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                  icon={<Phone size={18} />}
                  required 
                />
                <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                  Continue
                </Button>
                <div className="text-center">
                  <button type="button" onClick={() => setResetStep('email')} className="text-sm text-[#013220] font-medium hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center text-[#013220]">
                    <ShieldCheck size={40} />
                  </div>
                </div>
                <Input 
                  label="Enter OTP" 
                  floatingLabel 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456" 
                  className="text-center text-xl tracking-widest"
                  maxLength={6}
                  required 
                />
                <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                  Verify & Login
                </Button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep('input')} className="text-sm text-[#6B6B6B] hover:text-[#013220]">
                    Change phone number
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-5">
              <Input 
                label="Email Address" 
                floatingLabel 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" 
                icon={<Mail size={18} />}
                required 
              />
              <Input 
                label="Password" 
                floatingLabel 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setResetStep('email')} className="text-sm text-[#013220] font-medium hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}
              <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
              <div className="text-center text-sm text-[#6B6B6B]">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#013220] font-medium hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0E0E0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B6B6B]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {authMethod === 'email' ? (
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={() => { setAuthMethod('otp'); setStep('input'); }}
                >
                  <Phone size={18} /> Phone Number
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={() => setAuthMethod('email')}
                >
                  <Mail size={18} /> Email
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AuthPageProps {
  apiUrl: string;
  onLoginSuccess: (playerData: any) => void;
}

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  'player1': { password: 'pass123', username: 'Player 1', credits: 1000 },
  'player2': { password: 'pass456', username: 'Player 2', credits: 500 },
  'player3': { password: 'pass789', username: 'Player 3', credits: 2000 },
};

export default function AuthPage({ apiUrl, onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Try to authenticate via API
      const response = await fetch(`${apiUrl}?action=authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.playerData) {
          toast.success(`Welcome back, ${result.playerData.username}!`);
          onLoginSuccess(result.playerData);
          return;
        }
      }

      // Fallback to demo credentials
      const demoUser = DEMO_CREDENTIALS[username.toLowerCase() as keyof typeof DEMO_CREDENTIALS];
      if (demoUser && demoUser.password === password) {
        toast.success(`Welcome back, ${demoUser.username}!`);
        onLoginSuccess({
          username: demoUser.username,
          'Player ID': username,
          'Current Credits': demoUser.credits,
          'Total Spins': 0,
          'Total Wins': 0,
        });
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo on network error
      const demoUser = DEMO_CREDENTIALS[username.toLowerCase() as keyof typeof DEMO_CREDENTIALS];
      if (demoUser && demoUser.password === password) {
        toast.success(`Welcome back, ${demoUser.username}!`);
        onLoginSuccess({
          username: demoUser.username,
          'Player ID': username,
          'Current Credits': demoUser.credits,
          'Total Spins': 0,
          'Total Wins': 0,
        });
      } else {
        toast.error('Connection failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Try to register via API
      const response = await fetch(`${apiUrl}?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success('Account created successfully! Please log in.');
          setIsLogin(true);
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          return;
        }
      }

      toast.error('Failed to create account');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Connection failed. Try demo account: player1/pass123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
            CYBER SLOTS
          </h1>
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            Elite Gaming Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-8 shadow-2xl">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 uppercase text-sm tracking-wide ${
                isLogin
                  ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 uppercase text-sm tracking-wide ${
                !isLogin
                  ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3 text-base font-bold
                bg-gradient-to-r from-cyan-500 to-blue-500 text-white
                hover:from-cyan-400 hover:to-blue-400
                shadow-lg shadow-cyan-500/30
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                rounded-lg uppercase tracking-wider
              "
            >
              {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
              Demo Accounts
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p>player1 / pass123</p>
              <p>player2 / pass456</p>
              <p>player3 / pass789</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8 uppercase tracking-widest">
          Secure Gaming Platform
        </p>
      </div>
    </div>
  );
}

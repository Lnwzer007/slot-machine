import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LoginFormProps {
  apiUrl: string;
  onLoginSuccess: (playerData: any) => void;
}

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  'player1': { password: 'pass123', username: 'Player 1', credits: 1000 },
  'player2': { password: 'pass456', username: 'Player 2', credits: 500 },
  'player3': { password: 'pass789', username: 'Player 3', credits: 2000 },
};

export default function LoginForm({ apiUrl, onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
          toast.success(`Welcome, ${result.playerData.username}!`);
          onLoginSuccess(result.playerData);
          return;
        }
      }

      // Fallback to demo credentials
      const demoUser = DEMO_CREDENTIALS[username.toLowerCase() as keyof typeof DEMO_CREDENTIALS];
      if (demoUser && demoUser.password === password) {
        toast.success(`Welcome, ${demoUser.username}! (Demo Mode)`);
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
        toast.success(`Welcome, ${demoUser.username}! (Offline Mode)`);
        onLoginSuccess({
          username: demoUser.username,
          'Player ID': username,
          'Current Credits': demoUser.credits,
          'Total Spins': 0,
          'Total Wins': 0,
        });
      } else {
        toast.error('Connection failed. Try demo: player1/pass123');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="w-full max-w-md p-8 bg-dark-card border-2 neon-border rounded-lg">
        <h1 className="text-4xl font-bold text-neon-cyan mb-2 font-display text-center neon-glow">
          CYBER SLOTS
        </h1>
        <p className="text-center text-muted-foreground mb-8">Enter your credentials to play</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., player1"
              className="bg-dark-bg border-neon-cyan/50 text-neon-cyan placeholder:text-muted-foreground focus:border-neon-cyan focus:ring-neon-cyan"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-dark-bg border-neon-cyan/50 text-neon-cyan placeholder:text-muted-foreground focus:border-neon-cyan focus:ring-neon-cyan"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-6 text-lg font-bold
              bg-neon-cyan text-dark-bg
              hover:bg-neon-lime hover:text-dark-bg
              neon-glow
              transition-all duration-200
              transform hover:scale-105 active:scale-95
            "
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-dark-bg/50 border border-neon-cyan/30 rounded">
          <p className="text-xs text-muted-foreground font-mono mb-2">Demo Credentials:</p>
          <p className="text-xs text-neon-cyan mb-1">player1 / pass123</p>
          <p className="text-xs text-neon-cyan mb-1">player2 / pass456</p>
          <p className="text-xs text-neon-cyan">player3 / pass789</p>
        </div>
      </div>
    </div>
  );
}

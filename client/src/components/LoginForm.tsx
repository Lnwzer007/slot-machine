import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LoginFormProps {
  apiUrl: string;
  onLoginSuccess: (playerData: any) => void;
}

export default function LoginForm({ apiUrl, onLoginSuccess }: LoginFormProps) {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerId.trim()) {
      toast.error('Please enter a Player ID');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}?action=getPlayerData&playerId=${playerId}`);
      const result = await response.json();

      if (result.success && result.playerData) {
        toast.success(`Welcome, ${result.playerData.Username}!`);
        onLoginSuccess(result.playerData);
      } else {
        toast.error('Player not found');
      }
    } catch (error) {
      toast.error('Failed to login');
      console.error(error);
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
        <p className="text-center text-muted-foreground mb-8">Enter your Player ID to begin</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase">
              Player ID
            </label>
            <Input
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="e.g., P001"
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

        <p className="text-center text-xs text-muted-foreground mt-6">
          Try P001, P002, or P003 to get started
        </p>
      </div>
    </div>
  );
}

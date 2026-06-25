import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import SlotMachine from '@/components/SlotMachine';
import PlayerDashboard from '@/components/PlayerDashboard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Original API URL
const ORIGINAL_API_URL = 'https://script.google.com/macros/s/AKfycbwpS3Aw4RUFqwSI3NZ0EhYbCyvOrQ7CYs1rqnto3CTlvU5fyPbBlbKoZXceTKW_tA27hQ/exec';

// CORS proxy to handle cross-origin requests
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = CORS_PROXY + ORIGINAL_API_URL;

interface GameConfig {
  BASE_BET?: number;
  MAX_BET?: number;
  JACKPOT_MULTIPLIER?: number;
  SYSTEM_MAINTENANCE?: boolean;
}

interface PlayerData {
  'Player ID': string;
  Username: string;
  'Current Credits': number;
  'Total Spins': number;
  'Total Wins': number;
  'Last Active': string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    BASE_BET: 10,
    MAX_BET: 500,
    JACKPOT_MULTIPLIER: 500,
    SYSTEM_MAINTENANCE: false,
  });
  const [currentCredits, setCurrentCredits] = useState(0);

  // Load game config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}?action=getConfig`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && result.config) {
          setGameConfig(result.config);
          if (result.config.SYSTEM_MAINTENANCE) {
            toast.error('System is under maintenance');
          }
        } else {
          console.warn('Config response not successful:', result);
          // Use default config if API fails
          setGameConfig({
            BASE_BET: 10,
            MAX_BET: 500,
            JACKPOT_MULTIPLIER: 500,
            SYSTEM_MAINTENANCE: false,
          });
        }
      } catch (error) {
        console.error('Failed to load config:', error);
        // Use default config if API fails
        setGameConfig({
          BASE_BET: 10,
          MAX_BET: 500,
          JACKPOT_MULTIPLIER: 500,
          SYSTEM_MAINTENANCE: false,
        });
        toast.warning('Using default game settings (API unavailable)');
      }
    };
    loadConfig();
  }, []);

  const handleLoginSuccess = (data: PlayerData) => {
    setPlayerData(data);
    setCurrentCredits(data['Current Credits']);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPlayerData(null);
    setCurrentCredits(0);
    toast.success('Logged out');
  };

  const handleSpinComplete = (result: any) => {
    // Update credits after spin
    if (playerData) {
      const newCredits = currentCredits - result.betAmount + result.winAmount;
      setCurrentCredits(newCredits);
      setPlayerData({
        ...playerData,
        'Current Credits': newCredits,
        'Total Spins': playerData['Total Spins'] + 1,
        'Total Wins': result.winAmount > 0 ? playerData['Total Wins'] + 1 : playerData['Total Wins'],
      });
    }
  };

  if (gameConfig.SYSTEM_MAINTENANCE === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-neon-magenta mb-4 font-display neon-glow-magenta">
            SYSTEM MAINTENANCE
          </h1>
          <p className="text-xl text-muted-foreground">The casino is temporarily closed for upgrades</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm apiUrl={API_URL} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-foreground">
      {/* Header */}
      <header className="border-b border-neon-cyan/30 bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon-cyan rounded-full flex items-center justify-center neon-glow">
              <span className="text-dark-bg font-bold">⚡</span>
            </div>
            <h1 className="text-2xl font-bold text-neon-cyan font-display neon-glow">CYBER SLOTS</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-dark-bg"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats */}
          <aside className="lg:col-span-1">
            <PlayerDashboard playerData={playerData} />
          </aside>

          {/* Center - Slot Machine */}
          <section className="lg:col-span-2">
            <div className="bg-dark-card border-2 neon-border rounded-lg p-8">
              <SlotMachine
                apiUrl={API_URL}
                playerId={playerData?.['Player ID'] || ''}
                currentCredits={currentCredits}
                baseBet={gameConfig.BASE_BET || 10}
                maxBet={gameConfig.MAX_BET || 500}
                jackpotMultiplier={gameConfig.JACKPOT_MULTIPLIER || 500}
                onSpinComplete={handleSpinComplete}
              />
            </div>
          </section>

          {/* Right Sidebar - Info */}
          <aside className="lg:col-span-1">
            <div className="bg-dark-card border-2 neon-border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-neon-lime font-display">PAYOUTS</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-neon-cyan pl-3">
                  <p className="text-muted-foreground">3x 7 (Horizontal/Vertical/Diagonal)</p>
                  <p className="text-neon-cyan font-bold">500x Bet</p>
                </div>
                <div className="border-l-2 border-neon-magenta pl-3">
                  <p className="text-muted-foreground">3x 💎 (Any Line)</p>
                  <p className="text-neon-magenta font-bold">100x Bet</p>
                </div>
                <div className="border-l-2 border-neon-lime pl-3">
                  <p className="text-muted-foreground">3x Any Symbol</p>
                  <p className="text-neon-lime font-bold">10x Bet</p>
                </div>
              </div>

              <div className="border-t border-neon-cyan/30 pt-4 mt-4">
                <h4 className="text-sm font-mono text-muted-foreground uppercase mb-2">Game Config</h4>
                <div className="space-y-1 text-xs font-mono">
                  <p>Base Bet: <span className="text-neon-cyan">{gameConfig.BASE_BET}</span></p>
                  <p>Max Bet: <span className="text-neon-cyan">{gameConfig.MAX_BET}</span></p>
                  <p>Jackpot: <span className="text-neon-cyan">{gameConfig.JACKPOT_MULTIPLIER}x</span></p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/30 bg-dark-card/50 mt-12 py-6">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>🎰 CYBER SLOTS - High-Octane Arcade Gaming 🎰</p>
          <p className="mt-2 text-xs">Powered by Google Sheets API | Cyberpunk Edition</p>
        </div>
      </footer>
    </div>
  );
}

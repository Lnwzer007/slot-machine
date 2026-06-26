import { useState, useEffect } from 'react';
import AuthPage from './AuthPage';
import SlotMachine from '@/components/SlotMachine';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_URL = 'https://script.google.com/macros/s/AKfycbwpS3Aw4RUFqwSI3NZ0EhYbCyvOrQ7CYs1rqnto3CTlvU5fyPbBlbKoZXceTKW_tA27hQ/exec';

interface PlayerData {
  'Player ID': string;
  username: string;
  'Current Credits': number;
  'Total Spins': number;
  'Total Wins': number;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [currentCredits, setCurrentCredits] = useState(0);

  const handleLoginSuccess = (data: PlayerData) => {
    setPlayerData(data);
    setCurrentCredits(data['Current Credits']);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPlayerData(null);
    setCurrentCredits(0);
    toast.success('Logged out successfully');
  };

  const handleSpinComplete = (result: any) => {
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

  if (!isLoggedIn) {
    return <AuthPage apiUrl={API_URL} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">CYBER SLOTS</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Elite Gaming</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-slate-400 uppercase tracking-wider">Player</p>
              <p className="text-lg font-bold text-cyan-400">{playerData?.username}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400 uppercase tracking-wider">Credits</p>
              <p className="text-lg font-bold text-green-400">{currentCredits}</p>
            </div>

            <Button
              onClick={handleLogout}
              className="
                bg-slate-700 hover:bg-slate-600
                text-white font-semibold
                px-6 py-2 rounded-lg
                transition-all duration-300
                uppercase text-sm tracking-wider
              "
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slot Machine */}
          <div className="lg:col-span-2">
            <SlotMachine
              playerId={playerData?.['Player ID'] || ''}
              playerCredits={currentCredits}
              apiUrl={API_URL}
              onSpinComplete={handleSpinComplete}
            />
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Session Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Total Spins</span>
                  <span className="text-cyan-400 font-bold">{playerData?.['Total Spins'] || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Total Wins</span>
                  <span className="text-green-400 font-bold">{playerData?.['Total Wins'] || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Win Rate</span>
                  <span className="text-blue-400 font-bold">
                    {playerData && playerData['Total Spins'] > 0
                      ? ((playerData['Total Wins'] / playerData['Total Spins']) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Payouts
              </h2>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Triple 7</span>
                  <span className="text-yellow-400 font-bold">500x</span>
                </div>
                <div className="flex justify-between">
                  <span>Triple Cherry</span>
                  <span className="text-yellow-400 font-bold">200x</span>
                </div>
                <div className="flex justify-between">
                  <span>Triple Bell</span>
                  <span className="text-yellow-400 font-bold">150x</span>
                </div>
                <div className="flex justify-between">
                  <span>Triple Bar</span>
                  <span className="text-yellow-400 font-bold">100x</span>
                </div>
                <div className="flex justify-between">
                  <span>Triple Gold</span>
                  <span className="text-yellow-400 font-bold">300x</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
              <p className="text-xs text-slate-400 leading-relaxed">
                Match three identical symbols to win. Adjust your bet using the slider on the slot machine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

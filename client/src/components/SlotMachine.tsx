import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SlotMachineProps {
  playerId: string;
  playerCredits: number;
  apiUrl: string;
  onSpinComplete: (result: any) => void;
}

const SYMBOLS = ['7', 'CHERRY', 'BELL', 'BAR', 'GOLD'];
const PAYOUTS: Record<string, number> = {
  '777': 500,
  'CHERRYCHERRYCHERRY': 200,
  'BELLBELLBELL': 150,
  'BARBARBAR': 100,
  'GOLDGOLDGOLD': 300,
};

export default function SlotMachine({
  playerId,
  playerCredits,
  apiUrl,
  onSpinComplete,
}: SlotMachineProps) {
  const [reels, setReels] = useState([
    { result: '7', spinning: false },
    { result: 'CHERRY', spinning: false },
    { result: 'BELL', spinning: false },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [lastResult, setLastResult] = useState<string>('');

  const canSpin = playerCredits >= betAmount && !isSpinning;

  const spinReels = async () => {
    if (!canSpin) {
      toast.error('Insufficient credits');
      return;
    }

    setIsSpinning(true);
    setLastResult('');

    // Start spinning animation
    const spinningReels = reels.map(() => ({ result: '', spinning: true }));
    setReels(spinningReels);

    // Simulate spinning duration (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate results
    const results = reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    const resultKey = results.join('');
    const winAmount = PAYOUTS[resultKey] || 0;
    const payoutType = winAmount > 0 ? `WIN: ${winAmount}` : 'NO WIN';

    // Stop spinning with results
    setReels(results.map((result) => ({ result, spinning: false })));
    setLastResult(payoutType);

    // Log spin to API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logSpin',
          playerId,
          betAmount,
          winAmount,
          resultMatrix: results,
          payoutType,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (winAmount > 0) {
            toast.success(`${payoutType}!`);
          }
          onSpinComplete({
            betAmount,
            winAmount,
            resultMatrix: results,
            payoutType,
          });
        }
      }
    } catch (error) {
      console.error('Error logging spin:', error);
      onSpinComplete({
        betAmount,
        winAmount,
        resultMatrix: results,
        payoutType,
      });
    }

    setIsSpinning(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Slot Machine Cabinet */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl p-8 shadow-2xl border-4 border-slate-600">
        {/* Display */}
        <div className="bg-black rounded-lg p-6 mb-8 border-2 border-slate-500">
          <div className="flex gap-4 justify-center mb-6">
            {reels.map((reel, idx) => (
              <div
                key={idx}
                className={`
                  w-24 h-32 bg-gradient-to-b from-slate-800 to-slate-900
                  border-2 border-slate-600 rounded-lg
                  flex items-center justify-center
                  text-3xl font-bold text-white
                  transition-all duration-300
                  ${reel.spinning ? 'animate-pulse' : ''}
                `}
              >
                {reel.spinning ? (
                  <div className="animate-spin text-2xl">⟳</div>
                ) : (
                  <span className="text-center">{reel.result}</span>
                )}
              </div>
            ))}
          </div>

          {/* Result Display */}
          {lastResult && (
            <div className="text-center mb-4">
              <p className={`text-xl font-bold uppercase tracking-wider ${
                lastResult.includes('WIN') ? 'text-green-400' : 'text-slate-400'
              }`}>
                {lastResult}
              </p>
            </div>
          )}
        </div>

        {/* Bet Controls */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <label className="text-slate-300 font-semibold uppercase text-sm tracking-wider">
              Bet Amount
            </label>
            <span className="text-cyan-400 font-bold text-lg">{betAmount}</span>
          </div>

          <input
            type="range"
            min="10"
            max={Math.min(playerCredits, 500)}
            step="10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseInt(e.target.value))}
            disabled={isSpinning}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />

          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Min: 10</span>
            <span>Max: {Math.min(playerCredits, 500)}</span>
          </div>
        </div>

        {/* Credits Display */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 mb-6 border border-slate-600/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 uppercase text-sm font-semibold tracking-wider">
              Your Credits
            </span>
            <span className="text-2xl font-bold text-cyan-400">
              {playerCredits}
            </span>
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spinReels}
          disabled={!canSpin}
          className="
            w-full py-4 text-lg font-bold
            bg-gradient-to-r from-cyan-500 to-blue-500
            hover:from-cyan-400 hover:to-blue-400
            disabled:from-slate-600 disabled:to-slate-700
            disabled:cursor-not-allowed
            text-white
            shadow-lg shadow-cyan-500/50
            transition-all duration-300
            transform hover:scale-105 active:scale-95
            rounded-lg uppercase tracking-wider
          "
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </Button>

        {/* Info */}
        <p className="text-center text-xs text-slate-500 mt-6 uppercase tracking-widest">
          Match 3 symbols to win
        </p>
      </div>
    </div>
  );
}

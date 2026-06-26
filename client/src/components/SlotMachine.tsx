import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SlotMachineProps {
  playerId: string;
  playerCredits: number;
  apiUrl: string;
  onSpinComplete: (result: any) => void;
}

const SYMBOLS = ['🍒', '🔔', '🍀', '💎', '7️⃣', '🎰'];
const PAYOUTS: Record<string, number> = {
  '🍒🍒🍒': 50,
  '🔔🔔🔔': 100,
  '🍀🍀🍀': 150,
  '💎💎💎': 300,
  '7️⃣7️⃣7️⃣': 500,
  '🎰🎰🎰': 200,
};

interface ReelState {
  symbols: string[];
  position: number;
  spinning: boolean;
}

export default function SlotMachine({
  playerId,
  playerCredits,
  apiUrl,
  onSpinComplete,
}: SlotMachineProps) {
  const [reels, setReels] = useState<ReelState[]>([
    { symbols: SYMBOLS, position: 0, spinning: false },
    { symbols: SYMBOLS, position: 0, spinning: false },
    { symbols: SYMBOLS, position: 0, spinning: false },
  ]);

  const [betAmount, setBetAmount] = useState('10');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const [lastWin, setLastWin] = useState(0);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const canSpin = playerCredits >= parseInt(betAmount || '0') && !isSpinning && parseInt(betAmount || '0') > 0;

  const spinReels = async () => {
    if (!canSpin) {
      if (parseInt(betAmount || '0') <= 0) {
        toast.error('Bet amount must be greater than 0');
      } else {
        toast.error('Insufficient credits');
      }
      return;
    }

    const bet = parseInt(betAmount);
    setIsSpinning(true);
    setLastResult('');
    setLastWin(0);

    // Generate random final positions for each reel
    const finalPositions = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];

    // Animate each reel spinning
    const spinDuration = 3000; // 3 seconds
    const startTime = Date.now();

    const animateSpin = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newReels = reels.map((reel, idx) => {
        // Spin multiple times then land on final position
        const spins = 5; // Number of full rotations
        const totalRotations = spins + easeOut;
        const position = (finalPositions[idx] + totalRotations * SYMBOLS.length) % SYMBOLS.length;

        return {
          ...reel,
          position: Math.floor(position),
          spinning: progress < 1,
        };
      });

      setReels(newReels);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Spin complete - check results
        const resultSymbols = finalPositions.map((pos) => SYMBOLS[pos]);
        const resultKey = resultSymbols.join('');
        const winAmount = PAYOUTS[resultKey] || 0;

        setLastResult(resultSymbols.join(' '));
        setLastWin(winAmount);

        if (winAmount > 0) {
          toast.success(`WIN! ${winAmount} credits!`);
        } else {
          toast.info('No match');
        }

        // Log to Google Sheets
        logSpinToSheet(bet, winAmount, resultSymbols);

        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const logSpinToSheet = async (betAmount: number, winAmount: number, resultMatrix: string[]) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logSpin',
          playerId,
          betAmount,
          winAmount,
          resultMatrix,
          payoutType: winAmount > 0 ? `WIN: ${winAmount}` : 'NO WIN',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onSpinComplete({
            betAmount,
            winAmount,
            resultMatrix,
            payoutType: winAmount > 0 ? `WIN: ${winAmount}` : 'NO WIN',
          });
        }
      }
    } catch (error) {
      console.error('Error logging spin:', error);
      // Still complete the spin even if logging fails
      onSpinComplete({
        betAmount,
        winAmount,
        resultMatrix,
        payoutType: winAmount > 0 ? `WIN: ${winAmount}` : 'NO WIN',
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Slot Machine Cabinet */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl p-8 shadow-2xl border-4 border-slate-600">
        {/* Display */}
        <div className="bg-black rounded-lg p-6 mb-8 border-4 border-yellow-600 shadow-lg shadow-yellow-600/50">
          <div className="flex gap-4 justify-center mb-6">
            {reels.map((reel, idx) => (
              <div
                key={idx}
                ref={(el) => (reelRefs.current[idx] = el)}
                className="
                  w-24 h-32 bg-gradient-to-b from-slate-900 to-black
                  border-4 border-yellow-500 rounded-lg
                  flex items-center justify-center
                  text-5xl font-bold
                  overflow-hidden
                  relative
                  shadow-inner
                "
              >
                <div
                  className="transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateY(${-reel.position * 100}%)`,
                  }}
                >
                  {[...SYMBOLS, ...SYMBOLS].map((symbol, i) => (
                    <div key={i} className="h-32 flex items-center justify-center">
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Result Display */}
          {lastResult && (
            <div className="text-center">
              <p className={`text-2xl font-bold uppercase tracking-wider ${
                lastWin > 0 ? 'text-green-400 animate-pulse' : 'text-slate-400'
              }`}>
                {lastWin > 0 ? `🎉 WIN! ${lastWin} 🎉` : 'NO MATCH'}
              </p>
            </div>
          )}
        </div>

        {/* Bet Controls */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-6 border border-slate-600/50">
          <label className="text-slate-300 font-semibold uppercase text-sm tracking-wider mb-3 block">
            Bet Amount
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              max={playerCredits}
              disabled={isSpinning}
              className="
                bg-slate-900/50 border-slate-600/50 text-white
                placeholder:text-slate-500 focus:border-cyan-500
                focus:ring-cyan-500/20 rounded-lg text-lg font-bold
              "
              placeholder="Enter bet"
            />
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase">Max</p>
              <p className="text-lg font-bold text-cyan-400">{playerCredits}</p>
            </div>
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[10, 25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(Math.min(amount, playerCredits).toString())}
              disabled={isSpinning || playerCredits < amount}
              className="
                bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800
                disabled:text-slate-500 text-white font-semibold
                py-2 px-3 rounded-lg transition-all
                text-sm uppercase tracking-wider
              "
            >
              {amount}
            </button>
          ))}
        </div>

        {/* Spin Button */}
        <Button
          onClick={spinReels}
          disabled={!canSpin}
          className="
            w-full py-4 text-xl font-bold
            bg-gradient-to-r from-yellow-500 to-yellow-600
            hover:from-yellow-400 hover:to-yellow-500
            disabled:from-slate-600 disabled:to-slate-700
            disabled:cursor-not-allowed
            text-black
            shadow-lg shadow-yellow-500/50
            transition-all duration-300
            transform hover:scale-105 active:scale-95
            rounded-lg uppercase tracking-wider
          "
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </Button>

        {/* Info */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <p className="text-xs text-slate-400 text-center uppercase tracking-widest mb-3">
            Winning Combinations
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>🍒🍒🍒 = 50</div>
            <div>🔔🔔🔔 = 100</div>
            <div>🍀🍀🍀 = 150</div>
            <div>💎💎💎 = 300</div>
            <div>7️⃣7️⃣7️⃣ = 500</div>
            <div>🎰🎰🎰 = 200</div>
          </div>
        </div>
      </div>
    </div>
  );
}

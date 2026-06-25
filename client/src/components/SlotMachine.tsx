import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Slot symbols
const SYMBOLS = ['7', '💎', '🍒', '🔔', '🍋', '🍉', '👑', '💰'];

interface ReelState {
  spinning: boolean;
  result: string[];
}

interface SlotMachineProps {
  apiUrl: string;
  playerId: string;
  currentCredits: number;
  baseBet: number;
  maxBet: number;
  jackpotMultiplier: number;
  onSpinComplete: (result: { betAmount: number; winAmount: number; resultMatrix: string[]; payoutType: string }) => void;
}

export default function SlotMachine({
  apiUrl,
  playerId,
  currentCredits,
  baseBet,
  maxBet,
  jackpotMultiplier,
  onSpinComplete,
}: SlotMachineProps) {
  const [reels, setReels] = useState<ReelState[]>([
    { spinning: false, result: ['7', '💎', '🍒'] },
    { spinning: false, result: ['🔔', '🍋', '🍉'] },
    { spinning: false, result: ['👑', '💰', '7'] },
  ]);

  const [betAmount, setBetAmount] = useState(baseBet);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calculate win based on paylines
  const calculateWin = (resultMatrix: string[][]): { winAmount: number; payoutType: string } => {
    // Check horizontal lines
    for (let row = 0; row < 3; row++) {
      if (resultMatrix[row][0] === resultMatrix[row][1] && resultMatrix[row][1] === resultMatrix[row][2]) {
        const symbol = resultMatrix[row][0];
        if (symbol === '7') {
          return { winAmount: betAmount * jackpotMultiplier, payoutType: 'JACKPOT!' };
        } else if (symbol === '💎') {
          return { winAmount: betAmount * 100, payoutType: 'Big Win' };
        } else {
          return { winAmount: betAmount * 10, payoutType: 'Small Win' };
        }
      }
    }

    // Check vertical lines
    for (let col = 0; col < 3; col++) {
      if (resultMatrix[0][col] === resultMatrix[1][col] && resultMatrix[1][col] === resultMatrix[2][col]) {
        const symbol = resultMatrix[0][col];
        if (symbol === '7') {
          return { winAmount: betAmount * jackpotMultiplier, payoutType: 'JACKPOT!' };
        } else if (symbol === '💎') {
          return { winAmount: betAmount * 100, payoutType: 'Big Win' };
        } else {
          return { winAmount: betAmount * 10, payoutType: 'Small Win' };
        }
      }
    }

    // Check diagonals
    if (resultMatrix[0][0] === resultMatrix[1][1] && resultMatrix[1][1] === resultMatrix[2][2]) {
      const symbol = resultMatrix[0][0];
      if (symbol === '7') {
        return { winAmount: betAmount * jackpotMultiplier, payoutType: 'JACKPOT!' };
      } else if (symbol === '💎') {
        return { winAmount: betAmount * 100, payoutType: 'Big Win' };
      } else {
        return { winAmount: betAmount * 10, payoutType: 'Small Win' };
      }
    }

    if (resultMatrix[0][2] === resultMatrix[1][1] && resultMatrix[1][1] === resultMatrix[2][0]) {
      const symbol = resultMatrix[0][2];
      if (symbol === '7') {
        return { winAmount: betAmount * jackpotMultiplier, payoutType: 'JACKPOT!' };
      } else if (symbol === '💎') {
        return { winAmount: betAmount * 100, payoutType: 'Big Win' };
      } else {
        return { winAmount: betAmount * 10, payoutType: 'Small Win' };
      }
    }

    return { winAmount: 0, payoutType: 'Loss' };
  };

  const handleSpin = async () => {
    if (isSpinning || currentCredits < betAmount) {
      toast.error('Insufficient credits or already spinning!');
      return;
    }

    setIsSpinning(true);
    setWinAmount(0);

    // Play spin sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Animate reels spinning
    const newReels = reels.map((reel) => ({
      ...reel,
      spinning: true,
      result: reel.result,
    }));
    setReels(newReels);

    // Simulate spin duration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate random results
    const resultMatrix: string[][] = [];
    for (let i = 0; i < 3; i++) {
      resultMatrix.push([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }

    // Calculate win
    const { winAmount: calculatedWin, payoutType } = calculateWin(resultMatrix);
    setWinAmount(calculatedWin);

    // Update reel results
    const updatedReels = resultMatrix.map((row) => ({
      spinning: false,
      result: row,
    }));
    setReels(updatedReels);

    // Log spin to Google Sheets
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logSpin',
          playerId,
          betAmount,
          winAmount: calculatedWin,
          resultMatrix: resultMatrix.flat(),
          payoutType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        toast.success(`${payoutType} - Won ${calculatedWin}!`);
        onSpinComplete({
          betAmount,
          winAmount: calculatedWin,
          resultMatrix: resultMatrix.flat(),
          payoutType,
        });
      } else {
        console.warn('Spin logged but response indicates failure:', result);
        onSpinComplete({
          betAmount,
          winAmount: calculatedWin,
          resultMatrix: resultMatrix.flat(),
          payoutType,
        });
        toast.warning('Spin recorded locally (server sync failed)');
      }
    } catch (error) {
      console.error('Error logging spin:', error);
      onSpinComplete({
        betAmount,
        winAmount: calculatedWin,
        resultMatrix: resultMatrix.flat(),
        payoutType,
      });
      toast.warning('Spin recorded locally (server unavailable)');
    }

    setIsSpinning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==" />

      {/* Reel Display */}
      <div className="neon-border border-2 p-6 rounded-lg bg-dark-card">
        <div className="grid grid-cols-3 gap-4">
          {reels.map((reel, reelIndex) => (
            <div key={reelIndex} className="flex flex-col gap-2">
              {reel.result.map((symbol, symbolIndex) => (
                <div
                  key={symbolIndex}
                  className={`
                    w-20 h-20 flex items-center justify-center text-4xl
                    border-2 border-neon-cyan rounded
                    ${reel.spinning ? 'animate-spin' : ''}
                    transition-all duration-300
                    bg-dark-bg
                  `}
                >
                  {symbol}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Win Display */}
      {winAmount > 0 && (
        <div className="text-center">
          <h2 className="text-3xl font-bold neon-glow-lime mb-2">
            YOU WIN!
          </h2>
          <p className="text-2xl font-mono text-neon-lime">
            +{winAmount} Credits
          </p>
        </div>
      )}

      {/* Bet Controls */}
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => setBetAmount(Math.max(baseBet, betAmount - baseBet))}
          disabled={isSpinning}
          variant="outline"
          className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-dark-bg"
        >
          -
        </Button>
        <div className="text-center min-w-32">
          <p className="text-sm text-muted-foreground">Bet Amount</p>
          <p className="text-2xl font-mono font-bold text-neon-cyan">{betAmount}</p>
        </div>
        <Button
          onClick={() => setBetAmount(Math.min(maxBet, betAmount + baseBet))}
          disabled={isSpinning}
          variant="outline"
          className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-dark-bg"
        >
          +
        </Button>
      </div>

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || currentCredits < betAmount}
        className="
          px-12 py-6 text-xl font-bold
          bg-neon-cyan text-dark-bg
          hover:bg-neon-lime hover:text-dark-bg
          neon-glow
          transition-all duration-200
          transform hover:scale-105 active:scale-95
        "
      >
        {isSpinning ? 'SPINNING...' : 'SPIN!'}
      </Button>

      {/* Credits Display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Current Credits</p>
        <p className="text-3xl font-mono font-bold text-neon-cyan">
          {currentCredits - (isSpinning ? betAmount : 0)}
        </p>
      </div>
    </div>
  );
}

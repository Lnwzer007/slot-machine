import { Card } from '@/components/ui/card';

interface PlayerData {
  'Player ID': string;
  Username: string;
  'Current Credits': number;
  'Total Spins': number;
  'Total Wins': number;
  'Last Active': string;
}

interface PlayerDashboardProps {
  playerData: PlayerData | null;
}

export default function PlayerDashboard({ playerData }: PlayerDashboardProps) {
  if (!playerData) {
    return (
      <Card className="p-6 bg-dark-card border-neon-border">
        <p className="text-muted-foreground">No player data loaded</p>
      </Card>
    );
  }

  const winRate = playerData['Total Spins'] > 0 
    ? ((playerData['Total Wins'] / playerData['Total Spins']) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-dark-card border-neon-border">
        <h2 className="text-2xl font-bold text-neon-cyan mb-4 font-display">
          PLAYER STATS
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-bg p-4 rounded border border-neon-cyan/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Player ID</p>
            <p className="text-lg font-mono font-bold text-neon-cyan">{playerData['Player ID']}</p>
          </div>
          
          <div className="bg-dark-bg p-4 rounded border border-neon-cyan/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Username</p>
            <p className="text-lg font-mono font-bold text-neon-cyan">{playerData.Username}</p>
          </div>
          
          <div className="bg-dark-bg p-4 rounded border border-neon-magenta/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Credits</p>
            <p className="text-lg font-mono font-bold text-neon-magenta">{playerData['Current Credits']}</p>
          </div>
          
          <div className="bg-dark-bg p-4 rounded border border-neon-lime/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Spins</p>
            <p className="text-lg font-mono font-bold text-neon-lime">{playerData['Total Spins']}</p>
          </div>
          
          <div className="bg-dark-bg p-4 rounded border border-neon-lime/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Wins</p>
            <p className="text-lg font-mono font-bold text-neon-lime">{playerData['Total Wins']}</p>
          </div>
          
          <div className="bg-dark-bg p-4 rounded border border-neon-cyan/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</p>
            <p className="text-lg font-mono font-bold text-neon-cyan">{winRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

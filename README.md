# 🎰 CYBER SLOTS - Cyberpunk Arcade Slot Machine

A high-octane, neon-soaked arcade slot machine game built with React, Tailwind CSS, and Google Sheets. Experience the thrill of Vegas with a futuristic Cyberpunk aesthetic.

![Cyberpunk Slot Machine](https://d2xsxph8kpxj0f.cloudfront.net/310519663727023007/idGD53D3wRomW8kvNVoFTS/cyberpunk_hero_background-VaTXwupQV4K7aWRthccBs8.webp)

## ✨ Features

- **Neon Cyberpunk UI** - Deep black backgrounds with glowing cyan, magenta, and lime accents
- **3x3 Slot Reel System** - Smooth animations with elastic bounce effects
- **8 Unique Symbols** - 7, 💎, 🍒, 🔔, 🍋, 🍉, 👑, 💰
- **Multiple Paylines** - 8 winning combinations (3 horizontal, 3 vertical, 2 diagonal)
- **Player Management** - Login system with persistent player data
- **Real-time Logging** - All spins logged to Google Sheets for analytics
- **Remote Configuration** - Change game settings without code changes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Sound Effects** - Audio feedback for spins and wins
- **Particle Effects** - Celebratory animations on big wins

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- A Google Sheet with player data (provided)
- Google Apps Script Web App URL (already deployed)

### Installation

```bash
# Clone or navigate to the project
cd cyber-slot-machine

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` and enter a Player ID (e.g., P001) to start playing.

## 📋 Project Structure

```
cyber-slot-machine/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SlotMachine.tsx      # Main game component
│   │   │   ├── PlayerDashboard.tsx  # Player stats display
│   │   │   └── LoginForm.tsx        # Authentication form
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main game page
│   │   ├── index.css                # Cyberpunk theme colors
│   │   └── App.tsx                  # App routing
│   ├── index.html
│   └── public/
├── server/                          # Backend placeholder
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── apps_script_backend.gs           # Google Apps Script code
└── ideas.md                         # Design philosophy
```

## 🎮 How to Play

1. **Login**: Enter your Player ID (P001, P002, or P003)
2. **Set Bet**: Use +/- buttons to adjust your bet amount
3. **Spin**: Click the SPIN button to start the reels
4. **Win**: Match 3 symbols on any payline to win
5. **Repeat**: Keep spinning until you run out of credits

## 💰 Payout Structure

| Combination | Multiplier | Type |
|------------|-----------|------|
| 3x 7 (any line) | 500x | JACKPOT! |
| 3x 💎 (any line) | 100x | Big Win |
| 3x Any Symbol | 10x | Small Win |
| No match | 0x | Loss |

## 🎨 Design System

### Colors
- **Primary Neon**: Cyan (#00f0ff) - Main interactive elements
- **Secondary Neon**: Magenta (#ff006e) - Accents and highlights
- **Tertiary Neon**: Lime (#39ff14) - Success and win states
- **Background**: Deep Black (#0a0e27) - Main background
- **Cards**: Dark Slate (#1a1f3a) - Secondary surfaces

### Typography
- **Display**: Orbitron (bold, geometric, futuristic)
- **Labels**: Space Mono (monospace, technical)
- **Body**: Inter (clean, readable)

### Effects
- Neon glow text shadows
- Glowing borders with box-shadow
- Smooth CSS animations
- Elastic bounce on reel stop
- Particle effects on big wins

## 🔌 API Integration

### Google Apps Script Endpoints

**Get Configuration**
```javascript
fetch(`${API_URL}?action=getConfig`)
```

**Get Player Data**
```javascript
fetch(`${API_URL}?action=getPlayerData&playerId=P001`)
```

**Log Spin**
```javascript
fetch(`${API_URL}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'logSpin',
    playerId: 'P001',
    betAmount: 10,
    winAmount: 100,
    resultMatrix: ['7', '7', '7', '💎', '💎', '💎', '🍒', '🍒', '🍒'],
    payoutType: 'Big Win'
  })
})
```

## 📊 Data Storage

All game data is stored in Google Sheets with three tabs:

1. **Player_Data** - Player profiles and statistics
2. **Spin_History** - Complete audit log of all spins
3. **Game_Config** - Remote game configuration

See `SETUP_GUIDE.md` for detailed schema information.

## 🛠️ Customization

### Change Bet Limits
Edit `Game_Config` sheet in Google Sheets:
```
BASE_BET: 10 → 50
MAX_BET: 500 → 1000
```

### Adjust Jackpot Multiplier
Edit `Game_Config` sheet:
```
JACKPOT_MULTIPLIER: 500 → 1000
```

### Add New Symbols
Edit `client/src/components/SlotMachine.tsx`:
```typescript
const SYMBOLS = ['7', '💎', '🍒', '🔔', '🍋', '🍉', '👑', '💰', '🌟']; // Add new symbol
```

### Change Colors
Edit `client/src/index.css`:
```css
--neon-cyan: #00f0ff;      /* Change primary color */
--neon-magenta: #ff006e;   /* Change secondary color */
--dark-bg: #0a0e27;        /* Change background */
```

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (375px - 767px)

Layout automatically adjusts for smaller screens with:
- Single column on mobile
- Stacked components
- Touch-friendly button sizes

## 🔐 Security Notes

This is a demonstration project. For production:
- Implement proper user authentication
- Add server-side validation
- Use secure API endpoints
- Encrypt sensitive data
- Implement rate limiting
- Add audit logging

## 📖 Full Documentation

See `SETUP_GUIDE.md` for:
- Detailed Google Sheets setup
- Google Apps Script deployment
- Troubleshooting guide
- API reference
- Customization options

## 🎯 Game Mechanics

### Reel System
- 3x3 grid of symbols
- Each reel spins independently
- Smooth CSS animations
- 2-second spin duration
- Elastic bounce on stop

### Win Detection
- Checks 8 paylines per spin
- Horizontal (3 lines)
- Vertical (3 lines)
- Diagonal (2 lines)
- First match wins

### Player Progression
- Credits updated after each spin
- Total spins tracked
- Total wins tracked
- Win rate calculated
- Last active timestamp recorded

## 🎬 Animation Guide

All animations respect `prefers-reduced-motion`:
- **Reel Spin**: 2000ms smooth spin
- **Button Press**: 160ms scale animation
- **Text Glow**: 200ms fade-in
- **Particle Burst**: 300ms outward animation

## 🚀 Deployment

### Local Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

### Deploy to Manus
1. Create a checkpoint
2. Click Publish in Management UI
3. Site available at `cyber-slot-machine.manus.space`

## 📝 Version History

- **v1.0.0** (2026-06-25) - Initial release
  - 3x3 slot machine with 8 symbols
  - Cyberpunk UI with neon effects
  - Google Sheets integration
  - Player management system
  - Real-time spin logging

## 🙏 Credits

- **Design**: Cyberpunk Arcade aesthetic
- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Google Apps Script + Google Sheets
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## 📄 License

MIT License - Feel free to use and modify

---

**Ready to play?** 🎰⚡

Login with P001, P002, or P003 and start spinning!

For detailed setup instructions, see `SETUP_GUIDE.md`

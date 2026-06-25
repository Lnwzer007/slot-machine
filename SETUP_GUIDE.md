# Cyberpunk Slot Machine - Complete Setup Guide

Welcome to **CYBER SLOTS**, a high-octane arcade slot machine game with a Cyberpunk aesthetic, powered by React and Google Sheets. This guide will walk you through setting up and deploying the entire system.

## Overview

The Cyberpunk Slot Machine consists of three main components:

1. **Google Sheets Database** - Stores player data, spin history, and game configuration
2. **Google Apps Script API** - Acts as middleware between frontend and Google Sheets
3. **React Frontend** - The interactive slot machine game with Cyberpunk UI

## Prerequisites

- A Google Account
- A Google Sheet (already created and shared with you)
- The Google Apps Script Web App URL (already deployed)
- Node.js and pnpm installed locally (for development)

## Part 1: Google Sheets Setup

Your Google Sheet should have three tabs with the following structure:

### Tab 1: Player_Data
This tab stores player information and statistics.

| Player ID | Username | Current Credits | Total Spins | Total Wins | Last Active |
|-----------|----------|-----------------|-------------|-----------|-------------|
| P001      | Player1  | 1000            | 50          | 15        | 2026-06-25  |
| P002      | Player2  | 500             | 20          | 5         | 2026-06-25  |
| P003      | Player3  | 2000            | 100         | 30        | 2026-06-25  |

**Column Descriptions:**
- **Player ID**: Unique identifier (e.g., P001, P002)
- **Username**: Display name for the player
- **Current Credits**: Available credits to play with
- **Total Spins**: Cumulative number of spins
- **Total Wins**: Cumulative number of winning spins
- **Last Active**: Timestamp of last login

### Tab 2: Spin_History
This tab logs every spin for audit and analytics purposes.

| Timestamp | Player ID | Bet Amount | Win Amount | Result Matrix (3x3) | Payout Type |
|-----------|-----------|-----------|-----------|-------------------|-------------|
| 2026-06-25T10:30:00 | P001 | 10 | 100 | 7,7,7,💎,💎,💎,🍒,🍒,🍒 | Big Win |
| 2026-06-25T10:31:00 | P001 | 10 | 0 | 🔔,🍋,🍉,🍉,🔔,🍋,7,💎,🍒 | Loss |

**Column Descriptions:**
- **Timestamp**: When the spin occurred
- **Player ID**: Which player spun
- **Bet Amount**: Credits wagered
- **Win Amount**: Credits won (0 if loss)
- **Result Matrix (3x3)**: The 9 symbols that appeared (flattened array)
- **Payout Type**: JACKPOT!, Big Win, Small Win, or Loss

### Tab 3: Game_Config
This tab controls game settings remotely without code changes.

| Key | Value |
|-----|-------|
| BASE_BET | 10 |
| MAX_BET | 500 |
| JACKPOT_MULTIPLIER | 500 |
| SYSTEM_MAINTENANCE | FALSE |

**Configuration Options:**
- **BASE_BET**: Minimum bet amount (default: 10)
- **MAX_BET**: Maximum bet amount (default: 500)
- **JACKPOT_MULTIPLIER**: Multiplier for 3x7 wins (default: 500)
- **SYSTEM_MAINTENANCE**: Set to TRUE to display maintenance message (default: FALSE)

## Part 2: Google Apps Script Deployment

The Google Apps Script has already been deployed and is available at:

```
https://script.google.com/macros/s/AKfycbwpS3Aw4RUFqwSI3NZ0EhYbCyvOrQ7CYs1rqnto3CTlvU5fyPbBlbKoZXceTKW_tA27hQ/exec
```

### If You Need to Redeploy

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Replace the code in `Code.gs` with the contents of `apps_script_backend.gs`
4. Click **Deploy > New deployment**
5. Select **Web app**
6. Set "Execute as" to your Google Account
7. Set "Who has access" to **Anyone**
8. Click **Deploy** and authorize

### API Endpoints

The Google Apps Script provides two main endpoints:

**GET Requests:**
- `?action=getConfig` - Retrieves game configuration
- `?action=getPlayerData&playerId=P001` - Retrieves player data

**POST Requests:**
- `action=logSpin` - Logs a spin result and updates player data

## Part 3: Frontend Setup & Deployment

### Local Development

1. **Install Dependencies**
   ```bash
   cd cyber-slot-machine
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

4. **Test Login**
   Enter a Player ID (e.g., P001, P002, P003) to login and start playing

### Production Deployment

The frontend is already set up for deployment on Manus. To deploy:

1. **Create a Checkpoint**
   ```bash
   # This saves your current project state
   ```

2. **Publish**
   - Click the **Publish** button in the Manus Management UI
   - Your site will be available at `https://cyber-slot-machine.manus.space`

## Game Mechanics

### Symbols
The slot machine uses 8 different symbols:
- **7** - Highest value (Jackpot on 3x)
- **💎** - Diamond (High value)
- **🍒** - Cherry (Medium value)
- **🔔** - Bell (Medium value)
- **🍋** - Lemon (Low value)
- **🍉** - Watermelon (Low value)
- **👑** - Crown (Low value)
- **💰** - Money (Low value)

### Winning Combinations

| Combination | Multiplier | Payout Type |
|------------|-----------|------------|
| 3x 7 (any line) | 500x bet | JACKPOT! |
| 3x 💎 (any line) | 100x bet | Big Win |
| 3x Any Symbol (any line) | 10x bet | Small Win |
| No match | 0x bet | Loss |

### Paylines

The game checks for winning combinations on:
- **3 Horizontal Lines** (rows)
- **3 Vertical Lines** (columns)
- **2 Diagonal Lines** (top-left to bottom-right, top-right to bottom-left)

Total: 8 possible winning lines per spin

## UI Features

### Login Screen
- Enter Player ID to authenticate
- Fetches player data from Google Sheets
- Shows welcome message with username

### Game Screen
- **Reel Display**: 3x3 grid with neon cyan borders
- **Bet Controls**: Increase/decrease bet amount
- **Spin Button**: Initiates the spin animation
- **Credits Display**: Shows current available credits
- **Player Stats Sidebar**: Displays stats and win rate
- **Payout Info**: Shows payout multipliers for reference

### Visual Design
- **Color Scheme**: Neon cyan (#00f0ff), hot pink (#ff006e), electric lime (#39ff14) on deep black (#0a0e27)
- **Fonts**: Orbitron (display), Space Mono (labels), Inter (body)
- **Effects**: Neon glow text, glowing borders, smooth animations
- **Theme**: Cyberpunk arcade aesthetic inspired by 1980s-90s arcade cabinets

## Troubleshooting

### "Player not found" Error
- Ensure the Player ID exists in the `Player_Data` sheet
- Check that the sheet has the correct column headers
- Verify the Google Apps Script URL is correct

### Spins Not Logging
- Check that the Google Apps Script has "Who has access" set to "Anyone"
- Verify the API URL in the frontend code matches your deployed script
- Check browser console for CORS errors

### Game Configuration Not Updating
- Ensure changes are made in the `Game_Config` sheet
- Refresh the browser to reload the configuration
- Check that the values are in the correct format (numbers for bets, TRUE/FALSE for maintenance)

### Slow Performance
- Check your internet connection
- Verify Google Sheets is not under heavy load
- Consider caching configuration locally

## Customization

### Changing Bet Amounts
Edit the `Game_Config` sheet:
- Increase `BASE_BET` for higher minimum bets
- Increase `MAX_BET` for higher maximum bets

### Adjusting Jackpot Multiplier
Edit the `Game_Config` sheet:
- Change `JACKPOT_MULTIPLIER` to a different value (e.g., 1000 for 1000x multiplier)

### Adding New Symbols
Edit `client/src/components/SlotMachine.tsx`:
1. Update the `SYMBOLS` array with new emoji or characters
2. Adjust the payout logic in `calculateWin()` function
3. Update the payout table in `client/src/pages/Home.tsx`

### Changing Colors
Edit `client/src/index.css`:
- `--neon-cyan`: Primary color (#00f0ff)
- `--neon-magenta`: Secondary color (#ff006e)
- `--neon-lime`: Tertiary color (#39ff14)
- `--dark-bg`: Background color (#0a0e27)

## API Reference

### Google Apps Script Endpoints

**Get Game Configuration**
```
GET /exec?action=getConfig

Response:
{
  "success": true,
  "config": {
    "BASE_BET": 10,
    "MAX_BET": 500,
    "JACKPOT_MULTIPLIER": 500,
    "SYSTEM_MAINTENANCE": false
  }
}
```

**Get Player Data**
```
GET /exec?action=getPlayerData&playerId=P001

Response:
{
  "success": true,
  "playerData": {
    "Player ID": "P001",
    "Username": "Player1",
    "Current Credits": 1000,
    "Total Spins": 50,
    "Total Wins": 15,
    "Last Active": "2026-06-25"
  }
}
```

**Log Spin Result**
```
POST /exec

Body:
{
  "action": "logSpin",
  "playerId": "P001",
  "betAmount": 10,
  "winAmount": 100,
  "resultMatrix": ["7", "7", "7", "💎", "💎", "💎", "🍒", "🍒", "🍒"],
  "payoutType": "Big Win"
}

Response:
{
  "success": true,
  "message": "Spin logged and player data updated."
}
```

## Security Considerations

⚠️ **Important**: This is a demonstration project. For production use:

1. **Implement Authentication**: Add proper user authentication instead of simple Player ID
2. **Validate Inputs**: Add server-side validation for all inputs
3. **Secure API**: Use OAuth 2.0 or API keys instead of public endpoints
4. **Encrypt Data**: Encrypt sensitive player data in transit and at rest
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Audit Logging**: Log all transactions for compliance

## Support & Feedback

For issues or feature requests:
1. Check the Troubleshooting section above
2. Review the browser console for error messages
3. Verify all Google Sheets columns have correct headers
4. Ensure the Google Apps Script is properly deployed

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-25  
**Theme**: Cyberpunk Arcade  
**Status**: Ready for Play 🎰⚡

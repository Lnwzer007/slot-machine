// Global variables for sheet names
const PLAYER_DATA_SHEET_NAME = 'Player_Data';
const SPIN_HISTORY_SHEET_NAME = 'Spin_History';
const GAME_CONFIG_SHEET_NAME = 'Game_Config';

// Helper function to get a sheet by name
function getSheetByName(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(name);
}

// Helper function to set CORS headers
function setCorsHeaders(response) {
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  return response;
}

// Handle OPTIONS requests for CORS preflight
function doOptions() {
  const response = ContentService.createTextOutput('');
  return setCorsHeaders(response);
}

function doGet(e) {
  const response = ContentService.createTextOutput();
  setCorsHeaders(response);
  response.setMimeType(ContentService.MimeType.JSON);

  try {
    const action = e.parameter.action;

    if (action === 'getConfig') {
      const configSheet = getSheetByName(GAME_CONFIG_SHEET_NAME);
      if (!configSheet) {
        throw new Error('Game_Config sheet not found.');
      }
      const data = configSheet.getDataRange().getValues();
      const config = {};
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] && data[i][1]) { // Ensure key and value exist
          config[data[i][0]] = data[i][1];
        }
      }
      response.setContent(JSON.stringify({ success: true, config: config }));
    } else if (action === 'getPlayerData') {
      const playerId = e.parameter.playerId;
      if (!playerId) {
        throw new Error('Player ID is required.');
      }
      const playerSheet = getSheetByName(PLAYER_DATA_SHEET_NAME);
      if (!playerSheet) {
        throw new Error('Player_Data sheet not found.');
      }
      const data = playerSheet.getDataRange().getValues();
      const headers = data[0];
      let playerData = null;

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === playerId) {
          playerData = {};
          for (let j = 0; j < headers.length; j++) {
            playerData[headers[j]] = data[i][j];
          }
          break;
        }
      }

      if (playerData) {
        response.setContent(JSON.stringify({ success: true, playerData: playerData }));
      } else {
        response.setContent(JSON.stringify({ success: false, message: 'Player not found.' }));
      }
    } else {
      throw new Error('Invalid action for GET request.');
    }
  } catch (error) {
    response.setContent(JSON.stringify({ success: false, message: error.message }));
  }
  return response;
}

function doPost(e) {
  const response = ContentService.createTextOutput();
  setCorsHeaders(response);
  response.setMimeType(ContentService.MimeType.JSON);

  try {
    const requestBody = JSON.parse(e.postData.contents);
    const action = requestBody.action;

    if (action === 'authenticate') {
      const { username, password } = requestBody;
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }
      const playerSheet = getSheetByName(PLAYER_DATA_SHEET_NAME);
      if (!playerSheet) {
        throw new Error('Player_Data sheet not found.');
      }
      const data = playerSheet.getDataRange().getValues();
      const headers = data[0];
      let usernameIndex = -1;
      let passwordIndex = -1;

      for (let j = 0; j < headers.length; j++) {
        if (headers[j] === 'Username') usernameIndex = j;
        if (headers[j] === 'Password') passwordIndex = j;
      }

      for (let i = 1; i < data.length; i++) {
        if (data[i][usernameIndex] === username && data[i][passwordIndex] === password) {
          const playerData = {};
          for (let j = 0; j < headers.length; j++) {
            playerData[headers[j]] = data[i][j];
          }
          response.setContent(JSON.stringify({ success: true, playerData: playerData }));
          return response;
        }
      }
      response.setContent(JSON.stringify({ success: false, message: 'Invalid username or password.' }));
      return response;
    } else if (action === 'logSpin') {
      const { playerId, betAmount, winAmount, resultMatrix, payoutType, timestamp } = requestBody;

      if (!playerId || betAmount === undefined || winAmount === undefined || !resultMatrix || !payoutType) {
        throw new Error('Missing required parameters for logSpin.');
      }

      // Log spin history
      const spinHistorySheet = getSheetByName(SPIN_HISTORY_SHEET_NAME);
      if (!spinHistorySheet) {
        throw new Error('Spin_History sheet not found.');
      }
      spinHistorySheet.appendRow([
        new Date(),
        playerId,
        betAmount,
        winAmount,
        JSON.stringify(resultMatrix),
        payoutType
      ]);

      // Update player data
      const playerSheet = getSheetByName(PLAYER_DATA_SHEET_NAME);
      if (!playerSheet) {
        throw new Error('Player_Data sheet not found.');
      }
      const data = playerSheet.getDataRange().getValues();
      const headers = data[0];
      let playerRowIndex = -1;
      let currentCreditsIndex = -1;
      let totalSpinsIndex = -1;
      let totalWinsIndex = -1;

      for (let j = 0; j < headers.length; j++) {
        if (headers[j] === 'Current Credits') currentCreditsIndex = j;
        if (headers[j] === 'Total Spins') totalSpinsIndex = j;
        if (headers[j] === 'Total Wins') totalWinsIndex = j;
      }

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === playerId) {
          playerRowIndex = i;
          break;
        }
      }

      if (playerRowIndex !== -1) {
        const row = playerSheet.getRange(playerRowIndex + 1, 1, 1, headers.length);
        const rowValues = row.getValues()[0];

        // Update credits
        if (currentCreditsIndex !== -1) {
          rowValues[currentCreditsIndex] = parseFloat(rowValues[currentCreditsIndex]) - betAmount + winAmount;
        }
        // Update total spins
        if (totalSpinsIndex !== -1) {
          rowValues[totalSpinsIndex] = parseInt(rowValues[totalSpinsIndex]) + 1;
        }
        // Update total wins
        if (totalWinsIndex !== -1 && winAmount > 0) {
          rowValues[totalWinsIndex] = parseInt(rowValues[totalWinsIndex]) + 1;
        }
        // Update Last Active
        const lastActiveIndex = headers.indexOf('Last Active');
        if (lastActiveIndex !== -1) {
          rowValues[lastActiveIndex] = new Date();
        }

        row.setValues([rowValues]);
        response.setContent(JSON.stringify({ success: true, message: 'Spin logged and player data updated.' }));
      } else {
        response.setContent(JSON.stringify({ success: false, message: 'Player not found for update.' }));
      }
    } else {
      throw new Error('Invalid action for POST request.');
    }
  } catch (error) {
    response.setContent(JSON.stringify({ success: false, message: error.message }));
  }
  return response;
}

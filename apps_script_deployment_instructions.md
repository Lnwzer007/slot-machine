# Google Apps Script Deployment Instructions

This document provides step-by-step instructions to deploy the provided Google Apps Script code and obtain the Web App URL, which will be used by the frontend application.

## Prerequisites

1.  A Google Account.
2.  A Google Sheet with the following three tabs (sheet names are case-sensitive):
    *   `Player_Data`
    *   `Spin_History`
    *   `Game_Config`

    Ensure the first row of each sheet contains the exact headers as specified in the original prompt:

    **Player_Data:**
    `Player ID`, `Username`, `Current Credits`, `Total Spins`, `Total Wins`, `Last Active`

    **Spin_History:**
    `Timestamp`, `Player ID`, `Bet Amount`, `Win Amount`, `Result Matrix (3x3)`, `Payout Type`

    **Game_Config:**
    `BASE_BET`, `MAX_BET`, `JACKPOT_MULTIPLIER`, `SYSTEM_MAINTENANCE`

    You can pre-fill `Game_Config` with initial values, for example:
    | BASE_BET | 10 |
    | MAX_BET | 500 |
    | JACKPOT_MULTIPLIER | 500 |
    | SYSTEM_MAINTENANCE | FALSE |

## Deployment Steps

1.  **Open Google Apps Script Editor:**
    *   Open your Google Sheet.
    *   Go to `Extensions > Apps Script`.

2.  **Paste the Code:**
    *   In the Apps Script editor, you will see a file named `Code.gs` (or similar).
    *   Delete any existing code in `Code.gs`.
    *   Copy the entire content of the `apps_script_backend.gs` file I provided and paste it into `Code.gs`.

3.  **Save the Project:**
    *   Click the floppy disk icon (Save project) or go to `File > Save`.
    *   You can rename the project (e.g., "Cyber Slot Machine API") if you wish.

4.  **Deploy as Web App:**
    *   Click the `Deploy` button (usually a blue button on the top right) and select `New deployment`.
    *   For "Select type," choose `Web app`.
    *   Configure the deployment settings:
        *   **Description:** (Optional) Enter a description, e.g., "Slot Machine API v1".
        *   **Execute as:** `Me` (your Google Account).
        *   **Who has access:** `Anyone` (this is crucial for the frontend to access it).
    *   Click `Deploy`.

5.  **Authorize the Script:**
    *   The first time you deploy, Google will ask you to authorize the script. Click `Authorize access`.
    *   Select your Google Account.
    *   You will see a warning that "Google hasn't verified this app." This is normal because you just created it. Click `Advanced` and then `Go to [Project Name] (unsafe)`.
    *   Click `Allow` to grant the necessary permissions (to access Google Sheets).

6.  **Copy the Web App URL:**
    *   After successful deployment and authorization, you will see a dialog with the "Web app URL".
    *   **Copy this URL.** This is your `API_URL` that the frontend application will use.
    *   Click `Done`.

## Important Notes

*   If you make any changes to the Apps Script code, you must create a `New deployment` (or `Manage deployments` and then `Edit` an existing one, making sure to select `New version`) to apply the changes. Always ensure the "Who has access" setting remains `Anyone`.
*   Keep your Google Sheet and Apps Script project secure. While the API is public, sensitive data should not be stored directly in the sheet without proper considerations for access control.

Once you have your Web App URL, you can provide it to me, and I will integrate it into the frontend application.

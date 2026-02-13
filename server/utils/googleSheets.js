const { google } = require('googleapis');

// Configure Google Sheets API
const getSheetsService = () => {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!credentials.client_email || !credentials.private_key) {
    console.warn('Google Sheets credentials missing. Skipping integration.');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const appendToSheet = async (data) => {
  const service = getSheetsService();
  if (!service) return;

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEET_ID missing. Skipping integration.');
    return;
  }

  try {
    await service.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:J', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    });
    console.log('Data appended to Google Sheet successfully.');
  } catch (error) {
    console.error('Error appending to Google Sheet:', error.message);
  }
};

module.exports = { appendToSheet };

import { google } from 'googleapis';

export class GoogleSheetsService {
  async getContactsFromSheet(): Promise<any[]> {
    const sheets = google.sheets('v4');
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    const spreadsheetId = 'google-sheet-id';
    const range = 'Sheet1!A2:E';

    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    return response.data.values.map(row => ({
      companyName: row[0],
      fullName: row[1],
      email: row[2],
      phone: row[3],
      website: row[4],
    }));
  }
}

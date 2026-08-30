/**
 * Kneaded Therapy — order intake backend.
 *
 * What this does:
 *  1. Receives order form submissions from order.html on your website.
 *  2. Logs every order as a new row in this spreadsheet (tab "Orders").
 *  3. Emails you the order details.
 *
 * SETUP — see README.md for the full step-by-step, short version below:
 *  1. Create a new Google Sheet.
 *  2. Extensions > Apps Script. Delete any placeholder code, paste this whole file in.
 *  3. Change YOUR_EMAIL_HERE below to your real email if it isn't already right.
 *  4. Deploy > New deployment > type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  5. Click Deploy, authorize the permissions Google asks for.
 *  6. Copy the "Web app URL" it gives you (ends in /exec).
 *  7. Paste that URL into order.html, replacing PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 *     in the <form action="..."> line.
 *
 * Whenever you edit this script after the first deploy, you must create a
 * "New deployment" again (or use Manage deployments > Edit > new version)
 * for the changes to actually go live.
 */

var NOTIFY_EMAIL = 'rishikasalarpuria@gmail.com';
var SHEET_NAME = 'Orders';

function doPost(e) {
  var sheet = getOrdersSheet_();
  var p = (e && e.parameter) ? e.parameter : {};

  var row = [
    new Date(),
    p['Name'] || '',
    p['Phone'] || '',
    p['email'] || '',
    p['Order Summary'] || '',
    p['Delivery Address'] || '',
    p['Landmark'] || '',
    p['Pincode'] || '',
    p['Special Instructions'] || ''
  ];
  sheet.appendRow(row);

  var subject = 'New Kneaded Therapy Order — ' + (p['Name'] || 'Unknown');
  var body =
    'New order received on the website!\n\n' +
    'Name: ' + (p['Name'] || '') + '\n' +
    'Phone: ' + (p['Phone'] || '') + '\n' +
    'Email: ' + (p['email'] || '') + '\n\n' +
    'Order: ' + (p['Order Summary'] || '') + '\n\n' +
    'Delivery Address: ' + (p['Delivery Address'] || '') + '\n' +
    'Landmark: ' + (p['Landmark'] || '') + '\n' +
    'Pincode: ' + (p['Pincode'] || '') + '\n\n' +
    'Special Instructions: ' + (p['Special Instructions'] || '(none)') + '\n\n' +
    '— Reminder: this order was placed for Hyderabad delivery, next morning.';

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrdersSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Email', 'Order Summary',
      'Delivery Address', 'Landmark', 'Pincode', 'Special Instructions'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

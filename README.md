# Invoice sender

Script for sending invoices with QR code to customers via email HTML template. 

## Deployment

1. edit array named `mailList` in sendmail.js
2. run `./deploy.sh`
3. trigger the function

## Developer notes

Mail template comes from https://unlayer.com/

*Optional refactoring needed, for example:*
- getMonthCZ() and getMonthEN() functions could be replaced using npm dateformat package.
- Deployment could (and should) be done once and then the customer data for invoicing sent when triggering the function.
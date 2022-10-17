const nodemailer = require("nodemailer");
const QRCode = require('qrcode')
const fs = require('fs');


function getThisMonthCZ() {
    const d = new Date();
    const thisMonth = d.getMonth() + 1;

    switch (thisMonth) {
        case 1:
            return "Leden"
        case 2:
            return "Únor"
        case 3:
            return "Březen"
        case 4:
            return "Duben"
        case 5:
            return "Květen"
        case 6:
            return "Červen"
        case 7:
            return "Červenec"
        case 8:
            return "Srpen"
        case 9:
            return "Září"
        case 10:
            return "Říjen"
        case 11:
            return "Listopad"
        case 12:
            return "Prosinec"
    }
}


function getThisMonthEN() {
    const d = new Date();
    const thisMonth = d.getMonth() + 1;

    switch (thisMonth) {
        case 1:
            return "January"
        case 2:
            return "February"
        case 3:
            return "March"
        case 4:
            return "April"
        case 5:
            return "May"
        case 6:
            return "June"
        case 7:
            return "July"
        case 8:
            return "August"
        case 9:
            return "September"
        case 10:
            return "October"
        case 11:
            return "November"
        case 12:
            return "December"
    }
}


function getTodayDate(){
    const d = new Date();
    const thisMonth = d.getMonth() + 1;
    const thisYear = d.getFullYear()
    const thisDay = d.getDate()
    return `${thisDay}.${thisMonth}.${thisYear}`

}

function getDueToDate(){
    const d = new Date();
    const thisMonth = d.getMonth() + 1;
    const thisYear = d.getFullYear()
    return `15.${thisMonth}.${thisYear}`
}


async function sendmail(userEmail, varSymbol, english) {

    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_HOST = process.env.EMAIL_HOST;

    const amount = process.env.AMOUNT;
    const iban = process.env.IBAN;

    const QR = await QRCode.toDataURL(`SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*X-VS:${varSymbol}*`,{ errorCorrectionLevel: 'H' })
    const todayDate = getTodayDate();

    const dueToDate = getDueToDate();

    const thisMonthString = (!english) ? getThisMonthCZ() : getThisMonthEN();
    const language = (!english) ? 'CZ' : 'EN';

    const template = fs.readFileSync(`./${language}mailTemplate.html`,{encoding:'utf-8'});
    template.toString();
    const newTemplate = template.replace('{{varSymbol}}', varSymbol).replace('{{todayDate}}', todayDate).replace('{{dueToDate}}', dueToDate)


    let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: 587, //465 or 587
        secure: false, // true for 465, false for other ports
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: '"Name Surname" <name.surnme@domain.com>',
        to: userEmail,
        bcc: "copy@domain.com",
        subject: `Invoice - ${thisMonthString}`,
        html: newTemplate,
        attachments: [
            {
                filename: 'logo.jpg',
                path: "logo.jpg",
                cid: 'logo'
            },
            {
                filename: 'QRcode.png',
                path: QR,
                cid: 'QR'
            }
        ]
    });
    console.log(`Mail sent to ${userEmail} with variable symbol ${varSymbol} in ${language} language.`);
}

exports.main = async () => {

    // mailList is an array of arrays in format [email, variable symbol, boolean for english invoice]
    const mailList = [
        ["customer1@mail.com", "51539931", "0"],
        ["customer2@mail.com", "51539931", "0"],
    ]

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let member;
    for (member of mailList) {
        let mail = member[0]
        let symbol = parseInt(member[1])
        let english = parseInt(member[2])
        await sendmail(mail, symbol, english).catch(console.error);
        await delay(2000);
    }
};

const transporter = require("../config/mail");

const sendEmail = async ({

    to,

    subject,

    html

}) => {

    await transporter.sendMail({

        from: `"Gloss Pharma ERP" <${process.env.SMTP_EMAIL}>`,

        to,

        subject,

        html

    });

};

module.exports = {
    sendEmail
};
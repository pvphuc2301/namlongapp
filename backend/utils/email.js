const nodemailer = require('nodemailer');
const templates = require('./emailTemplate');
// const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Namlong <${process.env.EMAIL_FROM}>`;
    }

    createTransport() {
        // if (process.env.NODE_ENV === 'production') {
        //     return 1;
        // }
        // using gmail
        // create reusable transporter object using the default SMTP transport
        return nodemailer.createTransport({
            service: 'gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(html, subject) {
        // 1) Render HTML based on a pug template

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            // text: htmlToText.fromString(html)
        };

        // 3) Create a transport and send email
        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        const html = templates['welcome'](this.firstName);
        await this.send(html, 'Welcome to Nam Long Group!');
    }

    async sendPasswordReset() {
        const html = templates['passwordReset'](this.firstName, this.url);
        await this.send(html, 'Your password reset token (valid for only 10 minutes)');
    }
}
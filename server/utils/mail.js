const nodemailer = require("nodemailer");

const email = process.env.GMAIL_EMAIL;
const secret = process.env.GMAIL_SECRET;

// Configure gmail account to send emails
const transport = nodemailer.createTransport({
  service: "Gmail",

  type: "SMTP",
  host: "smtp.gmail.com",

  auth: {
    user: email,
    pass: secret,
  },
});
const sendEmail = (email, subject, body) => {
  transport
    .sendMail({
      from: email,
      to: email,
      subject: subject,
      html: body,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};

exports.sendEmail = sendEmail;

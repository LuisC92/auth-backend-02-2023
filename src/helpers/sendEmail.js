const mailer = require("./mailer");
require("dotenv").config();

const { passwordReset } = require("./emailTemplate");

const sendEmail = (receiver, subject, temporaryPassword) => {
  const result = passwordReset(receiver, temporaryPassword);

  const config = {
    from: process.env.SMTP_USER,
    to: "lc.sbg.92@gmail.com",
    subject: subject,
    text: result,
    // html: '<p>Hello <em>world</em></p>',
  };

  mailer
    .sendMail(config)
    .then((info) => {
      console.log(info);
      return info;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

module.exports = {
  sendEmail,
};

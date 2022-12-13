const nodemailer = require("nodemailer");
const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER;
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;
const EMAIL_HOST_PORT = process.env.EMAIL_HOST_PORT;
const { getTemplate } = require("../templates/emailVerificationLink.template");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: EMAIL_HOST_PORT,
  secure: true,
  service: "gmail",
  greetingTimeout: 1000 * 20,
  auth: {
    user: EMAIL_HOST_USER, // generated ethereal user
    pass: EMAIL_HOST_PASSWORD, // generated ethereal password
  },
});

const sendVerificationEmail = async (email, token) => {
  console.log(email, token);
  try {
    const info = await transporter.sendMail({
      from: "Rishikesh Shinde",
      to: email,
      subject: "Verify Yourself",
      text: "Verify your email",
      html: getTemplate(
        `http://localhost:3000/api/v1/auth/verify-email/${token}`
      ),
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    if (info.messageId) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { sendVerificationEmail };

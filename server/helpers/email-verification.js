const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationLink, isResetPass) => {
  const msg = isResetPass
    ? "Please Click this link to change your password"
    : "Please verify your account by clicking the link";
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "aldomarcelino01@gmail.com",
      pass: "yxggckyogmpwldgn",
    },
  });

  const mailOptions = {
    from: "user_portal@mailinator.com",
    to: email,
    subject: "Account Verification",
    text: `${msg}: ${verificationLink}`,
    html: `<p>${msg}: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

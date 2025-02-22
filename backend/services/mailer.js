const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.  sendVerifyEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: ` <a href="http://localhost:3000/users/verify-email?token=${token}">Xác nhận tại đây :3</a>`,
  };

  await transporter.sendMail(mailOptions);
};

exports.  sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.  sendNewPassword = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: ` mat khau moi cua ban la :${otp}`,
  };

  await transporter.sendMail(mailOptions);
};


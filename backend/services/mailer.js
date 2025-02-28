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

exports.sendOrderConfirmation = async (email, orderDetails) => {
  try {
      const { orderId, totalAmount, items } = orderDetails;
      const itemList = items.map(item => `<li>${item.name} - ${item.quantity} x ${item.price} VND</li>`).join('');
      
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Xác nhận đơn hàng",
          html: `
              <h2>Đơn hàng của bạn đã được xác nhận!</h2>
              <p>Mã đơn hàng: <strong>#${orderId}</strong></p>
              <ul>${itemList}</ul>
              <p><strong>Tổng tiền:</strong> ${totalAmount} VND</p>
              <p>Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!</p>
          `,
      };

      console.log("📤 Đang gửi email...", mailOptions);
      await transporter.sendMail(mailOptions);
      console.log("✅ Email xác nhận đã gửi!");
  } catch (error) {
      console.error("❌ Lỗi gửi email:", error);
  }
};


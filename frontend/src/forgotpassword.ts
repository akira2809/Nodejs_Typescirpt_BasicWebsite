const BASE_URL = 'http://127.0.0.1:3000';

document.addEventListener('DOMContentLoaded', () => {
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', handleForgotPassword);
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', handleOTPVerification);
    }
});

const handleForgotPassword = async (event: Event) => {
    event.preventDefault();
    const email = getInputValue('email');

    if (!validateEmail(email)) {
        alert('Email không hợp lệ.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('resetToken', result.token);
            showOTPForm();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Lỗi gửi OTP:', error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
};

const handleOTPVerification = async () => {
    const code = getInputValue('otp');

    if (!code) {
        alert("Vui lòng nhập mã OTP.");
        return;
    }

    try {
        const token = localStorage.getItem('resetToken');
        if (!token) {
            alert("Token không tồn tại. Vui lòng thử lại.");
            return;
        }

        const response = await fetch(`${BASE_URL}/users/checkcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, code }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Mã OTP chính xác! Một mật khẩu mới đã được gửi về email của bạn.");
            localStorage.removeItem('resetToken'); // Xóa token sau khi xác nhận thành công
            window.location.href = "login.html"; // Chuyển hướng sau khi nhận mật khẩu mới
        } else {
            alert(result.message || "Mã OTP không chính xác.");
        }
    } catch (error) {
        console.error("Lỗi xác thực OTP:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
};

const getInputValue = (id: string): string => {
    const element = document.getElementById(id) as HTMLInputElement;
    return element ? element.value.trim() : '';
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showOTPForm = () => {
    document.getElementById('otpInputBox')!.style.display = 'block';
    document.getElementById('verifyOtpBtn')!.style.display = 'block';
    document.getElementById('sendOtpBtn')!.style.display = 'none';
};




// const BASE_URL = 'http://127.0.0.1:3000';

// document.addEventListener('DOMContentLoaded', () => {
//     const sendOtpBtn = document.getElementById('sendOtpBtn');
//     const verifyOtpBtn = document.getElementById('verifyOtpBtn');
//     const resetPasswordBtn = document.getElementById('resetPasswordBtn');

//     if (sendOtpBtn) {
//         sendOtpBtn.addEventListener('click', handleForgotPassword);
//     }

//     if (verifyOtpBtn) {
//         verifyOtpBtn.addEventListener('click', handleOTPVerification);
//     }

//     if (resetPasswordBtn) {
//         resetPasswordBtn.addEventListener('click', handleResetPassword);
//     }
// });

// const handleForgotPassword = async (event: Event) => {
//     event.preventDefault();
//     const email = getInputValue('email');

//     if (!validateEmail(email)) {
//         alert('Email không hợp lệ.');
//         return;
//     }

//     try {
//         const response = await fetch(`${BASE_URL}/users/forgot-password`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email }),
//         });

//         const result = await response.json();
//         if (response.ok) {
//             localStorage.setItem('resetToken', result.token);
//             showOTPForm();
//         } else {
//             alert(result.message);
//         }
//     } catch (error) {
//         console.error('Lỗi gửi OTP:', error);
//         alert("Có lỗi xảy ra. Vui lòng thử lại.");
//     }
// };

// const handleOTPVerification = async () => {
//     const code = getInputValue('otp');

//     if (!code) {
//         alert("Vui lòng nhập mã OTP.");
//         return;
//     }

//     try {
//         const token = localStorage.getItem('resetToken');
//         if (!token) {
//             alert("Token không tồn tại. Vui lòng thử lại.");
//             return;
//         }

//         const response = await fetch(`${BASE_URL}/users/checkcode`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ token, code }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert("Mã OTP chính xác! Nhập mật khẩu mới.");
//             showResetPasswordForm();
//         } else {
//             alert(result.message || "Mã OTP không chính xác.");
//         }
//     } catch (error) {
//         console.error("Lỗi xác thực OTP:", error);
//         alert("Có lỗi xảy ra. Vui lòng thử lại.");
//     }
// };

// const handleResetPassword = async () => {
//     const newPassword = getInputValue('newPassword');
//     const confirmNewPassword = getInputValue('confirmNewPassword');

//     if (!newPassword || !confirmNewPassword) {
//         alert("Vui lòng nhập đầy đủ mật khẩu.");
//         return;
//     }

//     if (newPassword !== confirmNewPassword) {
//         alert("Mật khẩu nhập lại không khớp.");
//         return;
//     }

//     try {
//         const token = localStorage.getItem('resetToken');
//         if (!token) {
//             alert("Token không tồn tại. Vui lòng thử lại.");
//             return;
//         }

//         const response = await fetch(`${BASE_URL}/users/reset-password`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ token, newPassword }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert("Mật khẩu đã được thay đổi thành công!");
//             localStorage.removeItem('resetToken');
//             window.location.href = "/login.html";
//         } else {
//             alert(result.message || "Đổi mật khẩu thất bại.");
//         }
//     } catch (error) {
//         console.error("Lỗi đổi mật khẩu:", error);
//         alert("Có lỗi xảy ra. Vui lòng thử lại.");
//     }
// };

// const getInputValue = (id: string): string => {
//     const element = document.getElementById(id) as HTMLInputElement;
//     return element ? element.value.trim() : '';
// };

// const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// };

// const showOTPForm = () => {
//     document.getElementById('otpInputBox')!.style.display = 'block';
//     document.getElementById('verifyOtpBtn')!.style.display = 'block';
//     document.getElementById('sendOtpBtn')!.style.display = 'none';
// };

// const showResetPasswordForm = () => {
//     document.getElementById('newPasswordBox')!.style.display = 'block';
//     document.getElementById('confirmNewPasswordBox')!.style.display = 'block';
//     document.getElementById('resetPasswordBtn')!.style.display = 'block';
// };

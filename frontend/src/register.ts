import { UserResponse } from './types';

const BASE_URL = 'http://127.0.0.1:3000';

// Kiểm tra email có tồn tại trong database không
const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users/check?email=${email}`);
    const users = await response.json();
    console.log(users);
    if(users.user.length === 0){
      return false; 
    }
    return users; // Nếu có user trùng email, trả về true
  } catch (error) {
    console.error('Lỗi kiểm tra email:', error);
    return false;
  }
};


// Gửi yêu cầu đăng ký
const registerUser = async (userData: Omit<UserResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error(`Lỗi đăng ký: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    throw error;
  }
};

// Xử lý sự kiện khi nhấn nút đăng ký
document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn") as HTMLButtonElement;
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await validateForm();
  });
});

const validateForm = async () => {
  const fullName = getInputValue("fullName");
  const email = getInputValue("email");
  const password = getInputValue("password");
  const confirmPassword = getInputValue("confirmPassword");

  let isValid = true;

  isValid = validateField("fullName", fullName.length >= 3, "Full Name must be at least 3 characters long.") && isValid;
  isValid = validateField("email", validateEmail(email), "Invalid email format.") && isValid;
  isValid = validateField("password", validatePassword(password), "Password must be 8+ characters with a number and special character.") && isValid;
  isValid = validateField("confirmPassword", password === confirmPassword, "Passwords do not match.") && isValid;

  if (isValid) {
    const emailExists = await checkEmailExists(email);
    console.log(emailExists);
    if (emailExists) {
      validateField("email", false, "Email is already in use.");
      return;
    }

    await registerUser({ username: fullName, email, password, status: "active" });
    showSuccessMessage();
  }
};

const validateField = (id: string, condition: boolean, errorMessage: string): boolean => {
  const input = document.getElementById(id) as HTMLInputElement;
  let errorElement = document.getElementById(`${id}-error`);

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = `${id}-error`;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "0.9em";
    errorElement.style.marginTop = "5px";
    input.parentNode?.appendChild(errorElement);
  }

  if (!condition) {
    errorElement.textContent = errorMessage;
    input.style.border = "2px solid red";
    return false;
  } else {
    errorElement.textContent = "";
    input.style.border = "2px solid green";
    return true;
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

const getInputValue = (id: string): string => {
  return (document.getElementById(id) as HTMLInputElement).value.trim();
};

const showSuccessMessage = () => {
  const form = document.querySelector(".container-form") as HTMLDivElement;
  form.innerHTML = `<div style='color: green; font-size: 1.2em; text-align: center;'>🎉 Registration Successful! Welcome!</div>`;
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
};

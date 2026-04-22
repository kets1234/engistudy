const EMAILJS_PUBLIC_KEY = "WbGc32kxsy0sXIJ3e";
const EMAILJS_SERVICE_ID = "service_5n9ckkt";
const EMAILJS_TEMPLATE_ID = "template_0qftjbc";

let generatedVerificationCode = "";
let verifiedEmailAddress = "";
let isSending = false;

window.addEventListener("DOMContentLoaded", function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

  if (localStorage.getItem("loggedInEngineeringUser")) {
    loadDashboard();
  }
});

function showTab(tabId, buttonElement) {
  const tabs = document.querySelectorAll(".form-section");
  const buttons = document.querySelectorAll(".tab-btn");

  tabs.forEach((tab) => tab.classList.remove("active"));
  buttons.forEach((button) => button.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  buttonElement.classList.add("active");

  clearMessages();
}

function clearMessages() {
  const messages = document.querySelectorAll(".message");
  messages.forEach((msg) => {
    msg.className = "message";
    msg.style.display = "none";
    msg.textContent = "";
  });
}

function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = "message " + type;
  el.style.display = "block";
}

function getUsers() {
  return JSON.parse(localStorage.getItem("engineeringUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("engineeringUsers", JSON.stringify(users));
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode() {
  if (isSending) return;

  clearMessages();

  const email = document.getElementById("regEmail").value.trim().toLowerCase();

  if (!email) {
    showMessage("registerMessage", "Please enter your email first.", "error");
    return;
  }

  if (typeof emailjs === "undefined") {
    showMessage("registerMessage", "EmailJS not loaded.", "error");
    return;
  }

  generatedVerificationCode = generateCode();
  verifiedEmailAddress = email;
  isSending = true;

  const btn = document.querySelector(".send-code-btn");
  if (btn) {
    btn.textContent = "Sending...";
    btn.disabled = true;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email,
      verification_code: generatedVerificationCode,
      app_name: "EngiStudy Portal",
    });

    showMessage(
      "registerMessage",
      "Verification code sent! Check your email.",
      "success",
    );
  } catch (error) {
    console.error("EmailJS ERROR DETAILS:", error);

    showMessage(
      "registerMessage",
      "Failed to send code. Open browser console (F12) to see the exact EmailJS error.",
      "error",
    );
  }

  setTimeout(() => {
    if (btn) {
      btn.textContent = "Send Code";
      btn.disabled = false;
    }
    isSending = false;
  }, 3000);
}

function registerUser() {
  clearMessages();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const enteredCode = document.getElementById("verificationCode").value.trim();
  const course = document.getElementById("regCourse").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (
    !name ||
    !email ||
    !enteredCode ||
    !course ||
    !password ||
    !confirmPassword
  ) {
    showMessage("registerMessage", "Please fill all fields.", "error");
    return;
  }

  if (!generatedVerificationCode) {
    showMessage("registerMessage", "Click 'Send Code' first.", "error");
    return;
  }

  if (email !== verifiedEmailAddress) {
    showMessage("registerMessage", "Email changed. Send code again.", "error");
    return;
  }

  if (enteredCode !== generatedVerificationCode) {
    showMessage("registerMessage", "Invalid verification code.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(
      "registerMessage",
      "Password must be at least 6 characters.",
      "error",
    );
    return;
  }

  if (password !== confirmPassword) {
    showMessage("registerMessage", "Passwords do not match.", "error");
    return;
  }

  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    showMessage("registerMessage", "Email already registered.", "error");
    return;
  }

  users.push({ name, email, course, password, verified: true });
  saveUsers(users);

  showMessage("registerMessage", "Registration successful!", "success");

  document.getElementById("regName").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("verificationCode").value = "";
  document.getElementById("regCourse").value = "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regConfirmPassword").value = "";

  generatedVerificationCode = "";
  verifiedEmailAddress = "";
}

function loginUser() {
  clearMessages();

  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showMessage("loginMessage", "Enter email and password.", "error");
    return;
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    showMessage("loginMessage", "Invalid login.", "error");
    return;
  }

  localStorage.setItem("loggedInEngineeringUser", JSON.stringify(user));
  loadDashboard();
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInEngineeringUser"));
  if (!user) return;

  document.body.classList.add("dashboard-mode");

  document.getElementById("authArea").style.display = "none";
  document.getElementById("dashboard").classList.add("active");

  const welcomeText = document.getElementById("welcomeText");
  const studentInfo = document.getElementById("studentInfo");
  const verifiedStatus = document.getElementById("verifiedStatus");
  const studentCourseText = document.getElementById("studentCourseText");

  if (welcomeText) {
    welcomeText.textContent = `Welcome, ${user.name}!`;
  }

  if (studentInfo) {
    studentInfo.textContent = `You are enrolled as a ${user.course} student. Access your study dashboard below.`;
  }

  if (verifiedStatus) {
    verifiedStatus.textContent = user.verified ? "Verified" : "Pending";
  }

  if (studentCourseText) {
    studentCourseText.textContent = user.course || "---";
  }
}

function logoutUser() {
  localStorage.removeItem("loggedInEngineeringUser");

  document.body.classList.remove("dashboard-mode");

  document.getElementById("dashboard").classList.remove("active");
  document.getElementById("authArea").style.display = "block";

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";

  clearMessages();

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((button) => button.classList.remove("active"));

  if (buttons[0]) {
    buttons[0].classList.add("active");
  }

  document.getElementById("register").classList.remove("active");
  document.getElementById("login").classList.add("active");
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

function showMessage(text, type) {
  const el = document.getElementById("resetMessage");
  el.textContent = text;
  el.className = "message " + type;
  el.style.display = "block";
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

function resetPassword() {
  const token = getTokenFromUrl();
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  if (!token) {
    showMessage("Invalid or missing reset token.", "error");
    return;
  }

  if (!newPassword || !confirmNewPassword) {
    showMessage("Please fill in both password fields.", "error");
    return;
  }

  if (newPassword.length < 6) {
    showMessage("Password must be at least 6 characters long.", "error");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  const resetRequests =
    JSON.parse(localStorage.getItem("engineeringPasswordResets")) || {};
  const request = resetRequests[token];

  if (!request) {
    showMessage("This reset link is invalid.", "error");
    return;
  }

  if (Date.now() > request.expiresAt) {
    delete resetRequests[token];
    localStorage.setItem(
      "engineeringPasswordResets",
      JSON.stringify(resetRequests),
    );
    showMessage("This reset link has expired.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("engineeringUsers")) || [];
  const userIndex = users.findIndex((u) => u.email === request.email);

  if (userIndex === -1) {
    showMessage("User account not found.", "error");
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem("engineeringUsers", JSON.stringify(users));

  delete resetRequests[token];
  localStorage.setItem(
    "engineeringPasswordResets",
    JSON.stringify(resetRequests),
  );

  showMessage(
    "Password updated successfully. You can now go back and sign in.",
    "success",
  );
}

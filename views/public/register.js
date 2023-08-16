function togglePasswordVisibility(eyeIcon) {
    const passwordInput = eyeIcon.previousElementSibling;
    const type = passwordInput.getAttribute("type");
    passwordInput.setAttribute("type", type === "password" ? "text" : "password");
  }
  
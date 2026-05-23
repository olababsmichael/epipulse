  lucide.createIcons();

  const toggleBtn = document.getElementById("toggleBtn");
  const authTitle = document.getElementById("authTitle");
  const authText = document.getElementById("authText");
  const submitBtn = document.getElementById("submitBtn");

  const signupFields = document.querySelectorAll(".signup-only");

  let isSignup = false;

  toggleBtn.addEventListener("click", () => {

    isSignup = !isSignup;

    signupFields.forEach(field => {
      field.classList.toggle("hidden");
    });

    if(isSignup){
      authTitle.textContent = "Create Account";
      authText.textContent =
        "Join the surveillance network and contribute to public health.";

      submitBtn.textContent = "Create Account";

      toggleBtn.textContent =
        "Already have an account? Sign In";
    }else{
      authTitle.textContent = "Portal Access";
      authText.textContent =
        "Verify your credentials to enter the surveillance dashboard.";

      submitBtn.textContent = "Sign In";

      toggleBtn.textContent =
        "Don't have an account? Create one";
    }
  });

  // Role selection
  const roleButtons = document.querySelectorAll(".role-btn");

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });


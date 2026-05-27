// =========================================================================
// 1. YOUR ORIGINAL FRONTEND CODE (CORRECTED & OPTIMIZED)
// =========================================================================

lucide.createIcons();

const toggleBtn = document.getElementById("toggleBtn");
const authTitle = document.getElementById("authTitle");
const authText = document.getElementById("authText");
const submitBtn = document.getElementById("submitBtn");

const signupFields = document.querySelectorAll(".signup-only");

let isSignup = false;

function setAuthMode(signupMode) {
  isSignup = signupMode;

  signupFields.forEach(field => {
    field.classList.toggle("hidden", !signupMode);
  });

  if (isSignup) {
    authTitle.textContent = "Create Account";
    authText.textContent = "Join the surveillance network and contribute to public health.";
    submitBtn.textContent = "Create Account";
    toggleBtn.textContent = "Already have an account? Sign In";
  } else {
    authTitle.textContent = "Portal Access";
    authText.textContent = "Verify your credentials to enter the surveillance dashboard.";
    submitBtn.textContent = "Sign In";
    toggleBtn.textContent = "Don't have an account? Create one";
  }
}

toggleBtn.addEventListener("click", () => {
  setAuthMode(!isSignup);
});

setAuthMode(false);

// Role selection
const roleButtons = document.querySelectorAll(".role-btn");

roleButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // Stop any unintended form submissions
    roleButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

const rootElement = document.documentElement;
let bgTicking = false;

function updateParallaxBackground() {
  const scrollY = window.scrollY || window.pageYOffset;
  const parallaxOffset = Math.round(scrollY * 0.06);
  rootElement.style.setProperty('--bg-parallax-y', `${parallaxOffset}px`);
  bgTicking = false;
}

window.addEventListener('scroll', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!bgTicking) {
    window.requestAnimationFrame(updateParallaxBackground);
    bgTicking = true;
  }
}, { passive: true });


// =========================================================================
// 2. PRODUCTION SUPABASE INTEGRATION ENGINE
// =========================================================================

const SUPABASE_URL = 'https://uaajsijjnmmbavleynry.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYWpzaWpqbm1tYmF2bGV5bnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzQ0NjQsImV4cCI6MjA5NDcxMDQ2NH0.eJwPlcUvMOyw2UME6N-prnD934btdqQNqgB5pWgB4uU';
let supabaseInstance = null;

// Dynamically auto-load Supabase CDN into the document workspace context
(function loadSupabaseLibrary() {
  if (window.supabase) {
    initializeBackendFlow();
    return;
  }
  const scriptNode = document.createElement('script');
  scriptNode.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  scriptNode.async = true;
  scriptNode.onload = () => {
    initializeBackendFlow();
  };
  document.head.appendChild(scriptNode);
})();

function initializeBackendFlow() {
  if (window.supabase && !supabaseInstance) {
    supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  const mainForm = document.getElementById("authForm");
  const successBox = document.getElementById("successBox");

  if (mainForm) {
    mainForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!supabaseInstance) {
        displayStatusMessage("error", "Database engine initialization failure. Check credentials.");
        return;
      }

      // FIX 1: Explicitly targeted element extraction via unique HTML IDs instead of index arrays
      const fullNameValue = document.getElementById("regFullName") ? document.getElementById("regFullName").value.trim() : "";
      const phoneValue = document.getElementById("regPhone") ? document.getElementById("regPhone").value.trim() : "";
      const lgaValue = document.getElementById("regLGA") ? document.getElementById("regLGA").value.trim() : "";
      const emailValue = document.getElementById("authEmail") ? document.getElementById("authEmail").value.trim() : "";
      const passwordValue = document.getElementById("authPassword") ? document.getElementById("authPassword").value : "";

      // FIX 2: Safely extract data attributes directly instead of loose text manipulation
      let assignedRole = "community";
      const currentActiveTab = document.querySelector(".role-btn.active");
      if (currentActiveTab && currentActiveTab.dataset.role) {
        assignedRole = currentActiveTab.dataset.role; // This outputs exactly 'community', 'field_worker', or 'admin'
      }

      // Setup clean submission UI transition states
      const nativeButtonLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = isSignup ? "Creating Profile..." : "Verifying System Access...";

      try {
        if (isSignup) {
          // ------------------ EXECUTING SIGN UP ------------------
          const { data, error } = await supabaseInstance.auth.signUp({
            email: emailValue,
            password: passwordValue,
            options: {
              data: {
                full_name: fullNameValue,
                phone_number: phoneValue,
                assigned_lga: lgaValue,
                role: assignedRole
              }
            }
          });

          if (error) throw error;

          displayStatusMessage("success", "Profile created successfully!");
          mainForm.reset();
          if (isSignup) setAuthMode(false); // Return layout configuration view back to sign-in state

        } else {
          // ------------------ EXECUTING SIGN IN ------------------
          const { data, error } = await supabaseInstance.auth.signInWithPassword({
            email: emailValue,
            password: passwordValue
          });

          if (error) throw error;

          displayStatusMessage("success", "Access credentials verified. Loading user workspace...");

          const verifiedUserRole = data.user?.user_metadata?.role || "community";

          setTimeout(() => {
            if (verifiedUserRole === "admin" || verifiedUserRole === "field_worker") {
              window.location.href = "dashboard.html";
            } else {
              window.location.href = "CommunityHome.html";
            }
          }, 1200);
        }
      } catch (runtimeError) {
        displayStatusMessage("error", runtimeError.message || "Authentication pipeline exception.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignup ? "Create Account" : "Sign In";
      }
    });
  }

  // Functional alert UI renderer panel
  function displayStatusMessage(statusType, contentText) {
    if (!successBox) {
      alert(contentText);
      return;
    }

    successBox.className = `alert ${statusType}`;
    const spanTag = successBox.querySelector("span");
    if (spanTag) spanTag.textContent = contentText;

    const iconTag = successBox.querySelector("i");
    if (iconTag) {
      if (statusType === "error") {
        iconTag.setAttribute("data-lucide", "alert-circle");
        successBox.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        successBox.style.color = "#ef4444";
      } else {
        iconTag.setAttribute("data-lucide", "shield-check");
        successBox.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        successBox.style.color = "#10b981";
      }
      if (window.lucide) window.lucide.createIcons();
    }

    successBox.classList.remove("hidden");
  }
}
// STEP 1: VERIFY OTP
async function verifyOTP() {

  const email = localStorage.getItem("resetEmail");
  const otp = document.getElementById("otp").value;

  const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  const data = await response.json();

  if (!data.success) {
    alert("Invalid OTP");
    return;
  }

  alert("OTP Verified Successfully");

  // clean UI switch
  document.getElementById("otpSection").style.display = "none";
  document.getElementById("passwordSection").style.display = "block";
}


// STEP 2: RESET PASSWORD
async function resetPassword() {

  const email = localStorage.getItem("resetEmail");
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      otp,
      newPassword
    })
  });

  window.location.href = "login.html";

  const data = await response.json();

  alert(data.message);

  if (data.success) {
    localStorage.removeItem("resetEmail");
  }
}
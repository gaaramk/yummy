// DOM Elements
const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");
const userName = document.getElementById("userName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const registerBtn = document.getElementById("registerBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const userNameError = document.getElementById("userNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");
const haveAccount = document.getElementById("haveAccount");
const dontHaveAccount = document.getElementById("dontHaveAccount");
const startPage = document.getElementById("startPage");
const startReg = document.getElementById("startReg");
const startLog = document.getElementById("startLogin");

let Yummyusers = JSON.parse(localStorage.getItem("Yummyusers")) || [];

// Functions
function registerUser(userName, email, password) {
  let user = {
    userName: userName.value,
    email: email.value,
    password: password.value,
  };

  Yummyusers.push(user);

  localStorage.setItem("Yummyusers", JSON.stringify(Yummyusers));

  registerPage.classList.add("d-none");
  loginPage.classList.remove("d-none");
}

function loginUser(email, password) {
  let user = Yummyusers.find((u) => u.email === email.value); // البحث عن المستخدم بالبريد الإلكتروني

  if (user) {
    if (user.password === password.value) {
      alert("You have logged in successfully");

      //   go to index page
      window.location.href = "/home.html";
    } else {
      alert("Password is incorrect");
    }
  } else {
    alert("Email is incorrect");
  }
}

// Event Listeners
startReg.addEventListener("click", () => {
  registerPage.classList.remove("d-none");
  loginPage.classList.add("d-none");
  startPage.classList.add("d-none");
});

startLog.addEventListener("click", () => {
  registerPage.classList.add("d-none");
  loginPage.classList.remove("d-none");
  startPage.classList.add("d-none");
});

registerBtn.addEventListener("click", () => {
  let userNameValidation = validationInputs(userName, userNameError);
  let emailValidation = validationInputs(email, emailError);
  let passwordValidation = validationInputs(password, passwordError);
  let confirmPasswordValidation = validationInputs(
    confirmPassword,
    confirmPasswordError
  );

  if (
    userNameValidation &&
    emailValidation &&
    passwordValidation &&
    confirmPasswordValidation
  ) {
    registerUser(userName, email, password);
    alert("You have registered successfully");
  }
});

loginBtn.addEventListener("click", () => {
  let loginEmailValidation = validationInputs(loginEmail, loginEmailError);
  let loginPasswordValidation = validationInputs(
    loginPassword,
    loginPasswordError
  );

  if (loginEmailValidation && loginPasswordValidation) {
    loginUser(loginEmail, loginPassword);
  }
});

haveAccount.addEventListener("click", () => {
  registerPage.classList.add("d-none");
  loginPage.classList.remove("d-none");
});

dontHaveAccount.addEventListener("click", () => {
  registerPage.classList.remove("d-none");
  loginPage.classList.add("d-none");
});

// Validation
function validationInputs(ele, eleMsg) {
  let text = ele.value;
  let regex = {
    userName: /^[A-Za-z0-9_]{3,16}$/, // اسم المستخدم
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // البريد الإلكتروني
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // كلمة المرور
    confirmPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // تأكيد كلمة المرور
    loginEmail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // بريد تسجيل الدخول
    loginPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // كلمة مرور تسجيل الدخول
  };

  if (regex[ele.id].test(text)) {
    eleMsg.classList.add("d-none");
    return true;
  } else {
    eleMsg.classList.remove("d-none");
    return false;
  }
}

userName.addEventListener("input", () => {
  validationInputs(userName, userNameError);
});

email.addEventListener("input", () => {
  validationInputs(email, emailError);
});

password.addEventListener("input", () => {
  validationInputs(password, passwordError);
});

confirmPassword.addEventListener("input", () => {
  validationInputs(confirmPassword, confirmPasswordError);
});

loginEmail.addEventListener("input", () => {
  validationInputs(loginEmail, loginEmailError);
});

loginPassword.addEventListener("input", () => {
  validationInputs(loginPassword, loginPasswordError);
});
// End

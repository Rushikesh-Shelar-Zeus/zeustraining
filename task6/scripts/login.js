// Event Listener for Form Validation
var loginForm = document.getElementById('login-form');
if (!(loginForm instanceof HTMLFormElement)) {
    throw new Error("Form Not Found or Incorrect Type");
}
loginForm.addEventListener('submit', handleSubmit);
// Event Listener to Toggle Password
var passwordEyeBtn = document.getElementById('eye-button');
if (!passwordEyeBtn) {
    throw new Error("Eye Button Not Found");
}
passwordEyeBtn.addEventListener('click', viewPassword);
function handleSubmit(event) {
    var schools = document.getElementsByName("school");
    var schoolFocus = document.getElementById('district-school');
    var statesSelect = document.getElementById('states');
    var districtSelect = document.getElementById('district');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    if (!(schools.length) ||
        !(schoolFocus instanceof HTMLInputElement) || !(statesSelect instanceof HTMLSelectElement) || !(districtSelect instanceof HTMLSelectElement) || !(usernameInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
        throw new Error("Incorrect Form Elements or Null");
    }
    var schoolInputs = [].slice.call(schools);
    ;
    console.log(schoolInputs);
    if ((!schoolInputs[0].checked && !schoolInputs[1].checked)) {
        event.preventDefault();
        alert("Please select your School Type");
        schoolFocus.focus();
        return;
    }
    if (statesSelect.selectedIndex === 0) {
        event.preventDefault();
        alert("Please select your State");
        statesSelect.focus();
        return;
    }
    if (districtSelect.selectedIndex === 0) {
        event.preventDefault();
        alert("Please select your District");
        districtSelect.focus();
        return;
    }
    if (usernameInput.value.trim() === "") {
        event.preventDefault();
        alert("Username is Required");
        usernameInput.focus();
        return;
    }
    if (passwordInput.value === "") {
        event.preventDefault();
        alert("Password is Required");
        passwordInput.focus();
        return;
    }
}
function viewPassword() {
    var passwordInput = document.getElementById('password');
    if (!(passwordInput instanceof HTMLInputElement)) {
        throw new Error("Wrong Passowrd Input type or Null");
    }
    // Toggle Password Type using Ternary Operator
    (passwordInput.type === 'password') ? passwordInput.type = 'text' : passwordInput.type = 'password';
}

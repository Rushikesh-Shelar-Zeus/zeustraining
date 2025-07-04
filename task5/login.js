// Event Listener for Form Validation
document.getElementById('login-form').addEventListener('submit', handeleSubmit);

// Event Listener to Toggle Password
document.getElementById('eye-button').addEventListener('click', viewPassword);

function handeleSubmit(event) {
    const schools = document.getElementsByName('school');
    const schoolFocus = document.getElementById('district-school');
    const statesSelect = document.getElementById('states');
    const districtSelect = document.getElementById('district');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!schools[0].checked && !schools[1].checked) {
        event.preventDefault();
        alert("Please select your School Type")
        schoolFocus.focus();
        return;
    }

    if (statesSelect.selectedIndex === 0) {
        event.preventDefault();
        alert("Please select your State")
        statesSelect.focus();
        return;
    }

    if (districtSelect.selectedIndex === 0) {
        event.preventDefault();
        alert("Please select your District")
        districtSelect.focus();
        return;
    }

    if (usernameInput.value.trim() === "") {
        event.preventDefault();
        alert("Username is Required")
        usernameInput.focus();
        return;
    }

    if (passwordInput.value === "") {
        event.preventDefault();
        alert("Password is Required")
        passwordInput.focus();
        return;
    }
}


function viewPassword(){
    const passwordInput = document.getElementById('password');

    // Toggle Password Type using Ternary Operator
    (passwordInput.type === 'password') ? passwordInput.type = 'text' : passwordInput.type = 'password';
}
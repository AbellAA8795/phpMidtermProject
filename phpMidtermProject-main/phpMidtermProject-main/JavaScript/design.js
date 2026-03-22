const loginForm = document.getElementById('jsLogin');
const registerForm = document.getElementById('jsRegister');
let error = document.getElementById('jsLoginError')
let email = document.getElementsByClassName('jsDesignEmail');
let password = document.getElementsByClassName('jsDesignPassword');
let userEmail = document.getElementById('jsEmail');
let userPassword = document.getElementById('jsPassword');
let registerName = document.getElementById('jsName')
let registerEmail = document.getElementById('jsRegEmail')
let registerPassword = document.getElementById('jsRegPassword')
let registerConfirmPassword = document.getElementById('jsRegConfirmPassword')
let regpass = document.getElementsByClassName('jsDesPassword')
let regConPass = document.getElementsByClassName('jsDesConPassword')
let errorPassword = document.getElementsByClassName('regErrorPassword');
let errorConformPassword = document.getElementsByClassName('regErrorConfirmPassword');

let isWrong = false;
let isRegWrong = false;
registerForm.style.display="none";

// for login verification

async function verifyInput (event){
    event.preventDefault();

    if (userEmail.value === "" || userPassword.value === ""){
        isWrong = true;
        wrongInput();
        error.innerHTML = '*Fill in the form';
        error.style.color = 'red';
        userEmail.value = "";
        userPassword.value = "";
        return;
    }

    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('email', userEmail.value);
    formData.append('password', userPassword.value);

    try {
        const response = await fetch('../PHP Files/process.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            isWrong = false;
            wrongInput();
            error.innerHTML = '*Login successful!';
            error.style.color = 'green';
            userEmail.value = "";
            userPassword.value = "";
            // You can redirect or perform other actions here
            // window.location.href = 'dashboard.php';
        } else {
            isWrong = true;
            wrongInput();
            error.innerHTML = '*' + data.message;
            error.style.color = 'red';
            userEmail.value = "";
            userPassword.value = "";
        }
    } catch (error) {
        console.error('Error:', error);
        isWrong = true;
        wrongInput();
        error.innerHTML = '*An error occurred during login';
        error.style.color = 'red';
    }

}

// Change input style to red if input is wrong
const wrongInput = () => {
    if(isWrong) {
        
        for (let i = 0; i < email.length; i++) {
            email[i].style.border = "1px solid red";
        }

        for (let i = 0; i < password.length; i++) {
            password[i].style.border = "1px solid red";
        }
    }else{
        for (let i = 0; i < email.length; i++) {
            email[i].style.border = "none";
        }

        for (let i = 0; i < password.length; i++) {
            password[i].style.border = "none";
        }
    }

};

// moving between login and register
const toRegister = (isVisible) => {
    if (isVisible) {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        isWrong = false;
        error.innerHTML = '';
        error.style.color = "black";
        wrongInput();
    }
};

const toLogin = (isVisible) => {
    if(isVisible){
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    }
};

// for register verification

registerName.addEventListener('keydown',function(event){
    if ((/\d/g).test(event.key)) {
      event.preventDefault(); 
    }
});

function passwordConfirmation(event){
    event.preventDefault();

    // First validate passwords match
    if(registerPassword.value !== registerConfirmPassword.value){
        isRegWrong = true;
        for (let i = 0; i < errorPassword.length; i++) {
            errorPassword[i].innerHTML = ' Password not equal';
        }
        for (let i = 0; i < errorConformPassword.length; i++) {
            errorConformPassword[i].innerHTML = ' Password not equal';
        }

        for(let i = 0; i < regpass.length; i++){
            regpass[i].style.border = "1px solid red"
        }
        for(let i = 0; i < regConPass.length; i++){
            regConPass[i].style.border = "1px solid red"
        }
        passwordErrors();
        return;
    }

    isRegWrong = false;
    for (let i = 0; i < errorPassword.length; i++) {
        errorPassword[i].innerHTML = '';
    }
    for (let i = 0; i < errorConformPassword.length; i++) {
        errorConformPassword[i].innerHTML = '';
    }

    for(let i = 0; i < regpass.length; i++){
        regpass[i].style.border = "none"
    }
    for(let i = 0; i < regConPass.length; i++){
        regConPass[i].style.border = "none"
    }

    // Send registration data to process.php
    sendRegistrationData();
}

async function sendRegistrationData() {
    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('name', registerName.value);
    formData.append('email', registerEmail.value);
    formData.append('password', registerPassword.value);
    formData.append('confirmPassword', registerConfirmPassword.value);

    try {
        const response = await fetch('../PHP Files/process.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! You can now login.');
            registerName.value = '';
            registerEmail.value = '';
            registerPassword.value = '';
            registerConfirmPassword.value = '';
            toLogin(true);
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
}

function passwordErrors(){


    if(isRegWrong){
        for(let i = 0; i < errorPassword.length; i++){
            errorPassword[i].style.color = 'red';
        }
        for(let i = 0; i < errorConformPassword.length; i++){
            errorConformPassword[i].style.color = 'red';
        }
    }else{
        for(let i = 0; i < errorPassword.length; i++){
            errorPassword[i].style.color = 'black';
        }
        for(let i = 0; i < errorConformPassword.length; i++){
            errorConformPassword[i].style.color = 'black';
        }
    }
}
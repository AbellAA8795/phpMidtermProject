const loginForm = document.getElementById('jsLogin');
const registerForm = document.getElementById('jsRegister');
let error = document.getElementById('jsLoginError')
let email = document.getElementsByClassName('jsDesignEmail');
let password = document.getElementsByClassName('jsDesignPassword');
let userEmail = document.getElementById('jsEmail');
let userPassword = document.getElementById('jsPassword');

let isWrong = false;

registerForm.style.display="none";

// for login verification

function verifyInput (event){
    event.preventDefault();

    //for testing only 
    const myUsername = 'GabrielRey@gmail.com';
    const myPassword = 'hawakkoangbeat';

    if (userEmail.value === "" || userPassword.value === ""){
        isWrong = true;
        wrongInput();
        error.innerHTML = '*Fill in the form';
        error.style.color = 'red';
        userEmail.value = "";
        userPassword.value = "";
    }else if(userEmail.value !== myUsername || userPassword.value !== myPassword){
        isWrong = true;
        wrongInput();
        error.innerHTML = '*Email or Password is incorrect';
        error.style.color = 'red';
        userEmail.value = "";
        userPassword.value = "";
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
        wrongInput();
    }
};

const toLogin = (isVisible) => {
    if(isVisible){
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    }
};
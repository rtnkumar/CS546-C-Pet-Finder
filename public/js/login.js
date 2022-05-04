let error = document.getElementsByClassName("error")[0];
error.style.display = 'none';
let emailError = document.getElementsByClassName("email-error")[0];
emailError.style.display = 'none';
let passwordError = document.getElementsByClassName("password-error")[0];
passwordError.style.display = 'none';




async function login(event) {
    event.preventDefault();

    error.style.display = 'none';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let body = { email: email, password: password }
    await fetch('/users/login', {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((result) => {
            if (!result.authenticated) {
                let message = null;
                if (result.email) {
                    message = result.email;
                    emailError.style.display = 'block';
                    emailError.innerHTML = message;
                    emailError.style.color = "#FF0000";
                } else if (result.password) {
                    message = result.password;
                    passwordError.style.display = 'block';
                    passwordError.innerHTML = message;
                    passwordError.style.color = "#FF0000";
                } else if (result.message) {
                    message = result.message;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";

                }
            } else {
                alert('login successfully.');
                let requestConfig = {
                    method: 'GET',
                    url: 'http://localhost:3000/users/user-details?email='+body.email
                };
                $.ajax(requestConfig).then(function (responseMessage) {
                    window.localStorage.setItem('userDetails', JSON.stringify(responseMessage));
                    window.location.assign('http://localhost:3000/users/sign-up');
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
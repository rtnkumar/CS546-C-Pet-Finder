let error = document.getElementsByClassName("error")[0]
error.style.display = 'none'
let oldEmailError = document.getElementsByClassName("edit-email-error")[0]
oldEmailError.style.display = 'none'
let newEmailError = document.getElementsByClassName("edit-email1-error")[0]
newEmailError.style.display = 'none'
let newPasswordError = document.getElementsByClassName('edit-password-error')[0]
newPasswordError.style.display = 'none'
let confirmNewPasswordError = document.getElementsByClassName('edit-password1-error')[0]
confirmNewPasswordError.style.display = 'none'


$('.register__form').hide();

$('.sign-in__button').click(function(e) {
  e.preventDefault();
  $(this).addClass('active');
  $('.register__button').removeClass('active');
  $('.login__form').show();
  $('.register__form').hide();
  $('#edit-email').focus(); 
});

$('.register__button').click(function(e) {
  e.preventDefault();
  $(this).addClass('active');
  $('.sign-in__button').removeClass('active');
  $('.register__form').show();
  $('.login__form').hide();
  $('#edit-firstname').focus(); 
});

 $('.change_password').hide();

 $('.change_email_button').click(function(e) {
   e.preventDefault();
   $(this).addClass('active');
   $('.change_password_button').removeClass('active');
   $('.change_email').show();
   $('.change_password').hide();
   $('#edit-email').focus(); 
 });

 $('.change_password_button').click(function(e) {
   e.preventDefault();
   $(this).addClass('active');
   $('.change_email_button').removeClass('active');
   $('.change_password').show();
   $('.change_email').hide();
   $('#edit-firstname').focus();
 });


function init(){
    let isLogin=window.localStorage.getItem('isLogin');
    if(isLogin === null){
        alert("You are not logged in")
        window.location.assign('http://localhost:3000/users/sign-up')

    }
    else{
        let userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
        
         
     
         $('#edit-email').val(userDetails.email)
         $('#edit-email2').val(userDetails.email)
        console.log(userDetails.email)



    }
    
}
init()
async function updateEmail(event){
    event.preventDefault()

    error.style.display = 'none'
    oldEmailError.style.display = 'none'
    newEmailError.style.display = 'none'

    let oldEmail = document.getElementById("edit-email").value
    let newEmail = document.getElementById("edit-email1").value

    let body = {email: oldEmail, newEmail: newEmail}

    await fetch('/users/updates/email-pass', {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    .then((response)=> response.json())
    .then((result)=>{
        let message = null

        if (result.email) {
            message = result.email;
            oldEmailError.style.display = 'block'
            oldEmailError.innerHTML = message
            oldEmailError.style.color = "#FF0000"
        } else if (result.newEmail) {
            message = result.newEmail;
            newEmailError.style.display = 'block'
            newEmailError.innerHTML = message
            newEmailError.style.color = "#FF0000"
        }

        else if(result.message){
            message = result.message
            error.style.display = 'block'
            error.innerHTML = message
            error.style.color = "#FF0000"
            
            
        }

        else{
            window.location.assign('http://localhost:3000/users/accountSettings');
            userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
            userDetails.email = result.email

            window.localStorage.setItem('userDetails', JSON.stringify(userDetails)); 

            let keysToRemove = ["userDetails", "isLogin"];

            for (key of keysToRemove) {
              window.localStorage.removeItem(key);
            }
            
            alert("Email changed successfully!")

        }
    })

}

async function updatePassword(event){
    event.preventDefault()

    error.style.display = 'none'
    oldEmailError.style.display = 'none'
    newPasswordError.style.display = 'none'
    confirmNewPasswordError.style.error = 'none'

    let email = document.getElementById("edit-email2").value
    let newPassword = document.getElementById("edit-password").value
    let confirmNewPassword = document.getElementById('edit-password1').value

    let body = {email: email, newPassword: newPassword, confirmPassword:confirmNewPassword}

    await fetch('/users/updates/email-pass', {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    .then((response)=> response.json())
    .then((result)=>{
        let message = null

        if (result.email) {
            message = result.email;
        } 
        else if(result.newPassword){
            message = result.newPassword
            newPasswordError.style.display = 'block'
            newPasswordError.innerHTML = message
            newPasswordError.style.color = "#FF0000"
        }
        else if(result.confirmPassword){
            message = result.confirmPassword
            confirmNewPasswordError.style.display = 'block'
            confirmNewPasswordError.innerHTML = message
            confirmNewPasswordError.style.color = "#FF0000"
        }

        else if(result.message){
            message = result.message
            error.style.display = 'block'
            error.innerHTML = message
            
            
        }

        else{
            window.location.assign('http://localhost:3000/users/accountSettings');
            userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
            userDetails.email = result.email
             

            window.localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
            
            let keysToRemove = ["userDetails", "isLogin"];

            for (key of keysToRemove) {
              window.localStorage.removeItem(key);
            }
                        
            alert("Password updated successfully!")

            window.location.assign('http://localhost:3000/login')



        }
    })
}
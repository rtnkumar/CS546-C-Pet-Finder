let error = document.getElementsByClassName("error")[0]
error.getElementsByClassName.display = 'none'
let firstNameError = document.getElementsByClassName("first-name-error")[0];
firstNameError.style.display = 'none';
let middleNameError = document.getElementsByClassName("middle-name-error")[0];
middleNameError.style.display = 'none';
let lastNameError = document.getElementsByClassName("last-name-error")[0];
lastNameError.style.display = 'none';
let emailError = document.getElementsByClassName("email-error")[0];
emailError.style.display = 'none';
let phoneNumberError = document.getElementsByClassName("phone-number-error")[0];
phoneNumberError.style.display = 'none';
let addressError = document.getElementsByClassName("address-error")[0];
addressError.style.display = 'none';
let cityError = document.getElementsByClassName("city-error")[0];
cityError.style.display = 'none';
let stateError = document.getElementsByClassName("state-error")[0];
stateError.style.display = 'none';
let zipError = document.getElementsByClassName("zip-error")[0];
zipError.style.display = 'none';
let pictureError = document.getElementsByClassName("picture-error")[0];
pictureError.style.display = 'none';
let imagePath = '/public/uploads/images/users/'



function init(){
    let isLogin=window.localStorage.getItem('isLogin');
    if(isLogin === null){
        alert("You are not logged in")
        window.location.assign('http://localhost:3000/users/sign-up')

    }
    else{
        let userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
        
         
         $('#first-name').val(userDetails.firstName)
         $('#middle-name').val(userDetails.middleName)
         $('#last-name').val(userDetails.lastName)
         $('#email').val(userDetails.email)
         $('#phone-number').val(userDetails.phoneNumber)
         $('#address').val(userDetails.address)
         $('#city').val(userDetails.city)
         $('#state').val(userDetails.state)
         $('#zip').val(userDetails.zip)
         $('.image').append('<img src='+ imagePath + userDetails.picture + ' width="50" height="60" alt="userDetails.firstName">')


    }
    
}
init()

async function updateProfile(event) {
    event.preventDefault();
    
    error.style.display = 'none';
    firstNameError.style.display = 'none';
    middleNameError.style.display = 'none';
    lastNameError.style.display = 'none';
    phoneNumberError.style.display = 'none';
    addressError.style.display = 'none';
    cityError.style.display = 'none';
    stateError.style.display = 'none';
    zipError.style.display = 'none';
    pictureError.style.display = 'none';

    let firstName = document.getElementById("first-name").value;
    let middleName = document.getElementById("middle-name").value;
    let lastName = document.getElementById("last-name").value;
    let phoneNumber = document.getElementById("phone-number").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let zip = document.getElementById("zip").value;
    let picture = document.getElementById('picture').files[0];


    let formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip', zip);
    formData.append('picture', picture);


    await fetch('/users/profile/update', {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((result) => {
                let message = null;
                if(error == null || error === false){
                if (result.firstName) {
                    message = result.firstName;
                    firstNameError.style.display = 'block';
                    firstNameError.innerHTML = message;
                    firstNameError.style.color = "#FF0000";
                } else if (result.middleName) {
                    message = result.middleName;
                    middleNameError.style.display = 'block';
                    middleNameError.innerHTML = message;
                    middleNameError.style.color = "#FF0000";
                } else if (result.lastName) {
                    message = result.lastName;
                    lastNameError.style.display = 'block';
                    lastNameError.innerHTML = message;
                    lastNameError.style.color = "#FF0000";
                }else if (result.phoneNumber) {
                    message = result.phoneNumber;
                    phoneNumberError.style.display = 'block';
                    phoneNumberError.innerHTML = message;
                    phoneNumberError.style.color = "#FF0000";
                }  else if (result.address) {
                    message = result.address;
                    addressError.style.display = 'block';
                    addressError.innerHTML = message;
                    addressError.style.color = "#FF0000";
                } else if (result.city) {
                    message = result.city;
                    cityError.style.display = 'block';
                    cityError.innerHTML = message;
                    cityError.style.color = "#FF0000";
                } else if (result.state) {
                    message = result.state;
                    stateError.style.display = 'block';
                    stateError.innerHTML = message;
                    stateError.style.color = "#FF0000";
                } else if (result.zip) {
                    message = result.zip;
                    zipError.style.display = 'block';
                    zipError.innerHTML = message;
                    zipError.style.color = "#FF0000";
                } else if (result.picture) {
                    message = result.picture;
                    pictureError.style.display = 'block';
                    pictureError.innerHTML = message;
                    pictureError.style.color = "#FF0000";
                } else if (result.message) {
                    message = result.message;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";

                }
            }
                 else {
                
                window.location.assign('http://localhost:3000/users/userProfile');
                
                alert('Updated user details successfully.');
                userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
                console.log(userDetails)    
                userDetails.firstName = result.firstName
                userDetails.middleName = result.middleName
                userDetails.lastName = result.lastName
                userDetails.phoneNumber = result.phoneNumber
                userDetails.address = result.address
                userDetails.city = result.city
                userDetails.state = result.state
                userDetails.zip = result.zip
                userDetails.picture = result.picture
                window.localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
              
            }
        })
       
}
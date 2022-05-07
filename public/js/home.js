
/* If the page loads with a message of 'No pets found', display it in the error div */
window.addEventListener('load', () => {
    if (document.getElementById('error').innerHTML === 'No pets found') {
        document.getElementById('error').style.display = 'block'
    } else {
        document.getElementById('error').style.display = 'none'
    }
}, false);


// let error = document.getElementsByClassName("error")[0];
// error.style.display = 'none';
let cityError = document.getElementsByClassName("city-error")[0];
cityError.style.display = 'none';
let stateError = document.getElementsByClassName("state-error")[0];
stateError.style.display = 'none';
let zipError = document.getElementsByClassName("zip-error")[0];
zipError.style.display = 'none';
let typeError = document.getElementsByClassName("type-error")[0];
typeError.style.display = 'none';

async function homeSearch(event) {
    event.preventDefault();

    error.style.display = 'none';
    cityError.style.display = 'none';
    stateError.style.display = 'none';
    zipError.style.display = 'none';
    typeError.style.display = 'none';

    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let zip = document.getElementById("zip").value;
    let type = document.getElementById("type").value;
    let body = { city: city, state: state, zip: zip, type: type }
    if (!(city && state && zip)) {
        error.style.display = 'block';
        return;
    }

    await fetch('/', {
        method: "GET",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })   
        .then((response) => response.json())
        .then((result) => {
            let message = null;
            if (result.city) {
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
            } else if (result.type) {
                message = result.type;
                typeError.style.display = 'block';
                typeError.innerHTML = message;
                typeError.style.color = "#FF0000";
            }
        })
        .catch((e) => {
            console.error('Error:', e);
            error.innerHTML = "Something went wrong., please try again.";
        }); 
}



let petTypesList = Object.keys(petTypesListData);

for (let petType of petTypesList) {
    $('#pet-type').append('<option value=' + petType + '>' + petType + '</option>');
}

let breedList = petTypesListData.Dog.breed;
let ageList=petTypesListData.Dog.age;
let sizeList=petTypesListData.Dog.size;
let colorList=petTypesListData.Dog.color;
changeBreadList(breedList);
changeAgeList(ageList);
changeSizeList(sizeList);
changeColorList(colorList);

$("#pet-type").change(function () {
    let petType = $('#pet-type').val();

    // For breed
    $("#breed").empty();
    breedList = petTypesListData[petType].breed;
    changeBreadList(breedList);

    // For age
    ageList=petTypesListData[petType].age;
    $('#age').empty();
    changeAgeList(ageList);

    // For size
    sizeList=petTypesListData[petType].size;
    $('#size').empty();
    changeSizeList(sizeList);

    // For color
    colorList=petTypesListData[petType].color;
    $('#color').empty();
    changeColorList(colorList);
});

function changeBreadList(breedList){
    for (let breed of breedList) {
        $('#breed').append('<option value=' + breed + '>' + breed + '</option>');
    }
}

function changeAgeList(ageList){
    for (let age of ageList) {
        $('#age').append('<option value=' + age + '>' + age + '</option>');
    }
}

function changeSizeList(sizeList){
    for (let size of sizeList) {
        $('#size').append('<option value=' + size + '>' + size + '</option>');
    }
}

function changeColorList(colorList){
    for (let color of colorList) {
        $('#color').append('<option value=' + color + '>' + color + '</option>');
    }
}

let error = document.getElementsByClassName("error")[0];
error.style.display = 'none';
let petNameError = document.getElementsByClassName("pet-name-error")[0];
petNameError.style.display = 'none';
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


async function uploadNewPet(event) {
    event.preventDefault();
    let userDetails=JSON.parse(window.localStorage.getItem('userDetails'));
    if (userDetails == null || userDetails.email==null) {
        alert("Login is required");
        window.location.assign('http://localhost:3000/users/login');
        return;
    }
   
    error.style.display = 'none';
    petNameError.style.display = 'none';
    addressError.style.display = 'none';
    cityError.style.display = 'none';
    stateError.style.display = 'none';
    zipError.style.display = 'none';
    pictureError.style.display = 'none';

    let petName = document.getElementById("pet-name").value;
    let petType = document.getElementById("pet-type").value;
    let breed = document.getElementById("breed").value;
    let age = document.getElementById("age").value;
    let size = document.getElementById("size").value;
    let color = document.getElementById("color").value;
    let gender = document.getElementById("gender").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let zip = document.getElementById("zip").value;
    let picture = document.getElementById('picture').files[0];
    let description = document.getElementById("description").value;



    let formData = new FormData();
    formData.append('name', petName);
    formData.append('type', petType);
    formData.append('breed', breed);
    formData.append('age', age);
    formData.append('size', size);
    formData.append('color', color);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip', zip);
    formData.append('picture', picture);
    formData.append('description', description);
    formData.append('ownerId',userDetails._id);


    await fetch('/pets/upload', {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                let message = null;
                if (result.name) {
                    message = result.name;
                    petNameError.style.display = 'block';
                    petNameError.innerHTML = message;
                    petNameError.style.color = "#FF0000";
                } else if (result.type) {
                    message = result.type;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                } else if (result.breed) {
                    message = result.breed;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                } else if (result.age) {
                    message = result.age;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                } else if (result.size) {
                    message = result.size;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                } else if (result.color) {
                    message = result.color;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                }else if (result.gender) {
                    message = result.gender;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";
                }else if (result.address) {
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
                }else if (result.description) {
                    message = result.description;
                    description.style.display = 'block';
                    description.innerHTML = message;
                    description.style.color = "#FF0000";
                }
                 else if (result.message) {
                    message = result.message;
                    error.style.display = 'block';
                    error.innerHTML = message;
                    error.style.color = "#FF0000";

                }
            } else {
                alert('Pet uploaded successfully.');
                let requestConfig = {
                    method: 'GET',
                    url: 'http://localhost:3000/users/user-details?email='+userDetails.email
                };
                $.ajax(requestConfig).then(function (responseMessage) {
                    window.localStorage.setItem('userDetails', JSON.stringify(responseMessage));
                    window.localStorage.setItem('isLogin', true);
                    window.location.assign('http://localhost:3000/pets/upload/list');
                });
            }
        })
        .catch((error) => {
            alert("Something went wrong, please try after sometime");
        });
}

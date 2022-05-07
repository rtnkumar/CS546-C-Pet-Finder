(function ($) {

    $("#error").hide();
    let petDetails = data;

    function init() {
        let name = "N/A";
        if (petDetails && petDetails.name) {
            name = petDetails.name;
        }
        $('#show').append('<h1>' + name + '</h1>');

        let image = "/public/assets/www/media/no_image.jpeg";
        if (petDetails && petDetails.picture) {
            image = "/public/uploads/images/pets/" + petDetails.picture;
        }
        $('#show').append('<img src=' + image + ' alt="' + name + '"width="250" height="200">');
        $('#show').append('<dl></dl>');

        let breed = "N/A";
        if (petDetails && petDetails.breed) {
            breed = petDetails.breed;
        }
        $('#show dl').append('<dt>Breed</dt><dd>' + breed + '</dd>');

        let age = "N/A";
        if (petDetails && petDetails.age) {
            age = petDetails.age;
        }
        $('#show dl').append('<dt>Age</dt><dd>' + age + '</dd>');

        let size = "N/A";
        if (petDetails && petDetails.size) {
            size = petDetails.size;
        }
        $('#show dl').append('<dt>Size</dt><dd>' + size + '</dd>');

        let gender = "N/A";
        if (petDetails && petDetails.gender) {
            gender = petDetails.gender;
        }
        $('#show dl').append('<dt>Gender</dt><dd>' + gender + '</dd>');

        let color = "N/A";
        if (petDetails && petDetails.color) {
            color = petDetails.color;
        }
        $('#show dl').append('<dt>Color</dt><dd>' + color + '</dd>');

        // let length = "N/A";
        // if (petDetails && petDetails.length) {
        //     length = petDetails.length;
        // }
        // $('#show dl').append('<dt>Length</dt><dd>' + length + '</dd>');

        let address = "N/A";
        if (petDetails && petDetails.address) {
            address = petDetails.address;
        }
        $('#show dl').append('<dt>Address</dt><dd>' + address + '</dd>');

        let zip = "N/A";
        if (petDetails && petDetails.zip) {
            zip = petDetails.zip;
        }
        $('#show dl').append('<dt>Zip</dt><dd>' + zip + '</dd>');

        let city = "N/A";
        if (petDetails && petDetails.city) {
            city = petDetails.city;
        }
        $('#show dl').append('<dt>City</dt><dd>' + city + '</dd>');

        let state = "N/A";
        if (petDetails && petDetails.state) {
            state = petDetails.state;
        }
        $('#show dl').append('<dt>State</dt><dd>' + state + '</dd>');

        let description = "N/A";
        if (petDetails && petDetails.description) {
            description = petDetails.description;
        }
        $('#show dl').append('<dt>Description</dt><dd>' + description + '</dd>');


        $('#show dl').append('<dt>Owner Details</dt>');
        let ownerDetailsList = '';
        if (petDetails && petDetails.owner) {
            let owner = petDetails.owner;
            let ownerName = '';
            if (owner.firstName) {
                ownerName = ownerName + owner.firstName;
            }
            if (owner.middleName) {
                ownerName = ownerName + " " + owner.middleName;
            }
            if (owner.lastName) {
                ownerName = ownerName + " " + owner.lastName;
            }
            ownerDetailsList += '<li>' + ownerName + '</li>';
            if (owner.email) {
                ownerDetailsList += '<li>' + owner.email + '</li>';
            }
            if (owner.phoneNumber) {
                ownerDetailsList += '<li>' + owner.phoneNumber + '</li>';
            }
            let address = owner.address + ' ' + owner.city + ' ' + owner.state + ', ' + owner.zip;
            ownerDetailsList += '<li>' + address + '</li>';

        }
        if (ownerDetailsList == '') {
            ownerDetailsList = "<li>N/A</li>"
        }
        ownerDetailsList = '<ul>' + ownerDetailsList + '</ul>';
        ownerDetailsList = '<dd>' + ownerDetailsList + '</dd>';
        $('#show dl').append(ownerDetailsList);


        $('#qna').append('<h2>' + "Have a question?" + '</h2>');
        if (petDetails && petDetails.qna) {
            for (let qna of petDetails.qna) {
                $('#qna').append('<div>' + "<strong>Question:&nbsp&nbsp</strong>" + qna.question + '</div>');
                $('#qna').append('<div>' + "<strong>Answer:&nbsp&nbsp</strong>" + qna.answer + '</div>');
            }
        }
    }
    init();

    $('#askQuesForm').submit(function (event) {
        event.preventDefault();
        let userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
        if (userDetails == null || userDetails.email==null) {
            alert("Login is required");
            window.location.assign('http://localhost:3000/users/login');
        }

        $.ajax({
            type: "GET",
            url: 'http://localhost:3000/users/auth/' + userDetails.email,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //if received a response from the server
            success: function (response, textStatus, jqXHR) {
            },

            //If there was no resonse from the server
            error: function (jqXHR, textStatus, errorThrown) {
                let response = jqXHR.responseJSON;
                if (response.isLogin === false) {
                    alert("Login is required");
                    window.location.assign('http://localhost:3000/users/login');
                } else {
                    alert("Please try after sometime!");
                }
            },

            //capture the request before it was sent to server
            beforeSend: function (jqXHR, settings) {
            },

            //this is called after the response or error functions are finished
            //so that we can take some action
            complete: function (jqXHR, textStatus) {
            }
        })


        const question = $('#question').val();
        if (!question || question.trim() == '') {
            $("#error").show();
            $("#error").text("There is no question");
        } else {
            $("#error").hide();
            let requestConfig = {
                method: 'POST',
                url: 'http://localhost:3000/pets/qna/' + petDetails._id,
                data: {
                    question: question,
                    ownerId: petDetails.owner.id
                }
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                $('#qna').append('<div>' + "<strong>Question:&nbsp&nbsp</strong>" + responseMessage.question + '</div>');
                $('#qna').append('<div>' + "<strong>Answer:&nbsp&nbsp</strong>" + '</div>');
            });
        }

    });


})(window.jQuery);
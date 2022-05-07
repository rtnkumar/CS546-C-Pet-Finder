(function ($) {
    let userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
    let searchedDataList = userDetails.uploadedPetList;
    let petsListData=searchedDataList;
    let count = 0;
    function hideBackButton() {
        $("#back").hide();
    }
    function showBackButton() {
        $("#back").show();
    }
    function hideNextButton() {
        $("#next").hide();
    }
    function showNextButton() {
        $("#next").show();
    }


    $('#pet-list-container').on('click', 'button', function (e) {
        e.preventDefault();
        let isLogin = window.localStorage.getItem('isLogin');
        let petId = $(this).attr("pet-id");
        if (petId.includes('#') && isLogin === null) {
            window.location.assign('http://localhost:3000/users/sign-up');
        } else if (petId.includes('#') && isLogin === "true") {
            let id = petId.replace('#', '');
            $.ajax({
                type: "POST",
                url: 'http://localhost:3000/pets/favorites/pets/' + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                //if received a response from the server
                success: function (response, textStatus, jqXHR) {
                    if (response.favoritePetInserted && response.favoritePetInserted == true) {
                        alert("Added successfully");
                        searchedDataList = updatePetList(id);
                        count = 0;
                        $(".pet-list").remove();
                        init();
                    } else {
                        alert("Try after sometime")
                    }
                },

                //If there was no resonse from the server
                error: function (jqXHR, textStatus, errorThrown) {
                    let response = jqXHR.responseJSON;
                    if(response.message==="login is required"){
                        alert(response.message);
                        window.location.assign('http://localhost:3000/users/login');
                    }else if(`${id.trim()} is already in favorite list`==response.message){
                        alert("This pet is already in favorite list")
                    }else{
                        console.log(response);
                        alert(response);
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

        } else {
            window.location.assign('http://localhost:3000/pets/' + petId);
        }
    });

    $('#next').click(function () {
        $(".pet-list").remove();
        init();
    });

    $('#back').click(function () {
        count = count - currentShownDataCount - 16;
        $(".pet-list").remove();
        init();
    });

    let imagePath = '/public/uploads/images/pets/'
    let currentShownDataCount = 0;
    function init() {
        let totalCol = null;
        let dataLength = searchedDataList.length - count;
        if (dataLength % 4) {
            totalCol = dataLength / 4;
        } else {
            totalCol = Math.ceil(dataLength / 4);
        }

        let outerIndex = 0;
        currentShownDataCount = 0;
        for (; outerIndex < totalCol && outerIndex < 4; outerIndex++) {
            let id = outerIndex;
            $('#pet-list-container').append('<div id=' + id + ' class="row pet-list"></div>');
            for (let i = 0; i < 4 && count < searchedDataList.length; count++, i++) {
                currentShownDataCount++;
                let selector = '#' + id;
                $(selector).append('<div class="col-lg-3  text-black">' +
                    '<div><img src=' + imagePath + searchedDataList[count].picture + ' width="250" height="200"></div>' +
                    '<div style="text-align:center;">' + searchedDataList[count].name +
                    '</div>' +
                    '<div style="text-align:center;">  <button pet-id=' + searchedDataList[count]._id + ' style="margin-bottom: 20px;">View Details</button></div>' +
                    '</div>');
            }
        }

        if (dataLength <= 16) {
            hideNextButton();

        }
        if (dataLength > 16) {
            showNextButton();
        }

        if (count - currentShownDataCount > 0) {
            showBackButton();
        }
        if (count - currentShownDataCount <= 0) {
            hideBackButton();
        }
    }
    init();
    hideBackButton();

    $("#sort").change(function () {
        var filterValue = $(this).val();
        if (filterValue.toLowerCase() == "all") {
            searchedDataList = petsListData;
        } else {
            searchedDataList = getSortedFilteredData(petsListData, filterValue);
        }
        count = 0;
        $(".pet-list").remove();
        init();
    });
  
    function getSortedFilteredData(dataList, value) {
        let result = null;
        if (value == 1) {
            result = dataList.sort((a, b) => (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime());
        } else {
            result = dataList.sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime());
        }
        return result;
    }

    function updatePetList(id) {

        let petList = [];
        for (pet of searchedDataList) {
            if (pet._id === id) {
                continue;
            }
            petList.push(pet);
        }

        return petList;
    }

})(window.jQuery);
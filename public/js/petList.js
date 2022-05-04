(function ($) {

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
   
    let breedList = ["All"].concat(petTypeList.breed);
    for (let breed of breedList) {
        $('#breed').append('<option value=' + breed + '>' + breed + '</option>');
    }

    let ageList = ["All"].concat(petTypeList.age);
    for (let age of ageList) {
        $('#age').append('<option value=' + age + '>' + age + '</option>');
    }

    let sizeList = ["All"].concat(petTypeList.size);
    for (let size of sizeList) {
        $('#size').append('<option value=' + size + '>' + size + '</option>');
    }

    let colorList = ["All"].concat(petTypeList.color);
    for (let color of colorList) {
        $('#color').append('<option value=' + color + '>' + color + '</option>');
    }


    $('#pet-list-container').on('click', 'button', function (e) {
        e.preventDefault();
        window.location.assign('http://localhost:3000/pets/' + $(this).attr("pet-id"));

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
    let count = 0;
    let searchedDataList = petsListData;
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
                    '<div style="text-align:center;">  <button pet-id=#' + searchedDataList[count]._id + ' style="margin-top: -5px;">Add Favorite</button></div>' +

                    '<div><img src=' + imagePath+searchedDataList[count].picture + ' width="250" height="200"></div>' +
                    '<div style="text-align:center;">' + searchedDataList[count].name +
                    '</div>' +
                    '<div style="text-align:center;">  <button pet-id=' + searchedDataList[count]._id + ' style="margin-bottom: 20px;">View Details</button></div>' +
                    '</div>');
            }
        }

        if (dataLength <= 16) {
            hideNextButton();

        }
        if(dataLength>16){
            showNextButton();
        }

        if (count - currentShownDataCount > 0) {
            showBackButton();
        }
        if(count-currentShownDataCount<=0){
            hideBackButton();
        }
    }
    init();
    hideBackButton();
    let sizeFilterFlag = false;
    let genderFilterFlag = false;

    $("#age").change(function () {
        var filterValue = $(this).val();
        if (filterValue == "all") {
            searchedDataList = petsListData;
        } else {
            searchedDataList = getSizeFilteredData(petsListData, filterValue);
        }
        count = 0;
        $(".pet-list").remove();
        init();
    });


    $("#size").change(function () {
        var filterValue = $(this).val();
        if (filterValue == "all") {
            searchedDataList = petsListData;
        } else {
            searchedDataList = getSizeFilteredData(petsListData, filterValue);
        }
        count = 0;
        $(".pet-list").remove();
        init();
    });

    $("#gender").change(function () {
        var filterValue = $(this).val();
        if (filterValue == "all") {
            searchedDataList = petsListData;
        } else {
            searchedDataList = getGenderFilteredData(petsListData, filterValue);
        }
        count = 0;
        $(".pet-list").remove();
        init();
    });

    $("#sort").change(function () {
        var filterValue = $(this).val();
        if (filterValue == "all") {
            searchedDataList = petsListData;
        } else {
            searchedDataList = getSortedFilteredData(petsListData, filterValue);
        }
        count = 0;
        $(".pet-list").remove();
        init();
    });


    function getSizeFilteredData(dataList, value) {
        let result = [];
        for (let filterData of dataList) {
            if (filterData.size.toLowerCase() === value) {
                result.push(filterData);
            }
        }
        return result;
    }

    function getGenderFilteredData(dataList, value) {
        let result = [];
        for (let filterData of dataList) {
            if (filterData.gender.toLowerCase() === value) {
                result.push(filterData);
            }
        }
        return result;
    }

    function getSortedFilteredData(dataList, value) {
        let result = null;
        if (value == 1) {
            result = dataList.sort((a, b) => (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime());
        } else {
            result = dataList.sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime());
        }
        return result;
    }



})(window.jQuery);
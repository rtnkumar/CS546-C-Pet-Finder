const bcrypt = require('bcrypt');

async function  getHashedPassword(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

function getLoggedInUserNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}

function getLoggedInUserHomeNavList(){
    return [{ url: "#", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}
function getLoggedInUserUpdateProfileNavList(){
    return [{ url: "/", name: "Home" },
    { url: "#", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}
function getLoggedInUserAccountSettingNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "#", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}
function getLoggedInUserUploadPetNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "#", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}
function getLoggedInUserFavoritesNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "#", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}

function getLoggedInUserAdoptedListNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "#", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}

function getLoggedInUserUploadedPetListNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "#", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" }];
}

function getLoggedInUserPetDetailsNavList(){
    return [{ url: "/", name: "Home" },
    { url: "/users/userProfile", name: "Update Profile" },
    { url: "/users/accountSettings", name: "Account Settings" },
    { url: "/pets/new/upload", name: "Upload Pet" },
    { url: "/users/favoriteList", name: "Favorites" },
    { url: "/users/adoptedList", name: "Adopted List" },
    { url: "/pets/upload/list", name: "Uploaded Pet List" },
    { url: "/users/deleteAccount", name: "Delete Account" },
    { url: "/users/logout", name: "Logout" },];
}


function getNotLoggedInUserNavList(){
    return [{ url: "/", name: "Home" }, { url: "/users/login", name: "Login" }, { url: "/users/sign-up", name: "Sign Up" }];
}

function getNotLoggedInUserHomeNavList(){
    return [{ url: "#", name: "Home" }, { url: "/users/login", name: "Login" }, { url: "/users/sign-up", name: "Sign Up" }];
}

function getNotLoggedInUserLoginNavList(){
    return [{ url: "/", name: "Home" }, { url: "#", name: "Login" }, { url: "/users/sign-up", name: "Sign Up" }];
}

function getNotLoggedInUserSignUpNavList(){
    return [{ url: "/", name: "Home" }, { url: "/users/login", name: "Login" }, { url: "#", name: "Sign Up" }];
}

function getNotLoggedInUserPetDetailsNavList() {
    return [{ url: "/", name: "Home" }, { url: "/users/login", name: "Login" }, { url: "/users/sign-up", name: "Sign Up" }];
}

module.exports={
    getHashedPassword,
    getLoggedInUserNavList,
    getNotLoggedInUserNavList,
    getNotLoggedInUserHomeNavList,
    getLoggedInUserHomeNavList,
    getNotLoggedInUserLoginNavList,
    getNotLoggedInUserSignUpNavList,
    getLoggedInUserUpdateProfileNavList,
    getLoggedInUserAccountSettingNavList,
    getLoggedInUserUploadPetNavList,
    getLoggedInUserFavoritesNavList,
    getLoggedInUserAdoptedListNavList,
    getLoggedInUserUploadedPetListNavList,
    getNotLoggedInUserPetDetailsNavList,
    getLoggedInUserPetDetailsNavList
}
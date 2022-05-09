let error = document.getElementsByClassName("error")[0];
error.style.display = "none";
let emailError = document.getElementsByClassName("edit-email-error")[0];
emailError.style.display = "none";

function init() {
  let isLogin = window.localStorage.getItem("isLogin");
  if (isLogin === null) {
    //alert("You are not logged in")
    window.location.assign("http://localhost:3000/");
  } else {
    let userDetails = JSON.parse(window.localStorage.getItem("userDetails"));

    $("#edit-email2").val(userDetails.email);
  }
}
init();

async function deleteProfile(event) {
  event.preventDefault();

  error.style.display = "none";
  emailError.style.display = "none";

  let email = document.getElementById("edit-email2").value;

  await fetch("/users/delete", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      let message = null;

      if (result.email) {
        message = result.email;
        emailError.style.display = "block";
        emailError.innerHTML = message;
        emailError.style.color = "#FF0000";
      } else {
        window.location.assign("http://localhost:3000/users/deleteAccount");

        let keysToRemove = ["userDetails", "isLogin"];

        for (key of keysToRemove) {
          window.localStorage.removeItem(key);
        }

        alert("Account has been deleted successfully!");

 
      }
    });

  

}

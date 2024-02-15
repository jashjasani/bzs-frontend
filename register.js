// var check = function() {
//     if (document.getElementById('password').value ==
//       document.getElementById('confirm_password').value) {
//       document.getElementById('message').style.color = 'green';
//       document.getElementById('message').innerHTML = 'matching';
//     } else {
//       document.getElementById('message').style.color = 'red';
//       document.getElementById('message').innerHTML = 'not matching';
//     }
//   }
document.addEventListener("DOMContentLoaded", function (event) {

    fetch("https://bildzeitschrift.netlify.app/.netlify/functions/check", {
        method : "GET",
        headers : {
            "Authorization" : sessionStorage.getItem("auth")
        }
    }).then((res)=>{
        if(res.status==200){
            Swal.fire({
                position: "center",
                title: "You are already logged in.",
                showConfirmButton: false,
                timer: 1500
            }); 
            //this.location.replace("/dein-account")
        }
    })

    let form = document.getElementById("email-form");
    form.addEventListener("submit", handlerCallback, true);

    async function handlerCallback(event) {
        event.preventDefault();
        event.stopPropagation();

        // changing buttons to waiting...
        let registerBtn = document.getElementById("register-btn")
        registerBtn.value = "Einen Moment bitte..."
        registerBtn.style.backgroundColor = "#82736b"
        
        
        let fname = document.getElementById("vorname").value;
        let lname = document.getElementById("Nachname").value;
        let email = document.getElementById("email-3").value;
        let password = document.getElementById("Passwort").value;
        let conf_password = document.getElementById("Passwort-best-tigen").value;
        if(password!=conf_password){
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Passwords do not match!!",
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById("Passwort-best-tigen").focus()
        } else{
            try {
                let res = await fetch(
                    "https://bildzeitschrift.netlify.app/.netlify/functions/register",
                    {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        body: JSON.stringify({
                            first_name: fname,
                            last_name: lname,
                            email: email,
                            password: password,
                        }),
                    }
                );
                if(res.status==200){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Registration succesful",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    location.assign("/sign-up-confirmation")
                } else if(res.status==422){
                    Swal.fire({
                        position: "center",
                        icon: "info",
                        title: "An account with this email is already registered",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                
            } catch (e) {
                console.log(e.message);
            }
        }
        // changing buttons back to normal
        registerBtn.value = "Jetzt registrieren"
        registerBtn.style.backgroundColor = "#bf8563"
        
    }
});

window.addEventListener("popstate", function (event) {
    // Check if the URL search parameters have changed
    if (window.location.href !== event.currentTarget.location.href) {
        // Handle the changes here
        console.log(
            "URL search parameters have changed:",
            window.location.search
        );
    }
});
var Webflow = Webflow || [];
Webflow.push(function () {
    // DOMready has fired
    // May now use jQuery and Webflow api
    console.log("Hello");
});

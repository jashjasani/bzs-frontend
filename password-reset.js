document.addEventListener("DOMContentLoaded", function (event) {
    
    // check if user is already logged in 
    let params = new URLSearchParams(window.location.search)
    if(params.get("fp_token")==null){
        setTimeout(()=>{
            this.location.replace("/passwort-anfordern")
        },1500)
        Swal.fire({
            position: "center",
            icon : "error",
            title: "Invalid token",
            showConfirmButton: false,
            timer: 1500,
        });
    }


    let form = document.getElementById("pass-form");
    form.addEventListener("submit", handlerCallback, true);
    async function handlerCallback(event) {
        
        let loginBtn = document.getElementById("pass-btn")
        loginBtn.value = "Einen Moment bitte..."
        loginBtn.style.backgroundColor = "#82736b"
        event.preventDefault();
        event.stopPropagation();
        let password = document.getElementById("Passwort").value
        let cnf_pass = document.getElementById("Passwort-wiederholen").value

        if(password != cnf_pass){
            Swal.fire({
                position: "center",
                icon : "error",
                title: "Password and confirm password don't match.",
                showConfirmButton: false,
                timer: 1500,
            });
            document.getElementById("Passwort").focus()
        }else {
            try {
                let res = await fetch(
                    "https://bildzeitschrift.netlify.app/.netlify/functions/forgot-password",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            fp_token: params.get("fp_token"),
                            new_password : password
                        }),
                    }
                );
                if (res.status == 200) {
                    setTimeout(()=>{
                        location.replace("/login")
                    },2000)
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Password changed succesfully.",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    
                } else if (res.status == 400) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Link expired",
                        showConfirmButton: false,
                        timer: null,
                    });
                }
            } catch (e) {
                console.log(e.message);
            }
        }
        
        loginBtn.value = "Neues Passwort speichern"
        loginBtn.style.backgroundColor = "#bf8563"
    }
});




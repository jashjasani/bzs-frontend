document.addEventListener("DOMContentLoaded", function (event) {
    
    // check if user is already logged in 
    if(sessionStorage.getItem("auth")!=null){
        Swal.fire({
            position: "center",
            title: "Du bist bereits eingeloggt.",
            showConfirmButton: false,
            timer: 1500
        }); 
        this.location.replace("/archiv");
    }
    



    let form = document.getElementById("email-form");
    form.addEventListener("submit", handlerCallback, true);
    async function handlerCallback(event) {
        await event.preventDefault();
        await event.stopPropagation();
        let loginBtn = document.getElementById("login-btn")
        loginBtn.value = "Einen Moment bitte..."
        loginBtn.style.backgroundColor = "#82736b"
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("Passwort").value;
        
        try {
            let res = await fetch(
                "https://bildzeitschrift.netlify.app/.netlify/functions/user",
                {
                    method: "POST",
                    cache: "no-cache",
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            if(res.status==200){
                sessionStorage.setItem("auth",res.headers.get("Authorization"))
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Anmeldung erfolgreich",
                    showConfirmButton: false,
                    timer: 1500
                });
                location.replace("/archiv")
            } else if(res.status==403){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Ungültige Anmeldeinformationen",
                    showConfirmButton: false,
                    timer: 1500
                });
                
            } else if(res.status == 401){
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Sie müssen die E-Mail-Adresse bestätigen, bevor Sie sich anmelden können.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (e) {
            console.log(e.message);
        }
        
        loginBtn.value = "Anmelden"
        loginBtn.style.backgroundColor = "#bf8563"
    }
});



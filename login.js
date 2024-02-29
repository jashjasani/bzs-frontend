document.addEventListener("DOMContentLoaded", function (event) {
    
    // check if user is already logged in 
    if(sessionStorage.getItem("auth")!=null){
        Swal.fire({
            position: "center",
            title: "You are already logged in.",
            showConfirmButton: false,
            timer: 1500
        }); 
        this.location.replace("/dein-account");
    }
    



    let form = document.getElementById("email-form");
    form.addEventListener("submit", handlerCallback, true);
    async function handlerCallback(event) {
        
        let loginBtn = document.getElementById("login-btn")
        loginBtn.value = "Einen Moment bitte..."
        loginBtn.style.backgroundColor = "#82736b"
        event.preventDefault();
        event.stopPropagation();
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
                    title: "Login successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                location.replace("/dein-account")
            } else if(res.status==403){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Invalid credentials",
                    showConfirmButton: false,
                    timer: 1500
                });
                
            } else if(res.status == 401){
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "You need to verify the email before you can login.",
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



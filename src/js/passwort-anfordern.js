document.addEventListener("DOMContentLoaded", async function (event) {
    // check if user is already logged in
    if(sessionStorage.getItem("auth")){
        Swal.fire({
                position: "center",
                title: "You are already logged in.",
                showConfirmButton: false,
                timer: 1500
            }); 
    }

    let form = document.getElementById("pass-form");
    form.addEventListener("submit", handlerCallback, true);
    async function handlerCallback(event) {
        let loginBtn = document.getElementById("pass-btn");
        loginBtn.value = "Einen Moment bitte...";
        loginBtn.style.backgroundColor = "#82736b";
        event.preventDefault();
        event.stopPropagation();
        let email = document.getElementById("Email").value;
        try {
            let res = await fetch(
                "https://bildzeitschrift.netlify.app/.netlify/functions/forgot-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        fp_email: email,
                    }),
                }
            );
            if (res.status == 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Eine E-Mail mit Link zum Zurücksetzen des Passworts wurde an dich gesendet.",
                    showConfirmButton: false,
                    timer: null,
                });
            } else if (res.status == 204) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Kein Konto mit angegebener E-Mail.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (e) {
            console.log(e.message);
        }

        loginBtn.value = "Neues Passwort anfordern";
        loginBtn.style.backgroundColor = "#bf8563";
    }
});

document.addEventListener("DOMContentLoaded", async (event)=>{
    async function isValidZip(zip, countryCode) {
        try{
            let res = await fetch(`https://zip-api.eu/api/v1/radius/${countryCode}-${zip}`)
            return res.status !== 200
        }
        catch(e){
            console.warn(e.message);
        } 
    }
    // try {
        // all dom elements that need to be manipulated further
        const view = {
            email : document.getElementById("Dein-Benutzername"),
            first_name : document.getElementById("Dein-Vorname"),
            last_name : document.getElementById("nachname"),
            phone : document.getElementById("Telefon"),
            address: {
                street : document.getElementById("Stra-e"),
                house_no : document.getElementById("Hausnummer"),
                zip : document.getElementById("PLZ"),
                city : document.getElementById("Stadt"),
                country : document.getElementById("Land-auswahlen"),
                company : document.getElementById("Firma")
            }   
        }
        //load user data from netlify
        let res = await fetch(
            "https://bildzeitschrift.netlify.app/.netlify/functions/user",
            {
                method: "GET",
                headers : {
                    "Authorization" : sessionStorage.getItem("auth")
                },
                cache: "no-cache",
            }
        );
        //check if server was able to authenticate 
        if(res.status==200){
            let result = await res.json()
            
            //populate data into DOM 
            view.email.value = result.email
            view.first_name.value = result.first_name
            view.last_name.value = result.last_name
            view.phone.value = result.phone || ""
            if('address' in result){
                view.address.city.value = result.address.city || ""
                view.address.street.value = result.address.street || ""
                view.address.zip.value = result.address.zip || ""
                view.address.house_no.value = result.address.house_no || ""
                view.address.company.value = result.address.company || ""
                view.address.country.value = result.address.country || ""
            }
            

        } 


        let billing_form = document.getElementById("billing-form")
        billing_form.addEventListener("submit", billingFormHandler,true)

        let password_form = document.getElementById("password-form")
        password_form.addEventListener("submit", passwordFormHandler,true)

        async function billingFormHandler(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const data = {
                first_name : view.first_name.value,
                last_name : view.last_name.value,
                phone : view.phone.value,
                address : {
                    street : view.address.street.value,
                    house_no : view.address.house_no.value,
                    zip : view.address.zip.value,
                    city : view.address.city.value,
                    company : view.address.company.value,
                    country : view.address.country.value
                }
            
            }
            
            if(await isValidZip(view.address.zip.value,view.address.country.value)){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Zip code invalid for given country.",
                    showConfirmButton: false,
                    timer: 1500
                });
                return
            }else if(view.address.country.value == ""){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Country must be selected.",
                    showConfirmButton: false,
                    timer: 1500
                });
                return
            }
            // try {

                let res = await fetch(
                    "https://bildzeitschrift.netlify.app/.netlify/functions/user",
                    {
                        method: "PUT",
                        headers : {
                            "Authorization" : sessionStorage.getItem("auth"),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                    }
                );
                if(res.status==200){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Invoice details have been saved.",
                        showConfirmButton: false,
                        timer: 1500
                      });
                      const userDetails = {
                        email: view.email.value,
                        shipToBillingAddress : true,
                        billingAddress:{
                            name: view.first_name.value + " " + view.last_name.value,
                            address1: view.address.street.value + " " + view.address.house_no.value,
                            city: view.address.city.value,
                            country: view.address.country.value,
                            province: '',
                            postalCode: String(view.address.zip.value),
                            phone : String(view.phone.value),
                            firstName : view.first_name.value
                        }
                    }
                    await Snipcart.api.cart.update(userDetails);
                } else if(res.status==403){
                    alert("Invalid credentials")
                }
            // } catch (e) {
            //     console.log(e.message);
            // }
            
            
            
        }
        async function passwordFormHandler(event) {
            event.preventDefault();
            event.stopPropagation();
            const data = {
                old_password : document.getElementById("Altes-Passwort").value,
                new_password : document.getElementById("Neues-Passwort").value
            }
            if(data.new_password != document.getElementById("Neues-Passwort-2").value){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Passwort und Bestätigungspasswort stimmen nicht überein",
                    showConfirmButton: false,
                    timer: 1500
                });
                  return
            }
            
            try {
                let res = await fetch(
                    "https://bildzeitschrift.netlify.app/.netlify/functions/user",
                    {
                        method: "PUT",
                        headers : {
                            "Authorization" : sessionStorage.getItem("auth")
                        },
                        cache: "no-cache",
                        body: JSON.stringify(data),
                    }
                );
                if(res.status==200){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Passwort wurde erfolgreich zurückgesetzt",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    
                } else if(res.status==403){
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Incorrect old password",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else if(res.status == 401){
                    alert("Please verify your mail.")
                }
                //clearing form response
                document.getElementById("password-form").reset()
            } catch (e) {
                console.log(e.message);
            }
            
            
            
        }
    // } catch (e) {
    //     console.log(e.message);
    // }
})

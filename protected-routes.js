document.addEventListener("DOMContentLoaded",()=>{
    const protected_routes = ["/bestellungen", "/abonnements", "/archiv"];
    // check if user is already logged in
    if (protected_routes.includes(location.pathname)) {
        if(sessionStorage.getItem("auth")==null){
            location.replace("/login")
        }
    }
})    
    
document.addEventListener("DOMContentLoaded",async function(e){sessionStorage.getItem("auth")&&Swal.fire({position:"center",title:"You are already logged in.",showConfirmButton:!1,timer:1500}),document.getElementById("pass-form").addEventListener("submit",async function(e){var t=document.getElementById("pass-btn"),e=(t.value="Einen Moment bitte...",t.style.backgroundColor="#82736b",e.preventDefault(),e.stopPropagation(),document.getElementById("Email").value);try{var n=await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/forgot-password",{method:"POST",body:JSON.stringify({fp_email:e})});200==n.status?Swal.fire({position:"center",icon:"success",title:"Eine E-Mail mit Link zum Zurücksetzen des Passworts wurde an dich gesendet.",showConfirmButton:!1,timer:null}):204==n.status&&Swal.fire({position:"center",icon:"success",title:"Kein Konto mit angegebener E-Mail.",showConfirmButton:!1,timer:1500})}catch(e){console.log(e.message)}t.value="Neues Passwort anfordern",t.style.backgroundColor="#bf8563"},!0)});
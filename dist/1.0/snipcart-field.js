document.addEventListener("snipcart.ready",async function(){var e,s,i={email:"",shipToBillingAddress:!0,billingAddress:{name:"",address1:"",city:"",country:"",province:"",postalCode:"",phone:"",firstName:""}};try{null!=sessionStorage.getItem("auth")&&200==(e=await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/user",{method:"GET",headers:{Authorization:sessionStorage.getItem("auth")},cache:"no-cache"})).status&&(s=await e.json(),i.email=s.email||"",i.billingAddress.name=s.first_name+" "+s.last_name,i.billingAddress.address1=s.address.street+" "+s.address.house_no||"",i.billingAddress.city=s.address.city||"",i.billingAddress.country=s.address.country||"",i.billingAddress.postalCode=String(s.address.zip)||"",i.billingAddress.phone=s.phone,i.billingAddress.firstName=s.first_name||"",await Snipcart.api.cart.update(i))}catch(e){console.log(e)}});
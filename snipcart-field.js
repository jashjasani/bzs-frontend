document.addEventListener("snipcart.ready", async function () {
    const userDetails = {
        email: "",
        shipToBillingAddress: true,
        billingAddress: {
            name: "",
            address1: "",
            city: "",
            country: "",
            province: "",
            postalCode: "",
            phone: "",
            firstName: "",
        },
    };
    try {
        if (sessionStorage.getItem("auth") != null) {
            let res = await fetch(
                "https://bildzeitschrift.netlify.app/.netlify/functions/user",
                {
                    method: "GET",
                    headers: {
                        Authorization: sessionStorage.getItem("auth"),
                    },
                    cache: "no-cache",
                }
            );
            if (res.status == 200) {
                const user = await res.json();

                userDetails.email = user.email || "";
                userDetails.billingAddress.name =
                    user.first_name + " " + user.last_name;
                userDetails.billingAddress.address1 =
                    user.address.street + " " + user.address.house_no || "";
                userDetails.billingAddress.city = user.address.city || "";
                userDetails.billingAddress.country = user.address.country || "";
                userDetails.billingAddress.postalCode =
                    String(user.address.zip) || "";
                userDetails.billingAddress.phone = user.phone;
                userDetails.billingAddress.firstName = user.first_name || "";

                await Snipcart.api.cart.update(userDetails);
            }
        }
    } catch (e) {
        console.log(e);
    }
});

// (async()=>{
//     try {
//         await Snipcart.api.cart.update({
//             "email": "jashjasani@proton.me",
//             "billingAddress": {
//               "name": "JashJasani",
//               "address1": "Straße 19083",
//               "city": "907986785",
//               "country": "AT",
//               "province": "",
//               "postalCode": 6142,
//               "phone": "7016885856",
//               "firstName": "Jash"
//             }
//           });
//     } catch (error) {
//         console.log(error);
//     }
// })().then(()=>{console.log("Hello");})

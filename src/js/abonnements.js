
window.downgradeOrUpgrade = async (sub_id) => {
    Swal.fire({
        title: "Möchtest du dein Abonnement wirklich wechseln?",
        showCancelButton: true,
        confirmButtonText: "Abbrechen",
        cancelButtonText: "Ja, wechseln"
    }).then((result) => {
        if (result.isDismissed && result.hasOwnProperty("dismiss") && result.dismiss == "cancel") {

            fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/subscription?upgrade=true&sub=${sub_id}`, {
                method: "PUT",
                headers: {
                    Authorization: sessionStorage.getItem("auth"),
                },
            }).then((res) => {
                if (res.ok) {

                    fetch("https://bildzeitschrift.netlify.app/.netlify/functions/subscription", {
                        method: "GET",
                        headers: {
                            Authorization: sessionStorage.getItem("auth"),
                        },
                    }).then(async (result) => {
                        let PLANS = [
                            { name: "Starter", price: 5, active: false, description: "Das Starter Abo erlaubt es dir, den Filter zur Gänze zu nutzen und somit das Archiv bis ins letzte Details filtern zu können.", price_id: "price_1OsJmuSA2e71Dz91jqdMYH0V" },
                            { name: "Inspiration", price: 8, active: false, description: "In diesem Abo hast du einerseits die Möglichkeit, den Filter zur Gänze zu nutzen und andererseits deine eigenen Kollektionen von Magazinen zu speichern. Deine Kollektionen kannst du dann auch in einem Präsentationsmodus abspielen.", price_id: "price_1OqG9PSA2e71Dz91HaJFV0xb" }
                        ]
                        const active_plan = await result.json()
                        if (active_plan.plan) {
                            const plan = active_plan.plan
                            let current_plan = PLANS.find((obj) => {
                                return obj.name == plan.plan
                            })
                            current_plan.active = true
                            let date = new Date(plan.end_date * 1000)
                            current_plan["end_date"] = String(date.getDate()).padStart(2, '0') + "/" +
                                String(date.getMonth() + 1).padStart(2, '0') + "/" + String(date.getFullYear()).slice(-2)
                            current_plan["sub_id"] = plan.subscription
                            if (plan.hasOwnProperty("downgrade")) {
                                current_plan["downgraded"] = true
                            } if (plan.hasOwnProperty("cancel_at_end")) {
                                current_plan["cancel_at_end"] = true
                            }
                            renderPlans(PLANS, true, plan.subscription)
                        }
                    })

                }

            })
        }
    });

}


window.createCheckout = async (price_id) => {

    let confirmation = await Swal.fire({
        title: "Möchtest du dieses Abonnement bestellen?",
        showCancelButton: true,
        confirmButtonText: "Ja, weiter zur Bestellung",
        cancelButtonText: "Abbrechen"
    })
    if (confirmation.isConfirmed) {
        let checkout = await fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/create_checkout?price_id=${price_id}`, {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth")
            }
        })
        let response = await checkout.json()
        location.assign(response.checkout_link)
    }


}

window.cancelPlan = async (sub_id) => {

    let confirmation = await Swal.fire({
        title: "Bist du sicher, dass du dieses Abonnement kündigen möchtest?",
        showCancelButton: true,
        cancelButtonText: "Nein",
        confirmButtonText: "Ja, sofort kündigen"
    })
    if (confirmation.isConfirmed) {

        let response = await fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/subscription?sub_id=${sub_id}`, {
            method: "DELETE",
            headers: {
                Authorization: sessionStorage.getItem("auth")
            }
        })
        if (response.status == 200) {
            fetch("https://bildzeitschrift.netlify.app/.netlify/functions/subscription", {
                method: "GET",
                headers: {
                    Authorization: sessionStorage.getItem("auth"),
                },
            }).then(async (result) => {
                let PLANS = [
                    { name: "Starter", price: 5, active: false, description: "Das Starter Abo erlaubt es dir, den Filter zur Gänze zu nutzen und somit das Archiv bis ins letzte Details filtern zu können.", price_id: "price_1OsJmuSA2e71Dz91jqdMYH0V" },
                    { name: "Inspiration", price: 8, active: false, description: "In diesem Abo hast du einerseits die Möglichkeit, den Filter zur Gänze zu nutzen und andererseits deine eigenen Kollektionen von Magazinen zu speichern. Deine Kollektionen kannst du dann auch in einem Präsentationsmodus abspielen.", price_id: "price_1OqG9PSA2e71Dz91HaJFV0xb" }
                ]
                const active_plan = await result.json()
                if (active_plan.plan) {
                    const plan = active_plan.plan
                    let current_plan = PLANS.find((obj) => {
                        return obj.name == plan.plan
                    })
                    current_plan.active = true
                    let date = new Date(plan.end_date * 1000)
                    current_plan["end_date"] = String(date.getDate()).padStart(2, '0') + "/" +
                        String(date.getMonth() + 1).padStart(2, '0') + "/" + String(date.getFullYear()).slice(-2)
                    current_plan["sub_id"] = plan.subscription
                    if (plan.hasOwnProperty("downgrade")) {
                        current_plan["downgraded"] = true
                    } if (plan.hasOwnProperty("cancel_at_end")) {
                        current_plan["cancel_at_end"] = true
                    }
                    renderPlans(PLANS, true, plan.subscription)
                }
            })
        }
    }


}



function renderPlans(plans, is_active, sub_id) {

    const subs_wrap = document.querySelectorAll(".subs-wrap")
    const active = subs_wrap[0]
    const available = subs_wrap[1]

    active.innerHTML = "<h2 class='subs-head'>Dein aktuelles Abo</h2>"
    available.innerHTML = "<h2 class='subs-head'>Weitere Abonnements</h2>"
    for (let i = 0; i < plans.length; i++) {



        if (plans[i].active) {

            const html = `
            <div class="subs-wrapper">
                <div class="subs-wrap-inner">
                    <h3 class="subs-head">${plans[i].name}</h3>
                    <div>
                        <span class="price-span">€ ${plans[i].price},00</span> / Monat
                    </div>
                    <a onclick=cancelPlan('${sub_id}') class="button subs-cancel w-inline-block" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg); transform-style: preserve-3d;">
                        <div class="button-text subs">Kündigen</div>
                    </a>
                </div>
                <div class="subs-wrap-inner">
                    <p class="subs-p">${plans[i].description}</p>
                    <span>${plans[i].cancel_at_end ? "Gekündigt" : `Verlängert sich am : ${plans[i].end_date}`}</span>
                </div>
            </div>`
            active.insertAdjacentHTML("beforeend", html)
        } else {
            const html = `
            <div class="subs-wrapper">
                <div class="subs-wrap-inner">
                    <h3 class="subs-head">${plans[i].name}</h3>
                    <div>
                        <span class="price-span" data-moz-translations-id="0">€ ${plans[i].price},00</span> / Monat
                    </div>
                    <a  onclick=${is_active ? `downgradeOrUpgrade('${sub_id}')` :
                    `createCheckout('${plans[i].price_id}')`} class="button subs-change w-inline-block" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg); transform-style: preserve-3d;">
                        <div class="button-text subs">${is_active ? "Abo wechseln " : "Choose this plan"
                }</div>
                    </a>
                </div>
                <div class="subs-wrap-inner">
                    <p class="subs-p">${plans[i].description}</p>
                </div>
            </div>`

            available.insertAdjacentHTML("beforeend", html)
        }
    }

}

(async () => {

    let PLANS = [
        { name: "Starter", price: 5, active: false, description: "Das Starter Abo erlaubt es dir, den Filter zur Gänze zu nutzen und somit das Archiv bis ins letzte Details filtern zu können.", price_id: "price_1OsJmuSA2e71Dz91jqdMYH0V" },
        { name: "Inspiration", price: 8, active: false, description: "In diesem Abo hast du einerseits die Möglichkeit, den Filter zur Gänze zu nutzen und andererseits deine eigenen Kollektionen von Magazinen zu speichern. Deine Kollektionen kannst du dann auch in einem Präsentationsmodus abspielen.", price_id: "price_1OqG9PSA2e71Dz91HaJFV0xb" }
    ]
    document.addEventListener("DOMContentLoaded", async () => {

        let result = await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/subscription", {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth"),
            },
        })
        if (result.ok) {
            const active_plan = await result.json()
            if (active_plan.plan) {
                const plan = active_plan.plan
                let current_plan = PLANS.find((obj) => {
                    return obj.name == plan.plan
                })
                current_plan.active = true
                let date = new Date(plan.end_date * 1000)
                current_plan["end_date"] = String(date.getDate()).padStart(2, '0') + "/" +
                        String(date.getMonth() + 1).padStart(2, '0') + "/" + String(date.getFullYear()).slice(-2)
                current_plan["sub_id"] = plan.subscription
                if (plan.hasOwnProperty("downgrade")) {
                    current_plan["downgraded"] = plan.downgraded
                }
                if (plan.hasOwnProperty("cancel_at_end")) {
                    current_plan["cancel_at_end"] = plan.cancel_at_end
                }
                renderPlans(PLANS, true, plan.subscription)

            } else {
                renderPlans(PLANS, false)
            }

        }
    })

})().then()
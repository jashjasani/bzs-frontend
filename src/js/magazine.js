document.addEventListener("DOMContentLoaded", async function () {
    window.saveOrDelete = (event) => {
        const target = event.target
        const name = target.getAttribute("name")
        const arry = window.collections.find(obj => obj.name == name)
        // Save
        if (target.innerText == "Speichern") {

            fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection", {
                method: "PUT",
                headers: {
                    Authorization: sessionStorage.getItem("auth")
                },
                body: JSON.stringify({
                    name: name,
                    update: {
                        $addToSet: {
                            items: productId
                        },
                        ...(!arry.hasOwnProperty("cover") ? {
                            $set: { cover: document.querySelector(".product-img").src.split("/v1651695832/")[1] }

                        } : {})
                    }
                })
            }).then((res) => {
                // if it was saved to database only then update the state

                if (res.status == 200) {
                    arry.items.push(productId)
                    target.innerText = "Gespeichert"
                    target.style = "margin: 10px; border: 2px solid var(--black); color: var(--black); background-color: #A4A67C; border-radius:10px;font-size: initial;"
                }
            })


        } else if (target.innerText == "Gespeichert") {

            fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection", {
                method: "PUT",
                headers: {
                    Authorization: sessionStorage.getItem("auth")
                },
                body: JSON.stringify({
                    name: name,
                    update: {
                        $pull: {
                            items: productId
                        }
                    }
                })
            }).then((res) => {
                // if it was deleted from database only then update the state
                if (res.status == 200) {
                    const index = arry.items.indexOf(window.productId);
                    if (index > -1) {
                        arry.items.splice(index, 1);
                    }
                    target.innerText = "Speichern"
                    target.style = "margin: 10px; border: 2px solid var(--black); color: var(--black); background-color: #BF8563; border-radius:10px;font-size: initial;"
                }
            })


        }


    }



    window.createCollection = async (event) => {

        let output = await Swal.fire({
            title: "Neue Kollektion",
            input: "text",
            inputLabel: "Name",
            inputPlaceholder: "Name deiner neuen Kollektion",
            confirmButtonText: "Erstellen",
            inputValidator: (value) => {
                if (!value) {
                    return "Name cannot be empty";
                }
            },
        });

        // check if collection already exists
        if (!window.collections.some(obj => obj.name == output.value) && output.value != undefined) {
            // create new collection in database 
            fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection", {
                method: "POST",
                headers: {
                    Authorization: sessionStorage.getItem("auth")
                },
                body: JSON.stringify({
                    name: output.value,
                    item: window.productId
                })
            }).then((res) => {
                if (res.status == 200) {
                    const obj = { name: output.value, items: [], cover: window.productId.replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "") }
                    obj.items.push(window.productId)
                    window.collections.push(obj)
                }
            })



        }
    }



    window.searchFilter = (event) => {
        const it = event.target.parentElement.querySelectorAll(".collections")
        if (event.target.value == '') {

            for (let i = 0; i < it.length; i++) {
                it[i].style.display = "flex"

            }

        }
        for (let i = 0; i < it.length; i++) {
            if (!it[i].innerText.toLowerCase().startsWith(event.target.value.toLowerCase())) {
                it[i].style.display = "none"
            } else if (it[i].innerText.toLowerCase().startsWith(event.target.value.toLowerCase()) && it[i].style.display == "none") {
                it[i].style.display = "flex"
            }
        }
    }



    window.clickHandler = (event) => {

        let str = `<input placeholder="Suchen..." style="background-color: #d9d3d0;
        outline: none;
        border: 1px solid #2b2a2a;
        border-radius: 10px;
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 10;" oninput="searchFilter(event)">`


        for (let i = 0; i < window.collections.length; i++) {
            let includes = window.collections[i].items.includes(window.productId)
            str += `
            <div style="display:flex; justify-content: space-between;" class="collections">
                <div style="margin: 10px;">${window.collections[i].name}</div>
                <button style="margin: 10px; border: 2px solid var(--black); color: var(--black);
                border-radius: 10px; font-size:initial; ${includes ? 'background-color: rgb(164, 166, 124);' : 'background-color:var(--peru);'}"   name="${window.collections[i].name.trim()}"   onclick='saveOrDelete(event)'>${includes ? "Gespeichert" : "Speichern"}</button>
            </div>
            `
        }
        str += `
        <div style="display:flex; justify-content: space-between;">

            <button style="margin: 10px; border: 2px solid var(--black); color: var(--black);
            border-radius: 10px; font-size:initial; background-color:var(--peru);" onclick='createCollection()'>+</button>
            <div style="margin: 10px;">Kollektion erstellen</div>
        </div>
        `

        Swal.fire({
            showCloseButton: false,
            showConfirmButton: false,
            html: `
        
            <div style="display: flex;flex-direction:column;overflow: auto;
            scrollbar-width: none; max-height:350px;">
                ${str}
            </div>            
            `,
            focusConfirm: false
        })
    }


    async function addCollectionButton() {
        if (sessionStorage.getItem("auth") && subscription != null && subscription.plan == "Inspiration") {
            const wrapper = document.getElementsByClassName("product-price-wrapper")[0]
            const Link = document.createElement("a")
            Link.className = "button w-inline-block"
            Link.style.cssText = "transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg); transform-style: preserve-3d; display: flex; margin-top:15px; background: #a4a67c;"
            const div = document.createElement("div")
            div.className = "button-text"
            div.innerText = "In Kollektion speichern"
            Link.appendChild(div)
            Link.setAttribute("onclick", "clickHandler(event)")
            wrapper.appendChild(Link)
        }
    }




    async function renderData(data) {
        const productHeading = document.getElementsByClassName("heading-2")[0];
        productHeading.innerText = data.product.Name;


        const monthWrapper = document.getElementsByClassName("month-product")[0];
        monthWrapper.innerText = data.product.Monat;
        const yearWrapper = document.getElementsByClassName("year-text")[0];
        yearWrapper.innerText = data.product.Jahr;


        const img = document.getElementsByClassName("product-image")[0];
        const imgWrapper = document.getElementsByClassName("product-lightbox")[0];
        imgWrapper.setAttribute('data-mfp-src', "https://res.cloudinary.com/wdy-bzs/image/upload/" + data.product.Images);
        img.src = "https://res.cloudinary.com/wdy-bzs/image/upload/" + data.product.Images;

        var regExp = /[a-zA-Z]/g;
        if (regExp.test(data.product.Preis) || data.product.Preis == 0) {
            await addCollectionButton()
            const priceIndicator = document.getElementsByClassName("price-wrapper")[0];
            priceIndicator.style.display = 'none';
            const addButton = document.getElementsByClassName('snipcart-add-item')[0];
            addButton.getElementsByClassName("button-text")[0].innerText = "Kontakt for preis"
            addButton.addEventListener("click", async (event) => {
                event.preventDefault()
                let output = null
                if (sessionStorage.getItem("auth") == null) {
                    output = await Swal.fire({
                        title: "Anfrage",
                        input: "text",
                        inputLabel: "E-Mail",
                        inputPlaceholder: "johndoe@gmail.com",
                        confirmButtonText: "Senden",
                        inputValidator: (value) => {
                            if (!value) {
                                return "E-Mail darf nicht leer sein";
                            }
                        },
                    });
                    if (output.hasOwnProperty("value")) {
                        let res = await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/price-inquiry", {
                            method: "POST",
                            body: JSON.stringify({
                                "email": output.value,
                                "product": location.href
                            })
                        })
                        if (res.ok) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Your inquiry was sent to BZS",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    }

                } else {
                    let res = await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/price-inquiry", {
                        method: "POST",
                        headers: {
                            Authorization: sessionStorage.getItem("auth")
                        },
                        body: JSON.stringify({
                            "product": location.href
                        })
                    })
                    if (res.ok) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Your inquiry was sent to BZS",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            })
            addButton.style.display = 'flex';

        } else {
            await addCollectionButton()
            const price = document.getElementsByClassName("price")[0];
            price.innerText = data.product.Preis;
            const priceWrapper = document.getElementsByClassName("price-wrapper")[0];
            priceWrapper.style.display = "flex";
            const addButton = document.getElementsByClassName('snipcart-add-item')[0];
            addButton.addEventListener("click", (event) => {
                event.preventDefault();

                const product = {
                    id: data.product.SKU,
                    name: data.product.Name,
                    price: data.product.Preis,
                    image: data.product.Images
                };

                // --- get cart from localStorage ---
                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                // --- check if item already exists ---
                let existing = cart.find(item => item.id === product.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                // --- save updated cart ---
                localStorage.setItem("cart", JSON.stringify(cart));

                // --- refresh cart UI + open it ---
                window.renderCart();
                window.openCart();
            });
            addButton.style.display = "flex";

        }





        const productCategoriesWrapper = document.getElementsByClassName("product-categories-wrapper")[0];
        const cats = data.categories;
        const catKeys = Object.keys(data.product);
        for (c of catKeys) {
            if (c == 'Jahrzehnt') {
                const singleCat = document.createElement("a");
                singleCat.className = "single-product-cat";
                singleCat.innerText = data.product.Jahrzehnt;
                singleCat.href = new URL(document.baseURI).origin + "/archiv?jahrzehnt=" + data.product.Jahrzehnt
                productCategoriesWrapper.append(singleCat);
            } else if (c == 'THEMA') {
                data.product.THEMA.forEach(element => {
                    if (element != "") {
                        const singleCat = document.createElement("a");
                        singleCat.className = "single-product-cat";
                        singleCat.innerText = element;
                        singleCat.href = new URL(document.baseURI).origin + "/archiv?t_single=" + element;
                        productCategoriesWrapper.append(singleCat);
                    }

                });
            } else if (c == 'ZEITSCHRIFTEN') {
                data.product.ZEITSCHRIFTEN.forEach(element => {
                    if (element != "") {
                        const singleCat = document.createElement("a");
                        singleCat.className = "single-product-cat";
                        singleCat.innerText = element;
                        singleCat.href = new URL(document.baseURI).origin + "/archiv?z_single=" + element;
                        productCategoriesWrapper.append(singleCat);
                    }

                })
            } else if (c == 'MOTIV') {
                data.product.MOTIV.forEach(element => {
                    if (element != "") {
                        const singleCat = document.createElement("a");
                        singleCat.className = "single-product-cat";
                        singleCat.innerText = element;
                        singleCat.href = new URL(document.baseURI).origin + "/archiv?m_single=" + element;
                        productCategoriesWrapper.append(singleCat);
                    }

                });
            } else if (c == 'Titelseite') {
                data.product.Titelseite.forEach(element => {
                    if (element != "") {
                        const singleCat = document.createElement("a");
                        singleCat.className = "single-product-cat";
                        singleCat.innerText = element;
                        singleCat.href = new URL(document.baseURI).origin + "/archiv?Titelseite=" + element;
                        productCategoriesWrapper.append(singleCat);
                    }
                });
            } else if (c == 'PERSÖNLICHKEITEN') {
                data.product.PERSÖNLICHKEITEN.forEach(element => {
                    if (element != "") {
                        const singleCat = document.createElement("a");
                        singleCat.className = "single-product-cat";
                        singleCat.innerText = element;
                        singleCat.href = new URL(document.baseURI).origin + "/archiv?p_single=" + element;
                        productCategoriesWrapper.append(singleCat);
                    }
                });
            }
        }
        var upSellLinks = document.getElementsByClassName("upsells-link w-inline-block");
        var upSellImages = document.getElementsByClassName("upsells-img");
        var i = 0;
        var similarMags = data.similarMags;
        for (a of upSellLinks) {
            upSellImages[i].src = "";
            upSellImages[i].src = "https://res.cloudinary.com/wdy-bzs/image/upload/" + similarMags[i].Images;
            a.href = new URL(document.baseURI).origin + "/magazine?productId=" + similarMags[i].SKU;
            i++;
        }
    }


    async function loadCollections() {

        collections = await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection", {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth"),
            },
        })
        return collections = await collections.json()


    }

    setTimeout(() => {
        var url = window.location.href;

        var productId = url.split('?')[1];
        if (productId) {
            fetch('https://bildzeitschrift.netlify.app/.netlify/functions/loadProduct?' + productId)
                .then(resp => resp.json())
                .then(async (data) => {
                    let response = await loadCollections()
                    window.collections = response.collections
                    window.subscription = response.subscription
                    await renderData(data)

                    window.productId = new URLSearchParams(window.location.search).get("productId")
                })
        }
    }, 10)
})

document.addEventListener("DOMContentLoaded", async function () {
    function addSnipcartAttributes(data) {
        const button = document.getElementsByClassName('snipcart-add-item')[0];
        button.setAttribute('data-item-url', "https://bildzeitschrift.netlify.app/.netlify/functions/validateOrder?productId=" + data.product.SKU);
        button.setAttribute('data-item-id', data.product.SKU);
        button.setAttribute('data-item-price', data.product.Preis);
        button.setAttribute('data-item-name', data.product.Name + " " + data.product.Jahr);
        button.setAttribute('data-item-image', "https://res.cloudinary.com/wdy-bzs/image/upload/" + data.product.Images);
        button.setAttribute('data-item-description', data.product.Monat + " " + data.product.Jahr + " " + data.product.Ausgabe);
    }

    window.saveOrDelete = (event) => {
        const target = event.target
        const name = target.getAttribute("name")
        const arry = collections.find(obj => obj.name == name)
        // Save
        if (target.innerText == "Specihern") {

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
                    target.innerText = "Gerettet"
                }
            })


        } else if (target.innerText == "Gerettet") {

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
                    const index = arry.items.indexOf(productId);
                    if (index > -1) {
                        arry.items.splice(index, 1);
                    }
                    target.innerText = "Specihern"
                }
            })


        }


    }

    async function addCollectionButton() {
        if (sessionStorage.getItem("auth")) {
            const wrapper = document.getElementsByClassName("product-price-wrapper")[0]
            const Link = document.createElement("a")
            Link.className = "button w-inline-block"
            Link.style.cssText = "transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg); transform-style: preserve-3d; display: flex; margin-top:15px; background: #a4a67c;"
            const div = document.createElement("div")
            div.className = "button-text"
            div.innerText = "In Kollektion speichern"
            Link.appendChild(div)





            Link.addEventListener("click", (event) => {

                let str = ``


                for (let i = 0; i < window.collections.length; i++) {

                    console.log(includes);
                    str += `
                        <div style="display:flex; justify-content: space-between;">
                            <div style="margin: 10px;">${window.collections[i].name}</div>
                            <button style="margin: 10px; border: 2px solid var(--black);background-color: var(--peru);color:var(--black);
                            border-radius: 10px; font-size:initial;" name="${window.collections[i].name}" onclick="saveOrDelete(event)">${window.collections[i].items.includes(window.productId) ? "Gerettet" : "Specihern"}</button>
                        </div>

                    `
                }

                Swal.fire({
                    showCloseButton: false,
                    showConfirmButton: false,
                    html: `
                
                    <div style="display: flex;flex-direction:column;overflow: auto;
                    scrollbar-width: none;">
                        ${str}
                    </div>            
                    `,
                    focusConfirm: false
                })
            })
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
            addButton.style.display = 'none';

        } else {
            await addCollectionButton()
            const price = document.getElementsByClassName("price")[0];
            price.innerText = data.product.Preis;
            const priceWrapper = document.getElementsByClassName("price-wrapper")[0];
            priceWrapper.style.display = "flex";
            const addButton = document.getElementsByClassName('snipcart-add-item')[0];
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
                    addSnipcartAttributes(data)
                    window.collections = await loadCollections()
                    await renderData(data)

                    window.productId = new URLSearchParams(window.location.search).get("productId")
                })
        }
    }, 10)
})

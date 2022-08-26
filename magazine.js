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

    function renderData(data) {
        const productHeading = document.getElementsByClassName("heading-2")[0];
        productHeading.innerText = data.product.Name;


        const monthWrapper = document.getElementsByClassName("month-product")[0];
        monthWrapper.innerText = data.product.Monat;
        const yearWrapper = document.getElementsByClassName("year-text")[0];
        yearWrapper.innerText = data.product.Jahr;


        const img = document.getElementsByClassName("product-image")[0];
        img.src = "https://res.cloudinary.com/wdy-bzs/image/upload/" + data.product.Images;
        console.log(typeof data.product.Preis);
        if(isNaN(parseInt(data.product.Preis))){
            const priceIndicator = document.getElementsByClassName("price-wrapper")[0];
            priceIndicator.style.display='none';
            const addButton = document.getElementsByClassName('snipcart-add-item')[0];
            addButton.style.display='none';
            console.log("Price undefined");
        }else{
            const price = document.getElementsByClassName("price")[0];
            price.innerText = data.product.Preis;
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
    setTimeout(() => {
        var url = window.location.href;
        var productId = url.split('?')[1];
        if (productId) {
            fetch('https://bildzeitschrift.netlify.app/.netlify/functions/loadProduct?' + productId)
                .then(resp => resp.json())
                .then(data => {
                    addSnipcartAttributes(data)
                    renderData(data)

                })
        }
    }, 10)
})

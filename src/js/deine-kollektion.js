document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search)
    const wrapper = document.querySelector(".single-collection-wrapper")
    const name = document.querySelector(".login-head")
    name.innerText = params.get("name")
    if (params.get("name")) {
        fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${params.get("name")}`, {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth")
            }
        }).then(res => res.json())
            .then((res) => {
                let response = res.resolved
                res = res.collection
                
                

                wrapper.innerHTML = ""
                const preimage = "https://res.cloudinary.com/wdy-bzs/image/upload/images/"
                const str = ``
                for (const i = 0; i < res.items.length; i++) {
                    const img = res.items[i].replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")
                    str += `<a href="https://www.bildzeitschrift.com/magazine?productId=${res.items[i]}" class="item-link w-inline-block" randid=${i} sku="${res.items[i]}" jahr=${response[i].Jahr} name="${response[i].Name}" monat="${response[i].Monat}">
                <img src="${preimage + img}"  style="height: -webkit-fill-available; width: -webkit-fill-available;" loading="lazy" sizes="(max-width: 479px) 86vw, (max-width: 767px) 40vw, (max-width: 991px) 27vw, 21vw" alt="" srcset="${preimage + img} 500w, ${preimage + img} 800w,${preimage + img} 1080w, ${preimage + img} 1536w," class="single-collection-img"></a>`
                }
                document.querySelector(".produvt-img-wrapper.w-inline-block").remove();
                wrapper.insertAdjacentHTML("beforeend", str);

            })
    }


    function sortArrAndAppend(args, array, grid) {
        const months = {
            "Jänner": 1,
            "Februar": 2,
            "März": 3,
            "April": 4,
            "Mai": 5,
            "Juni": 6,
            "Juli": 7,
            "August": 8,
            "September": 9,
            "Oktober": 10,
            "November": 11,
            "Dezember": 12
        }
        switch (args) {
            case "":
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }

                break;
            case "First":
                array.sort((a, b) => {
                    return a
                        .getAttribute("sku")
                        .localeCompare(b.getAttribute("sku"));
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Second":
                array.sort((a, b) => {
                    return b
                        .getAttribute("sku")
                        .localeCompare(a.getAttribute("sku"));
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Third":
                array.sort((a, b) => {
                    return a
                        .getAttribute("randid")
                        .localeCompare(b.getAttribute("randid"));
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Fourth":
                array.sort((a, b) => {
                    return b
                        .getAttribute("randid")
                        .localeCompare(a.getAttribute("randid"));
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Fifth":
                array.sort((a, b) => {
                    const jahr_a = a.getAttribute("jahr")
                    const jahr_b = b.getAttribute("jahr")
                    const monat_a = months[a.getAttribute("monat")]
                    const monat_b = months[b.getAttribute("monat")]
                    const title_a = a.getAttribute("name")
                    const title_b = b.getAttribute("name")
                    if (jahr_a == jahr_b) {
                        if (monat_a == monat_b) {
                            return title_a.localeCompare(title_b)
                        } else {
                            return monat_a > monat_b
                        }
                    } else {
                        return jahr_a > jahr_b
                    }
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Sixth":
                array.sort((a, b) => {
                    const jahr_a = a.getAttribute("jahr")
                    const jahr_b = b.getAttribute("jahr")
                    const monat_a = months[a.getAttribute("monat")]
                    const monat_b = months[b.getAttribute("monat")]
                    const title_a = a.getAttribute("name")
                    const title_b = b.getAttribute("name")
                    if (jahr_a == jahr_b) {
                        if (monat_a == monat_b) {
                            return title_b.localeCompare(title_a)
                        } else {
                            return monat_b > monat_a
                        }
                    } else {
                        return jahr_b > jahr_a
                    }
                });
                grid.innerHTML = "";
                for (const i of array) {
                    grid.appendChild(i);
                }
                break;
        }
    }

    const makePresentation = function makePresentation(event) {
        event.preventDefault()
        const imgs = document.querySelectorAll(".single-collection-img")
        const str = ``

        for (i of imgs) {
            str += `<section style="height: 100vh;background: black; width:100%" data-background-color="black">
                        <img style="margin-top:0;" src="${i.src}">
                   </section>`
        }
        const reveal_div = `
                            <div class="reveal">
                                <div class="slides" style="background: black; width:100%">
                                    ${str}
                                </div>
                            </div>
                            `
        document.body.insertAdjacentHTML("afterbegin", reveal_div)
        const deck = new Reveal({
            touch: true,
            embedded: false,
            help: true,
            width: "100%",
            keyboard: {
                27: () => {
                    deck.destroy()
                    document.querySelector(".reveal").remove()
                }
            }

        })
        deck.configure({
            touch: true,
            help: true,
            controls: true,
        })
        deck.initialize().then()
    }

    const presentationBtn = document.querySelector(".presentation-mode")
    presentationBtn.addEventListener("click", makePresentation)
    const filter = document.querySelector("#Filter-Kollektionen")
    filter.value = ""
    filter.addEventListener("change", () => {
        const arry = Array.from(wrapper.children)
        sortArrAndAppend(event.target.value, arry, wrapper)
    })

})
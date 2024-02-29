document.addEventListener("DOMContentLoaded", async ()=>{
    
    const params = new URLSearchParams(window.location.search)
    const wrapper = document.querySelector(".single-collection-wrapper")
    const name = document.querySelector(".login-head")
    name.innerText = params.get("name")
    if(params.get("name")){
        fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${params.get("name")}`,{
            method : "GET",
            headers : {
                Authorization : sessionStorage.getItem("auth")
            }
        }).then(res=>res.json())
        .then((res)=>{
            res = res.collection
            
            wrapper.innerHTML = ""
            const preimage = "https://res.cloudinary.com/wdy-bzs/image/upload/images/"
            let str = ``
            for(let i=0;i<res.items.length;i++){
                const img = res.items[i].replaceAll("-","_").replaceAll("(", "").replaceAll(")", "")
                str+= `<a href="https://www.bildzeitschrift.com/magazine?productId=${res.items[i]}" class="item-link w-inline-block" randid=${i} name="${res.items[i]}">
                <img src="${preimage+img}"  loading="lazy" sizes="(max-width: 479px) 86vw, (max-width: 767px) 40vw, (max-width: 991px) 27vw, 21vw" alt="" srcset="${preimage+img} 500w, ${preimage+img} 800w,${preimage+img} 1080w, ${preimage+img} 1536w," class="single-collection-img"></a>`
            }
            document.querySelector(".produvt-img-wrapper.w-inline-block").remove();
            wrapper.insertAdjacentHTML("beforeend", str);
            
        })
    } 


    function sortArrAndAppend(args, array, grid) {
        switch (args) {
            case "":
                grid.innerHTML = "";
                for (let i of array) {
                    grid.appendChild(i);
                }

                break;
            case "First":
                array.sort((a, b) => {
                    return a
                        .getAttribute("name")
                        .localeCompare(b.getAttribute("name"));
                });
                grid.innerHTML = "";
                for (let i of array) {
                    grid.appendChild(i);
                }
                break;
            case "Second":
                array.sort((a, b) => {
                    return b
                        .getAttribute("name")
                        .localeCompare(a.getAttribute("name"));
                });
                grid.innerHTML = "";
                for (let i of array) {
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
                for (let i of array) {
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
                for (let i of array) {
                    grid.appendChild(i);
                }
                break;
        }
    }



    const filter = document.querySelector("#Filter-Kollektionen")
    filter.value = ""
    filter.addEventListener("change", ()=>{
        let arry = Array.from(wrapper.children)
        sortArrAndAppend(event.target.value,arry,wrapper)
    })  

})
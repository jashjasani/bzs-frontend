document.addEventListener("DOMContentLoaded", async function () {
    let collections = await fetch(
        "https://bildzeitschrift.netlify.app/.netlify/functions/collection",
        {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth"),
            },
        }
    );
    collections = await collections.json();
    sessionStorage.setItem("collections", JSON.stringify(collections));

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
    window.editPopup = async (event) => {
        const name = event.target.getAttribute("name") || "";
        const cover = event.target.getAttribute("cover") || "";
        const description = event.target.getAttribute("description") || "";

        const output = await Swal.fire({
            title: "Edit collection",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Delete Collection",
            showCloseButton: true,
            html: `
            
                <div class="input-group">
                    <label for="name" class="input-label">Cover Image</label>
                    <div style="width:fit-content;">
                    <div style="position:relative;">
                        <a href="#" style="position: absolute;top: 70%;left: 80%; background-color: #D9D3D0BF;border: 2px solid #2b2a2a; border-radius: 30%;" onclick=newFunction('${name}')>
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" width="30" height="30">
                        </a>
                        <img  width="170" height="143.96" src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${cover}" style="border: 2px solid #2b2a2a; border-radius: 10px;">
                    </div>
                </div>

                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input value="${name}" type="text" id="swal-input1" name="name" placeholder="Enter collection name" class="input-field">
                </div>

                <div class="input-group">
                <label for="description" class="input-label">Description</label>
                <textarea id="swal-input2" name="description" rows="9" placeholder="Enter collection description" class="input-field">${description}</textarea>
                </div>
        
                `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.querySelector("#swal-input1").value,
                    document.querySelector("#swal-input2").value,
                ];
            },
        });
        console.log(output);
        if (output.isConfirmed) {
            fetch(
                "https://bildzeitschrift.netlify.app/.netlify/functions/collection",
                {
                    method: "PUT",
                    headers: {
                        Authorization: sessionStorage.getItem("auth"),
                    },
                    body: JSON.stringify({
                        name: name,
                        update: {
                            $set: {
                                name: output.value[0].trim(),
                                description: output.value[1].trim(),
                            },
                        },
                    }),
                }
            ).then((res) => {
                if (res.status == 200) {
                    event.target.setAttribute("name", output.value[0].trim());
                    event.target.setAttribute("description", output.value[1].trim());
                    console.log(event.currentTarget);
                    if (event.target.tagName == "IMG") {
                        event.target.parentElement.parentElement.querySelector(
                            ".collection_name"
                        ).innerText = output.value[0].trim();
                        event.target.parentElement.setAttribute(
                            "name",
                            output.value[0].trim()
                        );
                        event.target.parentElement.setAttribute(
                            "description",
                            output.value[1].trim()
                        );
                        event.target.parentElement.parentElement.querySelector(
                            "a"
                        ).href =
                            event.target.parentElement.parentElement
                                .querySelector("a")
                                .href.split("=")[0] +
                            "=" +
                            output.value[0].trim();
                        event.target.parentElement.parentElement.setAttribute(
                            "name",
                            output.value[0].trim()
                        );
                    } else {
                        event.target.parentElement.querySelector(
                            ".collection_name"
                        ).innerText = output.value[0].trim();
                        event.target
                            .querySelector("img")
                            .setAttribute("name", output.value[0].trim());
                        event.target
                            .querySelector("img")
                            .setAttribute("description", output.value[1].trim());
                        event.target.parentElement.querySelector("a").href =
                            event.target.parentElement
                                .querySelector("a")
                                .href.split("=")[0] +
                            "=" +
                            output.value[0].trim();
                        event.target.parentElement.parentElement.setAttribute(
                            "name",
                            output.value[0].trim()
                        );
                    }
                }
            });
        } else if (output.isDismissed && output.dismiss == "cancel") {
            fetch(
                `https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${name}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: sessionStorage.getItem("auth"),
                    },
                }
            ).then((res) => {
                if (res.status == 200) {
                    if (event.target.tagName == "IMG") {
                        event.target.parentElement.parentElement.remove();
                    } else {
                        event.target.parentElement.remove();
                    }
                }
            });
        }
    };

    window.newFunction = async (name) => {
        let collection = await fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${name}`,{
            method : "GET",
            headers : {
                Authorization : sessionStorage.getItem("auth")
            }
        })
        let str
        if(collection.ok){
            collection = await collection.json().collection
            for (i of collection.items){
                str += `<img src=https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/images/
                ${i.replaceAll("-","_").replaceAll("(", "").replaceAll(")", "")}>`
            }
            
        }
        let output = await Swal.fire({
            title: "Edit collection",
            showCancelButton: true,
            showConfirmButton:false,
            cancelButtonText: "Cancel",
            width:899,
            html: `
            
                <div class="flex-container">
                   ${str}
                </div>
        
                `,
        });
    };

    const grid = document.querySelector(".w-layout-grid.collections_grid");
    let str = ``;
    for (let i = 0; i < collections.length; i++) {
        str += `
        <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap" randid="${i}" name="${collections[i].name}">
            <a class="ind-item" href="/deine-kollektion?name=${collections[i].name}" style="width:100%;">
                <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${collections[i].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                <div class="collection_name_wrap">
                    <div class="collection_name">${collections[i].name}</div>
                </div>
                <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${collections[i].name}" cover="${collections[i].cover}" description="${collections[i].description}">
                    <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${collections[i].name}" cover="${collections[i].cover}" description="${collections[i].description}">
                </a>
            </a>
        </div>
        `;
    }
    grid.insertAdjacentHTML("beforeend", str);
    document.querySelector(".produvt-img-wrapper.w-inline-block").remove();

    const filter = document
        .getElementById("Filter-Kollektionen")
    filter.value = ""
    filter.addEventListener("change", (event) => {
            const grid = document.querySelector(
                ".w-layout-grid.collections_grid"
            );
            let array = Array.from(grid.children);
            console.log(array);
            sortArrAndAppend(event.target.value, array, grid);
        });

    document.querySelector(".button.new-collection.w-inline-block").addEventListener("click",async function () {
        const output = await Swal.fire({
            title: "New collection",
            showCancelButton: true,
            confirmButtonText: "Save",
        
            showCloseButton: true,
            html: `
            </div>
            <div class="input-group">
            <label for="name" class="input-label">Name*</label>
            <input type="text" id="swal-input1" name="name" placeholder="Enter collection name" class="input-field">
            </div>

            <div class="input-group">
            <label for="description" class="input-label">Description</label>
            <textarea id="swal-input2" name="description" rows="9" placeholder="Enter collection description" class="input-field"></textarea>
            </div>
    
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.querySelector("#swal-input1").value,
                    document.querySelector("#swal-input2").value,
                ];
            },
        });
        if(output.isConfirmed){
            fetch(
                "https://bildzeitschrift.netlify.app/.netlify/functions/collection",
                {
                    method: "POST",
                    headers: {
                        Authorization: sessionStorage.getItem("auth"),
                    },
                    body: JSON.stringify({
                        name: output.value[0].trim(),
                        description: output.value[1].trim(),
                    }),
                }
            ).then((res) => {
                if (res.ok) {
                    const grid = document.querySelector(
                        ".w-layout-grid.collections_grid"
                    );
                    let array = Array.from(grid.children);
                    const div = document.createElement("div");
                    div.className = "collection_item_wrap";
                    div.setAttribute("randid", document.querySelectorAll("[randid]").length);
                    div.setAttribute("name", output.value[0].trim());
                    div.innerHTML = `
                                        <a class="ind-item" href="/deine-kollektion?name=${output.value[0].trim()}" style="width:100%;">
                                        <img src="" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                                        <div class="collection_name_wrap">
                                            <div class="collection_name">${output.value[0].trim()}</div>
                                        </div>
                                        <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${output.value[0].trim()}" cover="" description="${output.value[1].trim()}">
                                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${output.value[0].trim()}" cover="" description="${output.value[1].trim()}">
                                        </a>
                                        </a>
                        `;
                    array.push(div);
                    const value = document.getElementById(
                        "Filter-Kollektionen"
                    ).value;
                    sortArrAndAppend(value, array, grid);
                }
            });
        }
        
    });
});

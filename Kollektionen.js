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

    window.editPopup = async (event) => {

        const name = event.target.getAttribute("name") || ''
        const cover = event.target.getAttribute("cover") || ''
        const description = event.target.getAttribute("description") || ''
        await Swal.fire({
            title: "Edit collection",
            showCancelButton: true,
            confirmButtonText: "Delete collection",
            cancelButtonText: "Save",
            html: `
            
                <div class="input-group">
                    <label for="name" class="input-label">Cover Image</label>
                    <div style="width:fit-content;">
                    <div style="position:relative;">
                        <a href="#" style="position: absolute;top: 70%;left: 80%; background-color: #D9D3D0BF;border: 2px solid #2b2a2a; border-radius: 30%;">
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" width="30" height="30">
                        </a>
                        <img  width="170" height="143.96" src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${cover}" style="border: 2px solid #2b2a2a; border-radius: 10px;">
                    </div>
                </div>

                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input value=${name} type="text" id="name" name="name" placeholder="Enter collection name" class="input-field">
                </div>

                <div class="input-group">
                <label for="description" class="input-label">Description</label>
                <textarea value=${description} id="description" name="description" rows="9" placeholder="Enter collection description" class="input-field"></textarea>
                </div>
        
                `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                ];
            },
        });
    };

    const grid = document.querySelector(".w-layout-grid.collections_grid");
    let str = ``;
    for (let i = 0; i < collections.length; i++) {
        str += `
        <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap">
            <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${collections[i].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
            <div class="collection_name_wrap">
                <div class="collection_name">${collections[i].name}</div>
            </div>
            <a href="#" class="edit_collection w-inline-block" onclick="editPopup(event)" name="${collections[i].name}" cover="${collections[i].cover}" description="${collections[i].description}">
                <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="">
            </a>
        </div>
        `;
    }
    grid.insertAdjacentHTML("beforeend", str);
});

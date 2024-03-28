document.addEventListener("DOMContentLoaded",async function(){var t;let a=await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection",{method:"GET",headers:{Authorization:sessionStorage.getItem("auth")}});function n(e,t,i){switch(e){case"":i.innerHTML="";for(var a of t)i.appendChild(a);break;case"First":t.sort((e,t)=>e.getAttribute("name").localeCompare(t.getAttribute("name"))),i.innerHTML="";for(var n of t)i.appendChild(n);break;case"Second":t.sort((e,t)=>t.getAttribute("name").localeCompare(e.getAttribute("name"))),i.innerHTML="";for(var l of t)i.appendChild(l);break;case"Third":t.sort((e,t)=>e.getAttribute("randid").localeCompare(t.getAttribute("randid"))),i.innerHTML="";for(var r of t)i.appendChild(r);break;case"Fourth":t.sort((e,t)=>t.getAttribute("randid").localeCompare(e.getAttribute("randid"))),i.innerHTML="";for(var o of t)i.appendChild(o)}}t=(a=await a.json()).subscription,a=a.collections,sessionStorage.setItem("collections",JSON.stringify(a)),window.editPopup=async t=>{var e=t.target.getAttribute("name")||"",i=t.target.getAttribute("cover")||"",a=t.target.getAttribute("description")||"";console.log(e);const n=await Swal.fire({title:"Kollektion bearbeiten",showCancelButton:!0,confirmButtonText:"Speichern",cancelButtonText:"Kollektion löschen",showCloseButton:!0,html:`
            
                <div class="input-group">
                    <label for="name" class="input-label">Titelbild</label>
                    <div style="width:fit-content;">
                    <div style="position:relative;">
                        <a href="#" style="position: absolute;top: 70%;left: 80%; background-color: #D9D3D0BF;border: 2px solid #2b2a2a; border-radius: 30%;" onclick="newFunction('${e.toString()}')">
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" width="30" height="30">
                        </a>
                        <img  width="170" height="143.96" src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${i}" style="border: 2px solid #2b2a2a; border-radius: 10px;">
                    </div>
                </div>

                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input value="${e}" type="text" id="swal-input1" name="name" placeholder="Name deiner Kollektion" class="input-field">
                </div>

                <div class="input-group">
                <label for="description" class="input-label">Beschreibung</label>
                <textarea id="swal-input2" name="description" rows="9" placeholder="Hier kannst du eine Beschreibung deiner Kollektion eintragen" class="input-field">${a}</textarea>
                </div>
        
                `,focusConfirm:!1,preConfirm:()=>[document.querySelector("#swal-input1").value,document.querySelector("#swal-input2").value]});console.log(n),n.isConfirmed?fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection",{method:"PUT",headers:{Authorization:sessionStorage.getItem("auth")},body:JSON.stringify({name:e,update:{$set:{name:n.value[0].trim(),description:n.value[1].trim()}}})}).then(e=>{200==e.status&&(t.target.setAttribute("name",n.value[0].trim()),t.target.setAttribute("description",n.value[1].trim()),console.log(t.currentTarget),"IMG"==t.target.tagName?(t.target.parentElement.parentElement.querySelector(".collection_name").innerText=n.value[0].trim(),t.target.parentElement.setAttribute("name",n.value[0].trim()),t.target.parentElement.setAttribute("description",n.value[1].trim()),t.target.parentElement.parentElement.querySelector("a").href=t.target.parentElement.parentElement.querySelector("a").href.split("=")[0]+"="+n.value[0].trim()):(t.target.parentElement.querySelector(".collection_name").innerText=n.value[0].trim(),t.target.querySelector("img").setAttribute("name",n.value[0].trim()),t.target.querySelector("img").setAttribute("description",n.value[1].trim()),t.target.parentElement.querySelector("a").href=t.target.parentElement.querySelector("a").href.split("=")[0]+"="+n.value[0].trim()),t.target.parentElement.parentElement.setAttribute("name",n.value[0].trim()))}):n.isDismissed&&"cancel"==n.dismiss&&fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection?name="+e,{method:"DELETE",headers:{Authorization:sessionStorage.getItem("auth")}}).then(e=>{200==e.status&&("IMG"==t.target.tagName?t.target.parentElement:t.target).parentElement.remove()})},window.changeCover=async(t,i)=>{fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection",{method:"PUT",headers:{Authorization:sessionStorage.getItem("auth")},body:JSON.stringify({name:t,update:{$set:{cover:i}}})}).then(e=>{e.ok&&(Swal.close(),(e=document.querySelectorAll(`[name='${t}']`))[0].querySelector("img").src=e[0].querySelector("img").src.split("images")[0]+i,e[1].setAttribute("cover",i),e[2].setAttribute("cover",i))})},window.newFunction=async e=>{let t=await fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection?name="+e,{method:"GET",headers:{Authorization:sessionStorage.getItem("auth")}}),a="";if(t.ok){t=await t.json(),console.log(t);for(i of t.collection.items)a+=`<img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/images/${i.replaceAll("-","_").replaceAll("(","").replaceAll(")","")}" onclick="changeCover('${e}','images/${i.replaceAll("-","_").replaceAll("(","").replaceAll(")","")}')">`}await Swal.fire({title:"Change your cover image",showCancelButton:!0,showConfirmButton:!1,cancelButtonText:"Cancel",width:899,html:`
            
                <div class="flex-container">
                   ${a}
                </div>
        
                `})};var e=document.querySelector(".w-layout-grid.collections_grid");let l="";for(let e=0;e<a.length;e++)null!=t&&"Inspiration"==t.plan?l+=`
                <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap" randid="${e}" name="${a[e].name}">
                    <a class="ind-item" href="/deine-kollektion?name=${a[e].name}" style="width:100%;">
                        <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${a[e].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                        <div class="collection_name_wrap">
                            <div class="collection_name">${a[e].name}</div>
                        </div>
                        <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${a[e].name}" cover="${a[e].cover}" description="${a[e].description}">
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${a[e].name}" cover="${a[e].cover}" description="${a[e].description}">
                        </a>
                    </a>
                </div>
                `:l+=`
                <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap" randid="${e}" name="${a[e].name}">
                    <a class="ind-item" href="/deine-kollektion?name=${a[e].name}" style="width:100%;">
                        <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${a[e].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                        <div class="collection_name_wrap">
                            <div class="collection_name">${a[e].name}</div>
                        </div>
                    </a>
                </div>
                `;e.insertAdjacentHTML("beforeend",l),document.querySelector(".produvt-img-wrapper.w-inline-block").remove();e=document.getElementById("Filter-Kollektionen");e.value="",e.addEventListener("change",e=>{var t=document.querySelector(".w-layout-grid.collections_grid"),i=Array.from(t.children);console.log(i),n(e.target.value,i,t)}),null!=t&&"Inspiration"==t.plan&&document.querySelector(".button-collection.new-collection.w-inline-block").addEventListener("click",async function(){const a=await Swal.fire({title:"Neue Kollektion",showCancelButton:!0,confirmButtonText:"Speichern",cancelButtonText:"Abbrechen",showCloseButton:!0,html:`
                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input type="text" id="swal-input1" name="name" placeholder="Name deiner Kollektion" class="input-field">
                </div>
    
                <div class="input-group">
                <label for="description" class="input-label">Beschreibung</label>
                <textarea id="swal-input2" name="description" rows="9" placeholder="Hier kannst du eine Beschreibung deiner Kollektion eintragen" class="input-field"></textarea>
                </div>
        
                `,focusConfirm:!1,preConfirm:()=>[document.querySelector("#swal-input1").value,document.querySelector("#swal-input2").value]});a.isConfirmed&&fetch("https://bildzeitschrift.netlify.app/.netlify/functions/collection",{method:"POST",headers:{Authorization:sessionStorage.getItem("auth")},body:JSON.stringify({name:a.value[0].trim(),description:a.value[1].trim()})}).then(e=>{var t,i;e.ok&&(e=document.querySelector(".w-layout-grid.collections_grid"),t=Array.from(e.children),(i=document.createElement("div")).className="collection_item_wrap",i.setAttribute("randid",document.querySelectorAll("[randid]").length),i.setAttribute("name",a.value[0].trim()),i.innerHTML=`
                                            <a class="ind-item" href="/deine-kollektion?name=${a.value[0].trim()}" style="width:100%;">
                                            <img src="" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                                            <div class="collection_name_wrap">
                                                <div class="collection_name">${a.value[0].trim()}</div>
                                            </div>
                                            <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${a.value[0].trim()}" cover="" description="${a.value[1].trim()}">
                                                <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${a.value[0].trim()}" cover="" description="${a.value[1].trim()}">
                                            </a>
                                            </a>
                            `,t.push(i),n(document.getElementById("Filter-Kollektionen").value,t,e))})})});
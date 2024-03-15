document.addEventListener('DOMContentLoaded',async function(){let A;let _=await fetch('https://bildzeitschrift.netlify.app/.netlify/functions/collection',{method:'GET',headers:{Authorization:sessionStorage.getItem('auth')}});_=await _.json();A=_.subscription;_=_.collections;sessionStorage.setItem('collections',JSON.stringify(_));function c(B,C,_c){switch(B) {case '':_c.innerHTML='';for(let i of C)_c.appendChild(i);break;case 'First':C.sort((a,b)=>a.getAttribute('name').localeCompare(b.getAttribute('name')));_c.innerHTML='';for(let i of C)_c.appendChild(i);break;case 'Second':C.sort((a,b)=>b.getAttribute('name').localeCompare(a.getAttribute('name')));_c.innerHTML='';for(let i of C)_c.appendChild(i);break;case 'Third':C.sort((a,b)=>a.getAttribute('randid').localeCompare(b.getAttribute('randid')));_c.innerHTML='';for(let i of C)_c.appendChild(i);break;case 'Fourth':C.sort((a,b)=>b.getAttribute('randid').localeCompare(a.getAttribute('randid')));_c.innerHTML='';for(let i of C)_c.appendChild(i);break}}window.editPopup=async _a=>{var _b=_a.target.getAttribute('name')||'',D=_a.target.getAttribute('cover')||'',_d=_a.target.getAttribute('description')||'';console.log(_b);var E=await Swal.fire({title:'Edit collection',showCancelButton:!0,confirmButtonText:'Save',cancelButtonText:'Delete Collection',showCloseButton:!0,html:`
            
                <div class="input-group">
                    <label for="name" class="input-label">Cover Image</label>
                    <div style="width:fit-content;">
                    <div style="position:relative;">
                        <a href="#" style="position: absolute;top: 70%;left: 80%; background-color: #D9D3D0BF;border: 2px solid #2b2a2a; border-radius: 30%;" onclick="newFunction('${`${_b}`}')">
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" width="30" height="30">
                        </a>
                        <img  width="170" height="143.96" src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${D}" style="border: 2px solid #2b2a2a; border-radius: 10px;">
                    </div>
                </div>

                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input value="${_b}" type="text" id="swal-input1" name="name" placeholder="Enter collection name" class="input-field">
                </div>

                <div class="input-group">
                <label for="description" class="input-label">Description</label>
                <textarea id="swal-input2" name="description" rows="9" placeholder="Enter collection description" class="input-field">${_d}</textarea>
                </div>
        
                `,focusConfirm:!1,preConfirm:()=>[document.querySelector('#swal-input1').value,document.querySelector('#swal-input2').value]});console.log(E);E.isConfirmed?fetch('https://bildzeitschrift.netlify.app/.netlify/functions/collection',{method:'PUT',headers:{Authorization:sessionStorage.getItem('auth')},body:JSON.stringify({name:_b,update:{$set:{name:E.value[0].trim(),description:E.value[1].trim()}}})}).then(_A=>_A.status==200&&(_a.target.setAttribute('name',E.value[0].trim()),_a.target.setAttribute('description',E.value[1].trim()),console.log(_a.currentTarget),_a.target.tagName=='IMG'?(_a.target.parentElement.parentElement.querySelector('.collection_name').innerText=E.value[0].trim(),_a.target.parentElement.setAttribute('name',E.value[0].trim()),_a.target.parentElement.setAttribute('description',E.value[1].trim()),_a.target.parentElement.parentElement.querySelector('a').href=_a.target.parentElement.parentElement.querySelector('a').href.split('=')[0]+'='+E.value[0].trim(),_a.target.parentElement.parentElement.setAttribute('name',E.value[0].trim())):(_a.target.parentElement.querySelector('.collection_name').innerText=E.value[0].trim(),_a.target.querySelector('img').setAttribute('name',E.value[0].trim()),_a.target.querySelector('img').setAttribute('description',E.value[1].trim()),_a.target.parentElement.querySelector('a').href=_a.target.parentElement.querySelector('a').href.split('=')[0]+'='+E.value[0].trim(),_a.target.parentElement.parentElement.setAttribute('name',E.value[0].trim())))):E.isDismissed&&E.dismiss=='cancel'&&fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${_b}`,{method:'DELETE',headers:{Authorization:sessionStorage.getItem('auth')}}).then(aA=>aA.status==200&&(_a.target.tagName=='IMG'?_a.target.parentElement.parentElement.remove():_a.target.parentElement.remove()))};window.changeCover=(aB,_B)=>fetch('https://bildzeitschrift.netlify.app/.netlify/functions/collection',{method:'PUT',headers:{Authorization:sessionStorage.getItem('auth')},body:JSON.stringify({name:aB,update:{$set:{cover:_B}}})}).then(aC=>{if(aC.ok){var aD=document.querySelectorAll(`[name='${aB}']`);aD[0].querySelector('img').src=aD[0].querySelector('img').src.split('images')[0]+_B;aD[1].setAttribute('cover',_B);aD[2].setAttribute('cover',_B);Swal.close()}});window.newFunction=async aE=>{let aF=await fetch(`https://bildzeitschrift.netlify.app/.netlify/functions/collection?name=${aE}`,{method:'GET',headers:{Authorization:sessionStorage.getItem('auth')}});let _C='';if(aF.ok){aF=await aF.json();console.log(aF);for(i of aF.collection.items)_C+=`<img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/images/${i.replaceAll('-','_').replaceAll('(','').replaceAll(')','')}" onclick="changeCover('${aE}','images/${i.replaceAll('-','_').replaceAll('(','').replaceAll(')','')}')">`}};var d=document.querySelector('.w-layout-grid.collections_grid'),e=document.getElementById('Filter-Kollektionen');for(let i=0;i<_.length;i++)A!=null?str+=`
                <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap" randid="${i}" name="${_[i].name}">
                    <a class="ind-item" href="/deine-kollektion?name=${_[i].name}" style="width:100%;">
                        <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${_[i].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                        <div class="collection_name_wrap">
                            <div class="collection_name">${_[i].name}</div>
                        </div>
                        <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${_[i].name}" cover="${_[i].cover}" description="${_[i].description}">
                            <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${_[i].name}" cover="${_[i].cover}" description="${_[i].description}">
                        </a>
                    </a>
                </div>
                `:str+=`
                <div id="w-node-e8b86883-e4ee-3e9f-6cb2-5bcaff841f2e-0588ddf5" class="collection_item_wrap" randid="${i}" name="${_[i].name}">
                    <a class="ind-item" href="/deine-kollektion?name=${_[i].name}" style="width:100%;">
                        <img src="https://res.cloudinary.com/wdy-bzs/image/upload/q_10/v1651695832/${_[i].cover}" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                        <div class="collection_name_wrap">
                            <div class="collection_name">${_[i].name}</div>
                        </div>
                    </a>
                </div>
                `;d.insertAdjacentHTML('beforeend',``);document.querySelector('.produvt-img-wrapper.w-inline-block').remove();e.value='';e.addEventListener('change',aG=>{var aH=document.querySelector('.w-layout-grid.collections_grid');let aI=[...aH.children];console.log(aI);c(aG.target.value,aI,aH)});A!=null&&document.querySelector('.button.new-collection.w-inline-block').addEventListener('click',async function(){var aJ=await Swal.fire({title:'New collection',showCancelButton:!0,confirmButtonText:'Save',showCloseButton:!0,html:`
                </div>
                <div class="input-group">
                <label for="name" class="input-label">Name*</label>
                <input type="text" id="swal-input1" name="name" placeholder="Enter collection name" class="input-field">
                </div>
    
                <div class="input-group">
                <label for="description" class="input-label">Description</label>
                <textarea id="swal-input2" name="description" rows="9" placeholder="Enter collection description" class="input-field"></textarea>
                </div>
        
                `,focusConfirm:!1,preConfirm:()=>[document.querySelector('#swal-input1').value,document.querySelector('#swal-input2').value]});if(aJ.isConfirmed)fetch('https://bildzeitschrift.netlify.app/.netlify/functions/collection',{method:'POST',headers:{Authorization:sessionStorage.getItem('auth')},body:JSON.stringify({name:aJ.value[0].trim(),description:aJ.value[1].trim()})}).then(aK=>{if(aK.ok){var aL=document.querySelector('.w-layout-grid.collections_grid'),aM=document.createElement('div'),_D=document.getElementById('Filter-Kollektionen').value;let aN=[...aL.children];aM.className='collection_item_wrap';aM.setAttribute('randid',document.querySelectorAll('[randid]').length);aM.setAttribute('name',aJ.value[0].trim());aM.innerHTML=`
                                            <a class="ind-item" href="/deine-kollektion?name=${aJ.value[0].trim()}" style="width:100%;">
                                            <img src="" loading="lazy" sizes="(max-width: 479px) 89vw, (max-width: 767px) 85vw, 86vw" srcset="" alt="" class="collection_main_img">
                                            <div class="collection_name_wrap">
                                                <div class="collection_name">${aJ.value[0].trim()}</div>
                                            </div>
                                            <a class="edit_collection w-inline-block" onclick="editPopup(event)" name="${aJ.value[0].trim()}" cover="" description="${aJ.value[1].trim()}">
                                                <img src="https://assets-global.website-files.com/6235c6aa0b614c4ab6ba68bb/65d3097fa566affb7bf94719_Edit-Square.svg" loading="lazy" alt="" name="${aJ.value[0].trim()}" cover="" description="${aJ.value[1].trim()}">
                                            </a>
                                            </a>
                            `;aN.push(aM);c(_D,aN,aL)}})})});

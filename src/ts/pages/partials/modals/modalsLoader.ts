import backdrop from "./backdrop";
import modalMoreDetails from "./modalMoreDetails";

export default function modalsLoader(elementRefAppwnd:HTMLElement){
    elementRefAppwnd.insertAdjacentHTML("afterend",modalMoreDetails());
    elementRefAppwnd.insertAdjacentHTML("afterend",backdrop());

    //add event close modals on backdrop click
    document.body.querySelector(".backdrop")?.addEventListener("click",function(){
        hideAllModals();
        hideBackDrop();
    });

    //add event close modal on click close icon
    document.body.querySelectorAll(".modal .close").forEach(modalIconClose=>{
        modalIconClose.addEventListener("click",function(e){
            let modalParent = (e.target as HTMLDivElement).closest(".modal");
            modalParent?.classList.remove("show");
            hideBackDrop();
        });
    });
}

export function showBackDrop(){
    document.body.querySelector(".backdrop")?.classList.remove("d-none");
}

export function hideBackDrop(){
    document.body.querySelector(".backdrop")?.classList.add("d-none");
}

export function openModalMoreDetails():HTMLElement{
    let htmlElement = document.body.querySelector(".modal-more-details") as HTMLElement;
    document.body.querySelector(".modal-more-details")?.classList.add("show");
    return htmlElement;
}

export function hideModalMoreDetails(){
    document.body.querySelector(".modal-more-details")?.classList.remove("show");
}

function hideAllModals(){
    document.body.querySelectorAll(".modal").forEach(modal=>{
        modal.classList.remove("show");
    })
}
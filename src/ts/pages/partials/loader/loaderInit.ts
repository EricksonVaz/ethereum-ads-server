import { hideBackDrop, showBackDrop } from "../modals/modalsLoader";
import loader from "./loader";

export default function loaderInit(elementRefAppwnd:HTMLElement){
    elementRefAppwnd.insertAdjacentHTML("afterend",loader());
}

export function showLoader(){
    showBackDrop();
    document.body.querySelector(".loader-container")?.classList.remove("d-none");
}

export function hideLoader(){
    hideBackDrop();
    document.body.querySelector(".loader-container")?.classList.add("d-none");
}
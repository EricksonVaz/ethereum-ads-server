import backdrop from "./backdrop";
import modalMoreDetails from "./modalMoreDetails";

export default function modalsLoader(elementRefAppwnd:HTMLElement){
    elementRefAppwnd.insertAdjacentHTML("afterend",modalMoreDetails());
    elementRefAppwnd.insertAdjacentHTML("afterend",backdrop());
}
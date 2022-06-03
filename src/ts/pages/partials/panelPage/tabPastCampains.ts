import pubCardTemplate from "./pubCardTemplate";

export default function tabPastCampains(){
    let addsCards = "";
    for(let i=1;i<=10;i++){
        addsCards+=pubCardTemplate(`Pub Num#${i}`,`${Math.ceil(Math.random()*10)}`,`${Math.ceil(Math.random()*100)}`);
    }
    return `
        <div class="tab-pane past pub-list hide" id="past-campains">
            ${addsCards}
        </div>
    `;
}
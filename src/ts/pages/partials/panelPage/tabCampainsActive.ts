import pubCardTemplate from "./pubCardTemplate";

export default function tabCampainsActive(){
    let addsCards = "";
    for(let i=1;i<=10;i++){
        addsCards+=pubCardTemplate(`Pub Num#${i}`,`${Math.ceil(Math.random()*10)}`,`${Math.ceil(Math.random()*100)}`);
    }
    return `
        <div class="tab-pane pub-list hide" id="campains-active">
            ${addsCards}
        </div>
    `;
}
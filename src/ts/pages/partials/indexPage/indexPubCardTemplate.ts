import User from "../../../models/user";

const pubImages = new URL("../../../../img/pubimag.png?as=webp&width=100px",import.meta.url);
export default function indexPubCardTemplate(id:string,name:string,totalViews:string){
    return `
        <div class="pub-card" data-pub-id="${id}">
            <img src="${pubImages}" alt="default img">
            <h3>${name}</h3>
            <div class="goal-pub">
                <span class="label-goal">Total Views</span>
                <span class="count-pub-views">${totalViews}</span>
            </div>
            ${(function(){
                if(User.isUserLogged()){
                    return `<button type="button" class="btn-earn">Watch to Earn</button>`;
                }
                return `<button type="button" class="btn-earn" data-href="/login">Login to Earn</button>`;
            })()}
            
        </div>
    `;
}
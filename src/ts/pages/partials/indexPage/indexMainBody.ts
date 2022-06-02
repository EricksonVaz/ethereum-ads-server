const pubImages = new URL("../../../../img/pubimag.png?as=webp&width=100px",import.meta.url);
export default function indexMainBody(){
    let addsCards = "";
    for(let i=1;i<=10;i++){
        addsCards+=`
            <div class="pub-card">
                <img src="${pubImages}" alt="default img">
                <h3>Pub Num #${i}</h3>
                <div class="goal-pub">
                    <span class="label-goal">Total Views</span>
                    <span class="count-pub-views">3</span>
                </div>
                <button type="button" class="btn-earn">Watch to Earn</button>
            </div>
        `;
    }
    return `
        <main class="main-body">
            <h2 class="app-title">
                Ethereum Blockchain Server Advertisings
            </h2>
            <div class="pub-list">
                ${addsCards}
            </div>
        </main>
    `;
}
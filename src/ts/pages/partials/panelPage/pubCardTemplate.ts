const pubImages = new URL("../../../../img/pubimag.png?as=webp&width=100px",import.meta.url);
export default function pubCardTemplate(name:string,totalViews:string){
    return `
        <div class="pub-card">
            <img src="${pubImages}" alt="default img">
            <h3>${name}</h3>
            <div class="goal-pub">
                <span class="label-goal">Total Views</span>
                <span class="count-pub-views">${totalViews}</span>
            </div>
            <button type="button" class="btn-earn">Mais Detalhes</button>
        </div>
    `;
}
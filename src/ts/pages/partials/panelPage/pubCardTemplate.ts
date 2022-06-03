const pubImages = new URL("../../../../img/pubimag.png?as=webp&width=100px",import.meta.url);
const deleteIcon = new URL("../../../../img/delete.png?as=webp&width=30px",import.meta.url);
const editIcon = new URL("../../../../img/edit.png?as=webp&width=30px",import.meta.url);
export default function pubCardTemplate(name:string,totalViews:string,idPub:string){
    return `
        <div class="pub-card" data-pub-id="${idPub}">
            <img src="${pubImages}" alt="default img">
            <h3>${name}</h3>
            <div class="goal-pub">
                <span class="label-goal">Total Views</span>
                <span class="count-pub-views">${totalViews}</span>
            </div>
            <button type="button" class="btn-earn">Mais Detalhes</button>
            <div class="more-action-buttons">
                <button type="button" class="btn-action del">
                    <img src="${deleteIcon}" class="del" alt="icon delete">
                </button>
                <button type="button" class="btn-action edit">
                    <img src="${editIcon}" class="edit" alt="icon edit">
                </button>
            </div>
        </div>
    `;
}
import tabCampainsActive from "./tabCampainsActive";
import tabCreateCampain from "./tabCreateCampain";
import tabPastCampains from "./tabPastCampains";

export default function tabsBtnGroup(){
    return `
        <div class="tabs-container">
            <div class="tabs-btn-group">
                <button type="button" class="tab-btn active" data-tab="create-campain">Criar Campanha</button>
                <button type="button" class="tab-btn" data-tab="campains-active">Campanhas Activas</button>
                <button type="button" class="tab-btn" data-tab="past-campains">Campanhas Enceradas</button>
            </div>
            <div class="tab-pane-container">
                ${tabCreateCampain()}
                ${tabCampainsActive()}
                ${tabPastCampains()}
            </div>
        </div>
    `;
}
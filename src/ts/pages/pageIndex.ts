import swal from "sweetalert";
import Campaigns from "../models/campaigns";
import Router from "../router";
import ICampaings from "../utils/interfaces/ICampaing";
import IFormError from "../utils/interfaces/iFormError";
import PageBase from "./pageBase";
import indexMainBody from "./partials/indexPage/indexMainBody";
import indexPubCardTemplate from "./partials/indexPage/indexPubCardTemplate";
import { hideLoader, showLoader } from "./partials/loader/loaderInit";
import { hideBackDrop, hideModalMoreDetails, openModalMoreDetails, showBackDrop } from "./partials/modals/modalsLoader";
import navMenu from "./partials/navMenu";

export default class PageIndex extends PageBase{
    static readonly rootPageId = "index-page";
    private pubListContainer?:HTMLDivElement;
    private static pageIndex?:PageIndex;
    private idInterval?:NodeJS.Timeout;
    constructor(){
        super(PageIndex.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+indexMainBody());
        this.pubListContainer = this.rootElementPageContainer?.querySelector(".pub-list")!;
        PageIndex.pageIndex = this;
        this.loadListPub();
        return this;
    }

    private loadListPub(){
        this.pubListContainer!.innerHTML ="";
        showLoader();
        Campaigns.listAllValidCaimpaings()
        .then(resp=>{
            PageIndex.renderCampaing(this.pubListContainer!,resp);
        })
        .catch(console.log)
        .finally(hideLoader);
    }

    private postRenderAddNavigation(){
        this.pubListContainer?.querySelectorAll(".btn-earn").forEach((link)=>{
            link.addEventListener("click",(e)=>{
                let buttonClicked = e.target as HTMLButtonElement;
                if(buttonClicked.matches("[data-href]"))Router.router.onNavClickLink(e);
                else{
                    let idPub = buttonClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId || 0;
                    this.openModalWatchToEarn(+idPub);
                }
            });
        });
    }

    private static renderCampaing(tabElement:HTMLDivElement,respObj:ICampaings[]|IFormError[]){
        if(respObj.length && "tvm" in respObj[0]){
            let campaigns = respObj as ICampaings[];
            for (const campaing of campaigns) {
                tabElement.innerHTML += indexPubCardTemplate(campaing.id,campaing.name,campaing.totalview);
            }
            PageIndex.pageIndex!.postRenderAddNavigation();
        }else{
            tabElement.innerHTML = `<h2>Nenhuma campanha disponivel para assisitir</h2>`;
        }
    }

    private openModalWatchToEarn(id:number){
        showLoader();
        Campaigns.getCampaingInfo(id)
        .then(resp=>{
            let modalElement = openModalMoreDetails();
            let modalTitle = modalElement.querySelector(".modal-title")!;
            let modalDesc = modalElement.querySelector(".modal-body")!
            if(!Array.isArray(resp)){ 
                modalTitle.innerHTML = `${resp.name} - View ${resp.totalview} / ${resp.goalview}`;
                modalDesc.innerHTML = `
                    <div style="margin-bottom:1rem">
                        ${resp.description}
                    </div>
                `;
                modalDesc.insertAdjacentHTML("beforeend",`
                    <div class="container-earn">
                    </div>
                `);
                let timeCount = 0;
                let idBtnEarn = Math.random().toString(16);
                let tvm = <unknown>resp.tvm as number;
                this.idInterval = setInterval(()=>{
                    timeCount++;
                    if(timeCount>=(+resp.tvm)){
                        modalDesc.querySelector(".container-earn")!.innerHTML = `
                            <button type="button" class="btn-earn btn-${idBtnEarn}">
                                Click To Earn
                            </button>
                        `;
                        clearInterval(this.idInterval);
                        return;
                    }
                    modalDesc.querySelector(".container-earn")!.innerHTML = `
                        <button type="button" class="btn-earn">
                            ${(tvm--)} S
                        </button>
                    `;
                },1000);

                this.actionWatchCampaing(modalDesc,idBtnEarn,id);
            }else{
                modalTitle.innerHTML = "";
                modalDesc.innerHTML = "Erro ao carregar a campanha";
            }
        })
        .catch(console.log)
        .finally(()=>{
            hideLoader();
            showBackDrop();
        });
    }

    private actionWatchCampaing(modalDesc:Element,idBtnEarn:string,id:number){
        modalDesc.addEventListener("click",(e)=>{
            let elementClicked = e.target as HTMLElement;
            if(elementClicked.classList.contains(`btn-${idBtnEarn}`)){
                showLoader();
                Campaigns.watchCampaing(id)
                .then((resp)=>{
                    if(resp==true){
                        this.loadListPub();
                        swal({
                            title: "Feito!!!",
                            text: "Obrigado por assistir esta campanha",
                            icon: "success",
                        });
                    }else{
                        swal({
                            title: "Erro!!!",
                            text: "Não foi possivel assistir a campanha",
                            icon: "error",
                        });
                    }
                })
                .catch(console.log)
                .finally(()=>{
                    hideLoader()
                    hideBackDrop()
                    hideModalMoreDetails();
                });
            }
        });
    }
}
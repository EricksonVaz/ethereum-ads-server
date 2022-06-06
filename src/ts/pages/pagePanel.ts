import PageBase from "./pageBase";
import { openModalMoreDetails, showBackDrop } from "./partials/modals/modalsLoader";
import navMenu from "./partials/navMenu";
import tabsBtnGroup from "./partials/panelPage/tabsBtnGroup";
import swal from 'sweetalert';
import { hideLoader, showLoader } from "./partials/loader/loaderInit";
import Campaigns from "../models/campaigns";
import formSetFeedback from "../utils/formSetFeedback";
import IFormError from "../utils/interfaces/iFormError";
import ICampaings from "../utils/interfaces/ICampaing";
import pubCardTemplate from "./partials/panelPage/pubCardTemplate";

export default class PagePanel extends PageBase{
    static readonly rootPageId = "panel-page";
    private formEditCampain?:HTMLFormElement;
    private formCreateCampain?:HTMLFormElement;
    private campaingsActiveTab?:HTMLDivElement;
    private campaingsInactiveTab?:HTMLDivElement;
    private currentTabActive:string = "create-campain";

    constructor(){
        super(PagePanel.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+tabsBtnGroup());

        this.formEditCampain = this.rootElementPageContainer!.querySelector<HTMLFormElement>(".form-edit-campain")!;
        this.formCreateCampain = this.rootElementPageContainer!.querySelector<HTMLFormElement>(".form-create-campain")!;
        this.campaingsActiveTab = this.rootElementPageContainer!.querySelector<HTMLDivElement>("#campains-active")!;
        this.campaingsInactiveTab = this.rootElementPageContainer!.querySelector<HTMLDivElement>("#past-campains")!;

        this.addEventToggleTabs();
        this.openModalShowDetails();
        this.addEventCreateNewCampain();
        this.addEventCancelEditCampain();
        this.addEventEditCampain();

        return this;
    }

    private addEventToggleTabs(){
        this.rootElementPageContainer!.querySelectorAll(".tab-btn")?.forEach(tabsButton=>{
            (tabsButton as HTMLButtonElement).addEventListener("click",()=>{
                let parentElement = tabsButton.parentElement;
                let tabToShow = (tabsButton as HTMLButtonElement).dataset.tab;

                parentElement?.querySelector(".tab-btn.active")?.classList.remove("active");
                tabsButton.classList.add("active");
                this.rootElementPageContainer!.querySelector(".tab-pane:not(.hide)")?.classList.add("hide");
                this.rootElementPageContainer!.querySelector("#"+tabToShow)?.classList.remove("hide");

                if(tabToShow === "campains-active"){
                    this.currentTabActive = tabToShow;
                    this.listActiveCampains();
                }else if(tabToShow === "past-campains"){
                    this.currentTabActive = tabToShow;
                    this.listInactiveCampains();
                }
            });
        });
    }

    private openModalShowDetails(){
        this.rootElementPageContainer!
        .querySelector(".tab-pane-container")
        ?.addEventListener("click",(e)=>{
            let elementClicked = e.target as HTMLElement;

            if(elementClicked.classList.contains("btn-earn")){
                let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId || 0;

                this.showMoreInfoAboutCampaing(+idPub);
                
            }else if(elementClicked.classList.contains("del")){
                let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId || 0;

                this.deleteCampaing(+idPub);

            }else if(elementClicked.classList.contains("edit")){
                let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId || 0;

                showLoader();
                Campaigns.getCampaingInfoByUser(+idPub)
                .then(resp=>{
                    if(!Array.isArray(resp)){
                        console.log(resp)
                       this.showFormEditCampain(resp.id,resp.name,resp.tvm,resp.goalview,resp.description);
                    }
                })
                .catch(console.log)
                .finally(hideLoader);
            }
        });
    }

    private addEventCreateNewCampain(){
        this.formCreateCampain?.addEventListener("submit",(e)=>{
            e.preventDefault();

            let formData = new FormData(this.formCreateCampain);
            let campaign = new Campaigns(formData);
            try{
                let errorObj = campaign.assignUser();

                if(errorObj.length){
                    formSetFeedback(this.formCreateCampain!,errorObj);
                }else{
                    showLoader();
                    campaign.createCampaing().then((resp)=>{
                        if(resp instanceof Campaigns){
                            swal({
                                title:"Feito",
                                text:`Campanha ${resp.nameCampaing} #${resp.idCampaing} criado com sucesso`,
                                icon:"success"
                            });
                            this.formCreateCampain?.reset();
                        }else{
                            formSetFeedback(this.formCreateCampain!,resp);
                            swal({
                                title:"Ooops!!!",
                                text:resp[0].errorFeedback,
                                icon:"error"
                            });
                        }
                        
                    })
                    .catch((e:IFormError[])=>{
                        swal({
                            title:"Ooops!!!",
                            text:e[0].errorFeedback,
                            icon:"error"
                        });
                    })
                    .finally(hideLoader);
                }
            }catch(err){
                console.log(err);
            }

        });
    }

    private addEventEditCampain(){
        this.formEditCampain?.addEventListener("submit",(e)=>{
            e.preventDefault();

            let formData = new FormData(this.formEditCampain);
            let idCampaingToEdit = this.formEditCampain?.dataset.idPub || "0";
            let campaign = new Campaigns(formData,idCampaingToEdit,"update");
            try{
                let errorObj = campaign.assignUser();

                if(errorObj.length){
                    formSetFeedback(this.formEditCampain!,errorObj);
                }else{
                    showLoader();
                    campaign.updateCampaing().then((resp)=>{
                        if(resp instanceof Campaigns){
                            swal({
                                title:"Feito",
                                text:`Campanha ${resp.nameCampaing} #${resp.idCampaing} atualizado com sucesso`,
                                icon:"success"
                            });
                            this.formCreateCampain?.reset();
                            this.hideFormEditCampain();
                            this.refreshListCampaing();
                        }else{
                            formSetFeedback(this.formCreateCampain!,resp);
                            swal({
                                title:"Ooops!!!",
                                text:resp[0].errorFeedback,
                                icon:"error"
                            });
                        }
                        
                    })
                    .catch((e:IFormError[])=>{
                        swal({
                            title:"Ooops!!!",
                            text:e[0].errorFeedback,
                            icon:"error"
                        });
                    })
                    .finally(hideLoader);
                }
            }catch(err){
                console.log(err);
            }

        });
    }

    private addEventCancelEditCampain(){
        let btnCancelEdit = this.formEditCampain?.querySelector<HTMLButtonElement>('.btn-cancel-edit');
        btnCancelEdit?.click();

        this.formEditCampain?.setAttribute("data-id-pub","");

        btnCancelEdit?.addEventListener("click",()=>{
            this.hideFormEditCampain();
        });
    }

    private showFormEditCampain(id:string,name:string,tvm:string,goalview:string,description:string){
        this.rootElementPageContainer!.querySelector(".tab-pane:not(.hide)")?.classList.add("hide");
        this.formEditCampain?.setAttribute("data-id-pub",id);
        this.formEditCampain?.classList.remove("d-none");

        this.formEditCampain!.querySelector<HTMLInputElement>("[name='name']")!.value = name;
        this.formEditCampain!.querySelector<HTMLInputElement>("[name='tvm']")!.value = tvm;
        this.formEditCampain!.querySelector<HTMLInputElement>("[name='goalview']")!.value = goalview;
        this.formEditCampain!.querySelector<HTMLTextAreaElement>("[name='description']")!.value = description;
    }

    private hideFormEditCampain(){
        let tabToShow = this.rootElementPageContainer!.querySelector<HTMLButtonElement>(".tab-btn.active")?.dataset.tab;
        this.rootElementPageContainer!.querySelector("#"+tabToShow)?.classList.remove("hide");
        this.rootElementPageContainer!.querySelector(".form-edit-campain")?.classList.add("d-none");
    }

    private listActiveCampains(){
        showLoader();
        this.campaingsActiveTab!.innerHTML = "";
        Campaigns.listActiveCampaing()
        .then((resp)=>{
            PagePanel.renderCampaing(this.campaingsActiveTab!,resp);
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(hideLoader);
    }

    private listInactiveCampains(){
        showLoader();
        this.campaingsInactiveTab!.innerHTML = "";
        Campaigns.listInactiveCampaing()
        .then((resp)=>{
            PagePanel.renderCampaing(this.campaingsInactiveTab!,resp);
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(hideLoader);
    }

    private showMoreInfoAboutCampaing(id:number){
        showLoader();
        Campaigns.getCampaingInfoByUser(id)
        .then(resp=>{
            let modalElement = openModalMoreDetails();
            let modalTitle = modalElement.querySelector(".modal-title")!;
            let modalDesc = modalElement.querySelector(".modal-body")!
            if(!Array.isArray(resp)){ 
                modalTitle.innerHTML = resp.name;
                modalDesc.innerHTML = resp.description;
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

    private deleteCampaing(id:number){
        swal({
            title: "Tens a certeza?",
            text: "Uma vez excluído, não poderás recuperar esta campanaha !",
            icon: "warning",
            buttons: ["cancelar","deletar"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                showLoader();
                Campaigns.deleteCampaing(id)
                .then(()=>{
                    swal({
                        title: "Feito",
                        text: "Campanha exluida com sucesso",
                        icon: "success",
                    });
                    this.refreshListCampaing();
                })
                .catch(console.log)
                .finally(hideLoader);
            }
        });
    }

    private refreshListCampaing(){
        if(this.currentTabActive === "campains-active")this.listActiveCampains();
        if(this.currentTabActive === "past-campains")this.listInactiveCampains();
    }

    private static renderCampaing(tabElement:HTMLDivElement,respObj:ICampaings[]|IFormError[]){
        if(respObj.length && "tvm" in respObj[0]){
            let campaigns = respObj as ICampaings[];
            for (const campaing of campaigns) {
                tabElement.innerHTML += pubCardTemplate(campaing.name,campaing.totalview,campaing.id);
            }
        }else{
            tabElement.innerHTML = `<h2>Nenhuma campanha encontrada</h2>`;
        }
    }
}
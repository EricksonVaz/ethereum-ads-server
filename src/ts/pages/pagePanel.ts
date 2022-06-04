import PageBase from "./pageBase";
import { openModalMoreDetails, showBackDrop } from "./partials/modals/modalsLoader";
import navMenu from "./partials/navMenu";
import tabsBtnGroup from "./partials/panelPage/tabsBtnGroup";
import swal from 'sweetalert';
import { hideLoader, showLoader } from "./partials/loader/loaderInit";

export default class PagePanel extends PageBase{
    static readonly rootPageId = "panel-page";
    private formEditCampain?:HTMLFormElement;
    constructor(){
        super(PagePanel.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+tabsBtnGroup());

        this.formEditCampain = this.rootElementPageContainer!.querySelector<HTMLFormElement>(".form-edit-campain")!;

        this.addEventToggleTabs();
        this.openModalShowDetails();
        this.addEventCancelEditCampain();

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
            });
        });
    }

    private openModalShowDetails(){
        this.rootElementPageContainer!
        .querySelector(".tab-pane-container")
        ?.addEventListener("click",(e)=>{
            let elementClicked = e.target as HTMLElement;

            
            if(elementClicked.classList.contains("btn-earn")){
                let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId;
                showLoader();
                setTimeout(()=>{
                    hideLoader();
                    showBackDrop();
                    openModalMoreDetails();
                    swal(`ver mais info pub ${idPub}`);
                },3000);
                
            }else if(elementClicked.classList.contains("del")){
                showLoader();
                setTimeout(()=>{
                     hideLoader();
                    let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId;
                    swal(`deletar pub ${idPub}`);
                },3000);
            }else if(elementClicked.classList.contains("edit")){
                showLoader();
                setTimeout(()=>{
                    hideLoader();
                    let idPub = elementClicked.closest<HTMLDivElement>(".pub-card")?.dataset.pubId;
                    this.showFormEditCampain()
                    this.formEditCampain?.setAttribute("data-id-pub",idPub!);
                    swal(`editar pub ${idPub}`);
                },3000);
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

    private showFormEditCampain(){
        this.rootElementPageContainer!.querySelector(".tab-pane:not(.hide)")?.classList.add("hide");
        this.formEditCampain?.classList.remove("d-none");
    }

    private hideFormEditCampain(){
        let tabToShow = this.rootElementPageContainer!.querySelector<HTMLButtonElement>(".tab-btn.active")?.dataset.tab;
        this.rootElementPageContainer!.querySelector("#"+tabToShow)?.classList.remove("hide");
        this.rootElementPageContainer!.querySelector(".form-edit-campain")?.classList.add("d-none");
    }
}
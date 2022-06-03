import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import tabsBtnGroup from "./partials/panelPage/tabsBtnGroup";

export default class PagePanel extends PageBase{
    static readonly rootPageId = "panel-page";
    constructor(){
        super(navMenu()+tabsBtnGroup(),PagePanel.rootPageId);
    }

    public init(): void {
        this.addEventToggleTabs();
    }

    private addEventToggleTabs(){
        this.rootElementPageContainer.querySelectorAll(".tab-btn")?.forEach(tabsButton=>{
            (tabsButton as HTMLButtonElement).addEventListener("click",()=>{
                let parentElement = tabsButton.parentElement;
                let tabToShow = (tabsButton as HTMLButtonElement).dataset.tab;

                parentElement?.querySelector(".tab-btn.active")?.classList.remove("active");
                tabsButton.classList.add("active");
                this.rootElementPageContainer.querySelector(".tab-pane:not(.hide)")?.classList.add("hide");
                this.rootElementPageContainer.querySelector("#"+tabToShow)?.classList.remove("hide");
            });
        });
    }
}
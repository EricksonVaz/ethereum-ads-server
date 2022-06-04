import PageBase from "./pageBase";
import indexMainBody from "./partials/indexPage/indexMainBody";
import navMenu from "./partials/navMenu";

export default class PageIndex extends PageBase{
    static readonly rootPageId = "index-page";
    constructor(){
        super(PageIndex.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+indexMainBody());
        return this;
    }
}
import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import aboutMainBody from "./partials/aboutPage/aboutMainBody";

export default class PageAbout extends PageBase{
    static readonly rootPageId = "about-page";
    constructor(){
        super(PageAbout.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+aboutMainBody());

        return this;
    }
}
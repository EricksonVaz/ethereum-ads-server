import PageBase from "./pageBase";
import labelPageNotFound from "./partials/labelPageNotFound";
import navMenu from "./partials/navMenu";

export default class Page404 extends PageBase{
    static readonly rootPageId = "page-404";
    constructor(){
        super(Page404.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+labelPageNotFound());

        return this;
    }
}
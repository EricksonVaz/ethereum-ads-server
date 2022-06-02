import PageBase from "./pageBase";
import labelPageNotFound from "./partials/labelPageNotFound";
import navMenu from "./partials/navMenu";

export default class Page404 extends PageBase{
    static readonly rootPageId = "page-404";
    constructor(){
        super(navMenu()+labelPageNotFound(),Page404.rootPageId);
    }

    public init(): void {
    }
}
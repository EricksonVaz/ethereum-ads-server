import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import aboutMainBody from "./partials/aboutPage/aboutMainBody";

export default class PageAbout extends PageBase{
    static readonly rootPageId = "about-page";
    constructor(){
        super(navMenu()+aboutMainBody(),PageAbout.rootPageId);
    }

    public init(): void {
    }
}
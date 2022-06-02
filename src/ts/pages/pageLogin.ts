import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import loginForm from "./partials/loginForm";

export default class PageLogin extends PageBase{
    static readonly rootPageId = "login-page";
    constructor(){
        super(navMenu()+loginForm(),PageLogin.rootPageId);
    }

    public init(): void {
    }
}
import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import signupForm from "./partials/signupForm";

export default class PageSignup extends PageBase{
    static readonly rootPageId = "signup-page";
    constructor(){
        super(navMenu()+signupForm(),PageSignup.rootPageId);
    }

    public init(): void {
    }
}
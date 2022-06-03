import PageBase from "./pageBase";
import navMenu, { refreshNavMenuState } from "./partials/navMenu";
import loginForm from "./partials/loginForm";
import User from "../models/user";
import formSetFeedback from "../utils/formSetFeedback";
import Router from "../router";

export default class PageLogin extends PageBase{
    static readonly rootPageId = "login-page";
    private formLogin:HTMLFormElement;
    constructor(){
        super(navMenu()+loginForm(),PageLogin.rootPageId);
        this.formLogin = this.rootElementPageContainer.querySelector<HTMLFormElement>(".form-login")!;
    }

    public init(): void {
        if(this.isFirstLoad){
            this.isFirstLoad = false;

            this.addEventSubmitFormLogin();
        }
    }

    private addEventSubmitFormLogin(){
        this.formLogin.addEventListener("submit",(e)=>{
            e.preventDefault();

            let formData = new FormData(this.formLogin);
            let email = formData.get("email") as string
            let password = formData.get("password") as string;

            let errorObj = User.login(email,password);
            if(errorObj.length)formSetFeedback(this.formLogin,errorObj);
            else{
                Router.router.navigateTo("/panel");
                refreshNavMenuState();
            }
        });
    }
}
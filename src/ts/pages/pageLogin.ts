import PageBase from "./pageBase";
import navMenu from "./partials/navMenu";
import loginForm from "./partials/loginForm";
import User from "../models/user";
import formSetFeedback from "../utils/formSetFeedback";
import Router from "../router";
import IFormError from "../utils/interfaces/iFormError";
import { hideLoader, showLoader } from "./partials/loader/loaderInit";

export default class PageLogin extends PageBase{
    static readonly rootPageId = "login-page";
    private formLogin?:HTMLFormElement;
    constructor(){
        super(PageLogin.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+loginForm());

        if(this.rootElementPageContainer)
        this.formLogin = this.rootElementPageContainer.querySelector<HTMLFormElement>(".form-login")!;

        this.addEventSubmitFormLogin();

        return this;
    }

    private addEventSubmitFormLogin(){
        this.formLogin!.addEventListener("submit",(e)=>{
            e.preventDefault();

            let formData = new FormData(this.formLogin);
            let email = formData.get("email") as string
            let password = formData.get("password") as string;

            showLoader();

            PageLogin.actionLogin(email,password)
            .catch(err=>{
                let errorObj = err as IFormError[];
                formSetFeedback(this.formLogin!,errorObj);
            }).finally(hideLoader);
        });
    }

    static async actionLogin(email:string,password:string){
        let errorObj = await User.login(email,password);

        if(errorObj.length)throw errorObj;

        Router.router.renderPage("/panel");
    }
}
import User from "../models/user";
import formSetFeedback from "../utils/formSetFeedback";
import PageBase from "./pageBase";
import PageLogin from "./pageLogin";
import navMenu from "./partials/navMenu";
import signupForm from "./partials/signupForm";
import swal from "sweetalert";
import IFormError from "../utils/interfaces/iFormError";

export default class PageSignup extends PageBase{
    static readonly rootPageId = "signup-page";
    private formSignup?:HTMLFormElement;
    constructor(){
        super(PageSignup.rootPageId);
    }

    public init(appRootElement:HTMLDivElement): PageBase {
        this.appRootElement = appRootElement;
        this.addComponents(navMenu()+signupForm());

        if(this.rootElementPageContainer)
        this.formSignup = this.rootElementPageContainer.querySelector<HTMLFormElement>(".form-signup ")!;

        this.addEventSubmitFormSignup();

        return this;
    }

    private addEventSubmitFormSignup(){
        this.formSignup!.addEventListener("submit",(e)=>{
            e.preventDefault();

            let formData = new FormData(this.formSignup);

            let respSignup = new User(formData).signup();
            if(Array.isArray(respSignup)){
                formSetFeedback(this.formSignup!,respSignup)
            }else{
                console.log("user created", respSignup);
                let {email,password} = respSignup;

                try{
                    PageLogin.actionLogin(email,password);
                }catch(err){
                    let errorObj = err as IFormError[];
                    console.log("error try login afert signup",errorObj);
                    swal({
                        title:"Opps!!",
                        text:errorObj[0].errorFeedback,
                        icon:"error"
                    })
                }
            }
        });
    }
}
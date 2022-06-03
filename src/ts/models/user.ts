import IFormError from "../utils/interfaces/iFormError";

export default class User{
    private email:string = "";
    private password:string = "";
    private errorFeedback:IFormError[] = [];

    static status:string = "logoff";

    static login(email:string,password:string):IFormError[]{
        let errorFeedback:IFormError[] = [];
        if(!email){
            errorFeedback.push({
                formControl:"email",
                errorFeedback:"email é obrigatorio",
                currentValue:email
            });
        }

        if(!password){
            errorFeedback.push({
                formControl:"password",
                errorFeedback:"password é obrigatorio",
                currentValue:password
            }); 
        }

        if(email==="ericksoncv1@outlook.com" && password==="123456"){
            User.status = "logged";
        }else{
            errorFeedback.push({
                formControl:"email",
                errorFeedback:"email ou password incorrecto",
                currentValue:email
            });
        }

        return errorFeedback;
    }
}
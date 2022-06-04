import AuthJWT from "../utils/authJWT";
import passwordHash from "password-hash";
import IFormError from "../utils/interfaces/iFormError";
import IUserLogged from "../utils/interfaces/iUserLogged";
import ManageStorage from "../utils/manageStorage";

export default class User{
    public idUser:string = "";
    public email:string = "";
    public password:string = "";
    private passwordHashed:string = "";
    private confirm:string = "";
    private errorFeedback:IFormError[] = [];

    private readonly regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    private static objsUserLogged:IUserLogged = {
        idUser:1,
        email:"ericksoncv1@outlook.com",
        password:passwordHash.generate("123456")
    }

    constructor(private formData:FormData){
        this.email = this.getFormValue("email");
        this.password = this.getFormValue("password");
        this.confirm = this.getFormValue("confirm");

        this.validateFormData();
    }

    signup():IFormError[]|User{
        if(this.errorFeedback.length) return this.errorFeedback
        else{
            this.passwordHashed = passwordHash.generate(this.password)
            let userObj:IUserLogged = {
                idUser:2,
                email:this.email,
                password:this.passwordHashed
            };

            //send user To ethereum blockchain

            return this;
        }

    }

    private getFormValue(formConrol:string):string{
        return (this.formData.get(formConrol) as string) ?? "";
    }

    private validateFormData(){
        if(!this.email){
            this.errorFeedback.push({
                formControl:"email",
                errorFeedback:"campo email é obrigatorio",
                currentValue:this.email
            });
        }

        if(!this.password){
            this.errorFeedback.push({
                formControl:"password",
                errorFeedback:"campo password é obrigatorio",
                currentValue:this.password
            });
        }

        if(this.email && this.password.length>=6){

            if(!this.regexEmail.test(this.email)){
                this.errorFeedback.push({
                    formControl:"email",
                    errorFeedback:"degite um email válido",
                    currentValue:this.email
                });
            }

            if(this.password!==this.confirm){
                this.errorFeedback.push({
                    formControl:"confirm",
                    errorFeedback:"Confirmar e Password tem de ser igual",
                    currentValue:this.confirm
                });
            }
        }else{
            this.errorFeedback.push({
                formControl:"password",
                errorFeedback:"password tem de ter 6 caracters minimo",
                currentValue:this.password
            }); 
        }
    }

    static login(_email:string,_password:string):IFormError[]{
        let errorFeedback:IFormError[] = [];
        let {email,password} = User.objsUserLogged;

        if(!_email){
            errorFeedback.push({
                formControl:"email",
                errorFeedback:"email é obrigatorio",
                currentValue:_email
            });
        }

        if(!_password){
            errorFeedback.push({
                formControl:"password",
                errorFeedback:"password é obrigatorio",
                currentValue:_password
            }); 
        }

        if(_email && _password){
            let verifyPassword = passwordHash.verify(_password,password);

            if(_email=== email && verifyPassword){
                let loginHash = AuthJWT.authJWT.generateToken(User.objsUserLogged);
            
                ManageStorage.saveValue("loggedUserHash",loginHash);
            }else{
                errorFeedback.push({
                    formControl:"email",
                    errorFeedback:"email ou password incorrecto",
                    currentValue:email
                });
            }
        }

        return errorFeedback;
    }

    static isUserLogged():boolean{
        let loggedUserHashObj = ManageStorage.getValueSaved("loggedUserHash");

        if(loggedUserHashObj){
            let loggedUserObj = AuthJWT.authJWT.decodeToken(loggedUserHashObj);
            console.log("JWT",AuthJWT.authJWT.decodeToken(loggedUserHashObj));
            if(
                loggedUserObj.hasOwnProperty("idUser") && 
                loggedUserObj.hasOwnProperty("email") && 
                loggedUserObj.hasOwnProperty("password")
            ){
                return true;
            }

            User.logOut();
        }

        return false;
    }

    static userLogged():IUserLogged|undefined{
        let loggedUserObj = undefined;
        if(User.isUserLogged()){
            let loggedUserHashObj = ManageStorage.getValueSaved("loggedUserHash");
            loggedUserObj = AuthJWT.authJWT.decodeToken(loggedUserHashObj) as IUserLogged;
        }

        return loggedUserObj;
    }

    static logOut(){
        ManageStorage.removeValue("loggedUserHash");
    }
}
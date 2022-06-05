import AuthJWT from "../utils/authJWT";
import passwordHash from "password-hash";
import IFormError from "../utils/interfaces/iFormError";
import IUserLogged from "../utils/interfaces/iUserLogged";
import ManageStorage from "../utils/manageStorage";
import Web3Obj from "../utils/web3Obj";
import UserContractJson from "../../../build/contracts/Users.json";
import swal from "sweetalert";

export default class User{
    public idUser:string = "";
    public email:string = "";
    public password:string = "";
    private passwordHashed:string = "";
    private confirm:string = "";
    private errorFeedback:IFormError[] = [];
    //private static contractJson = new URL("../../../build/contracts/Users.json",import.meta.url);

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

    static async contract(){
       let web3Obj = new Web3Obj();
       let web3 = await web3Obj.initWeb3()
       Web3Obj.web3 = web3;
       return await web3Obj.initContract(UserContractJson);
    }

    async signup():Promise<IFormError[]|User>{
        if(this.errorFeedback.length) return this.errorFeedback
        else{
            this.passwordHashed = passwordHash.generate(this.password)
            let userObj:IUserLogged = {
                idUser:2,
                email:this.email,
                password:this.passwordHashed
            };

            let contractUser = await User.contract();
            let result:[number,string,string]|string
            try{
                result = await contractUser.methods
                .findByEmail(this.email)
                .call() as [number,string,string];

                return [{
                    formControl:"email",
                    errorFeedback:"este user já foi registrado",
                    currentValue:this.email
                }];
            }catch{
                try{
                    await contractUser.methods
                    .signup(this.email,this.passwordHashed)
                    .send({from: Web3Obj.accounts[0],gas: 200000});

                    let idUserRegister = await contractUser.methods.nextIdUser().call();
                    this.idUser = idUserRegister;

                    return this;
                }catch(e){
                    swal({
                        title:"Ooops!!!",
                        text:"Erro ao resgistar na blockchain",
                        icon:"error"
                    });
                    console.log(e)
                    return [{
                        formControl:"email",
                        errorFeedback:"erro ao resgistar na blockchain",
                        currentValue:this.email
                    }];
                }
            }
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

    static async login(_email:string,_password:string):Promise<IFormError[]>{
        let errorFeedback:IFormError[] = [];
        let contractUser = await User.contract();

        try{
            let resp =  await contractUser.methods.findByEmail(_email).call() as any;
            let idUser=resp["0"],email = resp["1"],password=resp["2"];

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
                    let loginHash = AuthJWT.authJWT.generateToken({id:idUser,email,password});
                
                    ManageStorage.saveValue("loggedUserHash",loginHash);
                    
                }else{
                    errorFeedback.push({
                        formControl:"email",
                        errorFeedback:"email ou password incorrecto",
                        currentValue:email
                    });
                }
            }
        }catch(e){
            errorFeedback.push({
                formControl:"email",
                errorFeedback:"este email não existe",
                currentValue:_email
            });
            console.log("blockchain error login",e)
        }

        return errorFeedback;
    }

    static isUserLogged():boolean{
        let loggedUserHashObj = ManageStorage.getValueSaved("loggedUserHash");

        if(loggedUserHashObj){
            let loggedUserObj = AuthJWT.authJWT.decodeToken(loggedUserHashObj);
            console.log("JWT",AuthJWT.authJWT.decodeToken(loggedUserHashObj));
            if(
                loggedUserObj.hasOwnProperty("id") && 
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
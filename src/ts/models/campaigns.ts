import swal from "sweetalert";
import Router from "../router";
import FormBaseModal from "./formBase";
import User from "./user";
import CampaignContractJson from "../../../build/contracts/Campaings.json";
import Web3Obj from "../utils/web3Obj";
import { Contract } from "web3-eth-contract";
import IFormError from "../utils/interfaces/iFormError";
import ICampaings from "../utils/interfaces/ICampaing";

export default class Campaigns extends FormBaseModal{
    private id:string = "";
    private name:string = "";
    private tvm:string = "";
    private goalView:string = "";
    private description:string = "";
    private user:string = "";
    private static readonly GAS = 200000;

    constructor(protected formData:FormData,id="",private action="create"){
        super(formData);

        if(id)this.id = id;
        this.name = this.getFormValue("name");
        this.tvm = this.getFormValue("tvm");
        this.goalView = this.getFormValue("goalview");
        this.description = this.getFormValue("description");

        this.validateFormData();
    }

    get idCampaing():string{
        return this.id;
    }

    get nameCampaing():string{
        return this.name;
    }

    public assignUser(){
        let userLoged = User.userLogged();
        if(userLoged){
            this.user = ""+userLoged.id
            return this.errorFeedback;
        }

        throw Campaigns.exceptionUserNotLogged();
    }

    async createCampaing():Promise<Campaigns|IFormError[]>{
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                await contractCampaign.methods
                .create(this.name,+this.tvm,+this.goalView,this.description,+this.user)
                .send({from: Web3Obj.accounts[0],gas: Campaigns.GAS});

                let idCampaignRegister = await contractCampaign.methods.nextId().call();
                this.id = ""+(idCampaignRegister - 1);

                return this;
            }catch(e){
            
                return Campaigns.feedBackErrorFromSmartContract(e,"erro ao resgistar na blockchain");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:this.name
            }];
        });
    }

    async updateCampaing():Promise<Campaigns|IFormError[]>{
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                await contractCampaign.methods
                .update(+this.id,this.name,+this.tvm,+this.goalView,this.description,+this.user)
                .send({from: Web3Obj.accounts[0],gas: Campaigns.GAS});

                return this;
            }catch(e){
            
                return Campaigns.feedBackErrorFromSmartContract(e,"erro ao atualizar a campanha");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:this.name
            }];
        });
    }

    static async deleteCampaing(idCampaing:number):Promise<true|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                await contractCampaign.methods
                .destroy(idCampaing,userLogged!.id)
                .send({from: Web3Obj.accounts[0],gas: Campaigns.GAS});

                return true;
            }catch(e){
                return Campaigns.feedBackErrorFromSmartContract(e,"Erro ao tentar deletar a campanha da blockchain");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:""
            }];
        });
    }

    static async watchCampaing(idCampaing:number):Promise<true|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                await contractCampaign.methods
                .watchCampaign(idCampaing,userLogged!.id)
                .send({from: Web3Obj.accounts[0],gas: Campaigns.GAS});

                return true;
            }catch(e){
                return Campaigns.feedBackErrorFromSmartContract(e,"Erro ao tentar assistir a campanha no blockchain");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:""
            }];
        });
    }

    static async listActiveCampaing():Promise<ICampaings[]|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return await Campaigns.listAllValidCaimpaingsCB(async (contractCampaign:Contract)=>{
            let respListActiveCampaings = await contractCampaign.methods
            .listAllCampainActiveByUser(userLogged!.id)
            .call();

            return Campaigns.trasformValueFromBlockchain((respListActiveCampaings as any[]));
        });
    }

    static async listInactiveCampaing():Promise<ICampaings[]|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return await Campaigns.listAllValidCaimpaingsCB(async (contractCampaign:Contract)=>{
            let respListInactiveCampaings = await contractCampaign.methods
            .listAllCampainInactiveByUser(userLogged!.id)
            .call();

            return Campaigns.trasformValueFromBlockchain((respListInactiveCampaings as any[]));
        });
    }

    static async listAllValidCaimpaings():Promise<ICampaings[]|IFormError[]>{
        if(User.isUserLogged()){
            let userLogged = User.userLogged();
            if(!userLogged){
                throw Campaigns.exceptionUserNotLogged();
            }
            return await Campaigns.listAllValidCaimpaingsCB(async (contractCampaign:Contract)=>{
                let respListActiveCampaings = await contractCampaign.methods
                .listAllCampainActiveFromDiferentUsers(userLogged!.id)
                .call();

                return Campaigns.trasformValueFromBlockchain((respListActiveCampaings as any[]));
            });
        }else{
            return await Campaigns.listAllValidCaimpaingsCB(async (contractCampaign:Contract)=>{
                let respListActiveCampaings = await contractCampaign.methods
                .listAllCampainActive()
                .call();

                return Campaigns.trasformValueFromBlockchain((respListActiveCampaings as any[]));
            });
        }
    }

    static async getCampaingInfoByUser(idCampaing:number):Promise<ICampaings|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                let campaingFind = await contractCampaign.methods
                .findByUserAndId(idCampaing,userLogged!.id)
                .call();

                let {0:id,1:name,2:tvm,3:goalview,4:description,5:totalview,6:user} = campaingFind;

                return (<unknown>{id,name,tvm,goalview,description,totalview,user}) as ICampaings;
            }catch(e){
                return Campaigns.feedBackErrorFromSmartContract(e,"Erro ao retornar campanha da blockchain");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:""
            }];
        });
    }

    static async getCampaingInfo(idCampaing:number):Promise<ICampaings|IFormError[]>{
        let userLogged = User.userLogged();
        if(!userLogged){
            throw Campaigns.exceptionUserNotLogged();
        }
        return Web3Obj.contract(CampaignContractJson)
        .then(async (contractResp)=>{
            let contractCampaign = contractResp as Contract;
            try{
                let campaingFind = await contractCampaign.methods
                .findById(idCampaing)
                .call();

                let {0:id,1:name,2:tvm,3:goalview,4:description,5:totalview,6:user} = campaingFind;

                return (<unknown>{id,name,tvm,goalview,description,totalview,user}) as ICampaings;
            }catch(e){
                return Campaigns.feedBackErrorFromSmartContract(e,"Erro ao retornar campanha da blockchain");
            }
        })
        .catch((e)=>{
            console.log(e);
            return [{
                formControl:"name",
                errorFeedback:"erro ao conectar na blockchain",
                currentValue:""
            }];
        });
    }

    private static async listAllValidCaimpaingsCB(callback:Function){
        return Web3Obj.contract(CampaignContractJson)
            .then(async (contractResp)=>{
                let contractCampaign = contractResp as Contract;
                try{
                    return callback(contractCampaign) as ICampaings[];
                }catch(e){
                    return Campaigns.feedBackErrorFromSmartContract(e,"Erro ao listar valores da blockchain")
                }
            })
            .catch((e)=>{
                console.log(e);
                return [{
                    formControl:"name",
                    errorFeedback:"erro ao conectar na blockchain",
                    currentValue:""
                }];
            });
    }

    private static exceptionUserNotLogged(){
        swal({
            title: "User não logado",
            text: "Por favor efectue o login novamente",
            icon: "warning",
        }).then((willDelete) => {
            Router.actionLogout("/login");
        });
        return new Error("User not logged");
    }

    protected validateFormData(): void {
        if(this.action=="update" && !this.id){
            this.errorFeedback.push({
                formControl:"name",
                errorFeedback:"ID da campanha não especificada",
                currentValue:this.id
            });
        }

        if(!this.name){
            this.errorFeedback.push({
                formControl:"name",
                errorFeedback:"campo nome é obrigatorio",
                currentValue:this.name
            });
        }

        if(!this.tvm){
            this.errorFeedback.push({
                formControl:"tvm",
                errorFeedback:"campo tvm é obrigatorio",
                currentValue:this.tvm
            });
        }
        this.numericValidationRule("tvm",this.tvm,1);

        if(!this.goalView){
            this.errorFeedback.push({
                formControl:"goalview",
                errorFeedback:"Meta total views é obrigatorio",
                currentValue:this.goalView
            });
        }
        this.numericValidationRule("goalview",this.goalView,1);

        if(!this.description){
            this.errorFeedback.push({
                formControl:"description",
                errorFeedback:"Campo descrição é obrigatorio",
                currentValue:this.description
            });
        }
    }

    private numericValidationRule(fieldName:string,fieldValue:string,minValue:number){
        if(fieldValue){
            if(isNaN(+fieldValue)){
                this.errorFeedback.push({
                    formControl:fieldName,
                    errorFeedback:`campo ${fieldName} tem de ser um numero válido`,
                    currentValue:fieldValue
                });
            }else if(!isNaN(+fieldValue) && +fieldValue<minValue){
                this.errorFeedback.push({
                    formControl:fieldName,
                    errorFeedback:`campo ${fieldName} tem de ser maior ou igual a ${minValue}`,
                    currentValue:fieldValue
                });
            }
        }
    }

    private static trasformValueFromBlockchain(respListActiveCampaings:any[]):ICampaings[]{
        let listActiveCampaings = respListActiveCampaings.map(itemResp=>{
            let [id,name,description,goalview,tvm,totalview,user] = itemResp;

            return {id,name,description,tvm,goalview,totalview,user}
        });

        return (<unknown>listActiveCampaings) as ICampaings[];
    }

    private static feedBackErrorFromSmartContract(e:any,msgToShow:string):IFormError[]{
        swal({
            title:"Ooops!!!",
            text:msgToShow,
            icon:"error"
        });
        console.log(e);
        return [{
            formControl:"name",
            errorFeedback:msgToShow,
            currentValue:""
        }];
    }
    
}
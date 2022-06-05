import swal from "sweetalert";
import Router from "../router";
import FormBaseModal from "./formBase";
import User from "./user";

export default class Campaigns extends FormBaseModal{
    private id:string = "";
    private name:string = "";
    private tvm:string = "";
    private goalView:string = "";
    private description:string = "";
    private user:string = "";

    constructor(protected formData:FormData){
        super(formData);

        this.name = this.getFormValue("name");
        this.tvm = this.getFormValue("tvm");
        this.goalView = this.getFormValue("goalview");
        this.description = this.getFormValue("description");

        this.validateFormData();
    }

    public assignUser(){
        let userLoged = User.userLogged();
        if(userLoged){
            this.user = ""+userLoged.id
            return this.errorFeedback;
        }

        swal({
            title: "User não logado",
            text: "Por favor efectue o login novamente",
            icon: "warning",
        }).then((willDelete) => {
            Router.actionLogout("/login");
        });
        throw new Error("User not logged");
    }

    protected validateFormData(): void {
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
    
}
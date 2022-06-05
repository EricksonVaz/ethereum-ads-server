import IFormError from "../utils/interfaces/iFormError";

export default abstract class FormBaseModal{
    
    protected errorFeedback:IFormError[] = [];

    constructor(protected formData:FormData){
    }

    protected getFormValue(formConrol:string):string{
        return (this.formData.get(formConrol) as string) ?? "";
    }

    protected abstract validateFormData():void;
}
import IFormError from "./interfaces/iFormError";

export default function formSetFeedback(formElement:HTMLFormElement,formError:IFormError[]){
    formError.forEach(errorObj=>{
        let elementFeedback = formElement.querySelector<HTMLElement>(`[name=${errorObj.formControl}]`)?.nextElementSibling as HTMLDivElement;

        if(elementFeedback){
            elementFeedback.innerHTML = errorObj.errorFeedback;
            setTimeout(()=>{
                elementFeedback.innerHTML = "";
            },3000);
        } 
    });
}
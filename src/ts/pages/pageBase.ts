export default abstract class PageBase{
    protected rootElementPageContainer:HTMLDivElement;
    constructor(protected componentsHTMLString:string,public rootPageElementId:string){
        this.rootElementPageContainer = document.createElement('div');
        this.rootElementPageContainer.id = rootPageElementId;
        this.rootElementPageContainer.insertAdjacentHTML("beforeend",this.componentsHTMLString);
    }

    public render(appRootElement:HTMLDivElement){
        appRootElement.insertAdjacentElement("beforeend", this.rootElementPageContainer);
        return this
    }

    public abstract init():void;
}
export default abstract class PageBase{
    protected rootElementPageContainer?:HTMLDivElement;
    protected isFirstLoad:boolean;
    protected appRootElement?:HTMLDivElement;

    constructor(public rootPageElementId:string){
        this.isFirstLoad = true;
    }

    public render(){
        this.appRootElement!.insertAdjacentElement("beforeend", this.rootElementPageContainer!);
    }

    public addComponents(componentsHTMLString:string){
        this.appRootElement!.innerHTML = "";
        this.rootElementPageContainer = document.createElement('div');
        this.rootElementPageContainer.id = this.rootPageElementId;
        this.rootElementPageContainer.insertAdjacentHTML("beforeend",componentsHTMLString);
    }

    public abstract init(appRootElement:HTMLDivElement):PageBase;
}
import User from "./models/user";
import IRoutes from "./utils/interfaces/iRoutes";

export default class Router {
    private _protectedPaths:string[] = [];
    private _restrictPaths:string[] = [];
    public readonly userHomePage = "/panel";
    private readonly notFoundPage = "/not-found";
    private readonly loginPage = "/login";
    static router:Router;
    private isFirstLoad:boolean = true;

    constructor(private rootElement:HTMLDivElement,private routes:IRoutes[]){
        this.isFirstLoad = true;
        window.addEventListener("popstate",()=>{
            this.isFirstLoad=true;
            this.navigateTo(window.location.pathname);
        });

        Router.router = this;
    }

    public resolve(){
        let currentPathName = window.location.pathname;
        this.navigateTo(currentPathName);
        this.addNavLinkActions();
    }

    private addNavLinkActions(){
        this.rootElement.querySelectorAll(":not(.main-nav) [data-href]").forEach((link)=>{
            link.addEventListener("click",(e)=>{
                this.onNavClickLink(e);
            });
        });
    }

    private onNavClickLink(e:Event){
        this.isFirstLoad=false;
        this.navigateOnLinkItemClicked(e);
    }

    set protectedPaths(pathNameArr:string[]){
        this._protectedPaths = pathNameArr;
    }

    set restrictPaths(pathNameArr:string[]){
        this._restrictPaths = pathNameArr;
    }

    private navigateOnLinkItemClicked(e:Event){
        e.preventDefault();

        let linkElement = e.target as HTMLLinkElement;
        let dataHref = linkElement.dataset.href;
        console.log(linkElement);
        this.navigateTo(dataHref!);
    }

    public navigateTo(pathName:string){
        if(pathName==="/logout"){
            this.updateUrl("/");
            User.status = "logoff";
            this.loadRoute(pathName)?.page.render(this.rootElement).init();
        }else if(this.isFirstLoad || window.location.pathname!=pathName){
            this.rootElement.querySelector(".main-nav")?.addEventListener("click",(e)=>{
                let elementClicked = e.target as HTMLElement;

                if(elementClicked.matches("[data-href]")){
                    this.onNavClickLink(e);
                }
            });
            this.rootElement.innerHTML = "";
            this.updateUrl(pathName);
            let routeFound = this.loadRoute(pathName);
            console.log(this.routes);
            
            if(routeFound){
                if(User.status=="logoff" && this._protectedPaths.includes(routeFound.path)){
                    this.updateUrl(this.loginPage);
                    this.loadRoute(this.loginPage)?.page.render(this.rootElement).init();
                }if(User.status=="logged" && this._restrictPaths.includes(routeFound.path)){
                    this.updateUrl(this.userHomePage);
                    this.loadRoute(this.userHomePage)?.page.render(this.rootElement).init();
                }else{
                    routeFound.page.render(this.rootElement).init();
                }
            }else{
                this.loadRoute(this.notFoundPage)?.page.render(this.rootElement).init();
            }

            this.addNavLinkActions();
        }
    }

    private loadRoute(pathName:string):IRoutes|undefined{
        return this.routes.find(route=>route.path==pathName);
    }

    private updateUrl(pathName:string){
        window.history.pushState(
            {},
            pathName,
            window.location.origin + pathName
        );
    }
}
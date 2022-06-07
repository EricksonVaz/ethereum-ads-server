import User from "./models/user";
import { refreshNavMenuState } from "./pages/partials/navMenu";
import IRoutes from "./utils/interfaces/iRoutes";

export default class Router {
    private _protectedPaths:string[] = [];
    private _restrictPaths:string[] = [];
    public readonly userHomePage = "/panel";
    private readonly notFoundPage = "/not-found";
    private readonly loginPage = "/login";
    private readonly basePath = "/";
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
        //this.addNavLinkActions();
    }

    private addNavLinkActions(){
        this.rootElement.querySelectorAll(":not(.main-nav) [data-href]").forEach((link)=>{
            link.addEventListener("click",(e)=>{
                this.onNavClickLink(e);
            });
        });
    }

    onNavClickLink(e:Event){
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
        this.navigateTo(dataHref!);
    }

    public navigateTo(pathName:string){
        if(pathName==="/logout"){
            Router.actionLogout();
        }else if(this.isFirstLoad || window.location.pathname!=pathName){
            this.updateUrl(pathName);
            let routeFound = this.loadRoute(pathName);
            
            if(routeFound){
                if(!User.isUserLogged() && this._protectedPaths.includes(routeFound.path)){
                    this.updateUrl(this.loginPage);
                    this.loadRoute(this.loginPage)?.page.init(this.rootElement).render();
                }else if(User.isUserLogged() && this._restrictPaths.includes(routeFound.path)){
                    this.updateUrl(this.userHomePage);
                    this.loadRoute(this.userHomePage)?.page.init(this.rootElement).render();
                }else{
                    routeFound.page.init(this.rootElement).render();
                }
            }else{
                this.loadRoute(this.notFoundPage)?.page.init(this.rootElement).render();
            }

            this.addNavLinkActions();
            refreshNavMenuState((navMenu:HTMLElement)=>{
                navMenu.addEventListener("click",(e)=>{
                    let elementClicked = e.target as HTMLElement;
                    if(elementClicked.matches("[data-href]")){
                        this.onNavClickLink(e);
                    }
                });
            });
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

    public renderPage(pathName:string){
        this.updateUrl(pathName);
        this.loadRoute(pathName)?.page.init(this.rootElement).render();

        refreshNavMenuState((navMenu:HTMLElement)=>{
            navMenu.addEventListener("click",(e)=>{
                let elementClicked = e.target as HTMLElement;
                if(elementClicked.matches("[data-href]")){
                    this.onNavClickLink(e);
                }
            });
        });
    }

    public static actionLogout(pathName=Router.router.basePath){
        let router = Router.router;
        User.logOut();
        router.renderPage(pathName);
    }
}
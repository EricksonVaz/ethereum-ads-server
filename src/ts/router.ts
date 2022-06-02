import Page404 from "./pages/page404";
import IRoutes from "./utils/interfaces/iRoutes";

export default class Router {
    private _protectedPaths:string[] = [];
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
    }

    public resolve(){
        let currentPathName = window.location.pathname;
        this.navigateTo(currentPathName);
        this.addNavLinkActions();
    }

    private addNavLinkActions(){
        this.rootElement.querySelectorAll("a[data-href]").forEach((link)=>{
            link.addEventListener("click",(e)=>{
                this.isFirstLoad=false;
                this.navigateOnLinkItemClicked(e);
            });
        });
    }

    set protectedPaths(pathNameArr:string[]){
        this._protectedPaths = pathNameArr;
    }

    private navigateOnLinkItemClicked(e:Event){
        e.preventDefault();

        let linkElement = e.target as HTMLLinkElement;
        let dataHref = linkElement.dataset.href;
        console.log(linkElement);
        this.navigateTo(dataHref!);
    }

    private navigateTo(pathName:string){
        
        if(this.isFirstLoad || window.location.pathname!=pathName){
            this.rootElement.innerHTML = "";
            window.history.pushState(
                {},
                pathName,
                window.location.origin + pathName
            )
            let routeFound = this.loadRoute(pathName);
            console.log(this.routes);

            if(routeFound){
                if(this._protectedPaths.includes(routeFound.path)){
                    this.loadRoute(this.loginPage)?.page.render(this.rootElement);
                }else{
                    routeFound.page.render(this.rootElement);
                }
            }else{
                this.loadRoute(this.notFoundPage)?.page.render(this.rootElement);
            }

            this.addNavLinkActions();
        }
    }

    private loadRoute(pathName:string):IRoutes|undefined{
        return this.routes.find(route=>route.path==pathName);
    }
}
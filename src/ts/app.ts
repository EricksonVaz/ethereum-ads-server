import Page404 from "./pages/page404";
import PageAbout from "./pages/pageAbout";
import PageIndex from "./pages/pageIndex";
import PageLogin from "./pages/pageLogin";
import PageSignup from "./pages/pageSignup";
import Router from "./router";

(function(appRootElement:HTMLDivElement){
    let router = new Router(appRootElement,[
        {
            path: "/",
            page: new PageIndex()
        },
        {
            path: "/index",
            page: new PageIndex()
        },
        {
            path: "/not-found",
            page: new Page404()
        },
        {
            path: "/about",
            page: new PageAbout()
        },
        {
            path: "/login",
            page: new PageLogin()
        },
        {
            path: "/signup",
            page: new PageSignup()
        }
    ]);
    router.resolve();
})(document.querySelector("#app")! as HTMLDivElement);
import Page404 from "./pages/page404";
import PageAbout from "./pages/pageAbout";
import PageIndex from "./pages/pageIndex";
import PageLogin from "./pages/pageLogin";
import PagePanel from "./pages/pagePanel";
import PageSignup from "./pages/pageSignup";
import loaderInit from "./pages/partials/loader/loaderInit";
import modalsLoader from "./pages/partials/modals/modalsLoader";
import Router from "./router";
import AuthJWT from "./utils/authJWT";

(function(appRootElement:HTMLDivElement){
    new AuthJWT();
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
            path: "/panel",
            page: new PagePanel()
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
    router.protectedPaths = ["/panel"];
    router.restrictPaths = ["/login","/signup"];
    router.resolve();
    modalsLoader(appRootElement);
    loaderInit(appRootElement);
})(document.querySelector("#app")! as HTMLDivElement);
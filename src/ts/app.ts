import Page404 from "./pages/page404";
import PageAbout from "./pages/pageAbout";
import PageIndex from "./pages/pageIndex";
import PageLogin from "./pages/pageLogin";
import PagePanel from "./pages/pagePanel";
import PageSignup from "./pages/pageSignup";
import backdrop from "./pages/partials/modals/backdrop";
import modalsLoader from "./pages/partials/modals/modalsLoader";
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
    router.resolve();
    modalsLoader(appRootElement);
})(document.querySelector("#app")! as HTMLDivElement);
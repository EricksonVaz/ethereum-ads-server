import User from "../../models/user";

const logoEthereum = new URL("../../../img/ethereum.png?as=webp&width=50px",import.meta.url);

export default function navMenu(){
    return `
        <nav class="main-nav">
            ${loadNavMenuItem()}
        </nav>
    `;
}

function loadNavMenuItem(){
    return `
        <a class="nav-link-main" data-href="/">
            <img data-href="/" src="${logoEthereum}" alt="ethereun icon" class="navicon">
            <h1 data-href="/" class="nav-title">Aplicação<br> Demo ETH</h1>
        </a>
        <ul class="nav-menu">
            <li class="nav-item">
                <a class="nav-link" data-href="/about">Sobre</a>
            </li>
            ${(function(){
                if(User.isUserLogged()) return `
                    <li class="nav-item">
                        <a class="nav-link" data-href="/panel">Painel</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-href="/logout">Log Out</a>
                    </li>
                `;
                else return `
                    <li class="nav-item">
                        <a class="nav-link" data-href="/login">Login</a>
                    </li>
                `;
            })()}
        </ul>
    `;
}

export function refreshNavMenuState(callbackAddEventNav:Function){
    let navMenu = document.body.querySelector(".main-nav") as HTMLElement;
    navMenu.innerHTML = loadNavMenuItem();
    callbackAddEventNav(navMenu);
}
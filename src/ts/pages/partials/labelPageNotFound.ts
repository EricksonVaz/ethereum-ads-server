const logoETHForm = new URL("../../../img/ethereum.png?as=webp&width=168px",import.meta.url);
export default function labelPageNotFound(){
    return `
        <div class="container-page-not-found">
            <h1 class="error-title">404</h1>
            <h2 class="error-sub-title">Pagina não encontrada</h2>
            <h2 class="app-title">
                Ethereum Blockchain Server Advertisings
            </h2>
            <img src="${logoETHForm}" alt="logo eth">
            <a data-href="/" class="btn-nav">Inicio</a>
        </div>
    `
}
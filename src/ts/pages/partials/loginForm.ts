const logoETHForm = new URL("../../../img/ethereum.png?as=webp&width=168px",import.meta.url);
export default function loginForm(){
    return `
        <form class="form-login form-container">
            <div class="form-header">
                <img src="${logoETHForm}" alt="logo site" class="logo-form">
                <h3 class="form-title">Login</h3>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" name="email">
                <div class="form-feedback">Feedback aqui</div>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password">
                <div class="form-feedback"></div>
            </div>
            <button type="submit" class="btn">Entrar</button>
            <h4 class="form-link">Não tenho uma conta: <a data-href="/signup">Registrar-se</a></h4>
        </form>
    `;
}
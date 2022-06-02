const logoETHForm = new URL("../../../img/ethereum.png?as=webp&width=168px",import.meta.url);
export default function signupForm(){
    return `
        <form class="form-signup form-container">
            <div class="form-header">
                <img src="${logoETHForm}" alt="logo site" class="logo-form">
                <h3 class="form-title">Signup</h3>
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
            <div class="form-group">
                <label for="confirm">Confirmar Password</label>
                <input type="confirm" class="form-control" name="confirm">
                <div class="form-feedback"></div>
            </div>
            <button type="submit" class="btn">Registrar</button>
            <h4 class="form-link">Já tenho uma conta: <a data-href="/signup">Realizar Login</a></h4>
        </form>
    `;
}
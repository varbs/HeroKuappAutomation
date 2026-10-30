class LoginPage {
    constructor(page){
        this.page = page;

        this.usernameInput = this.page.getByLabel('Username');
        this.passwordInput = this.page.getByLabel('Password');
        
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
    }

    async login(username, password){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        
        await this.loginButton.click();
    }
}

module.exports = LoginPage;
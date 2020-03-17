import React, { useState } from 'react';

import './Login.css';

function Login({ onSubmit }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            if ((!email) || (!senha)) throw new Error('Campos de e-mail ou senha vazios.');
            if (!(/@fullengenharia.com/.test(email))) throw new Error('E-mail inválido');

            await onSubmit({
                email,
                senha
            });
        } catch(err) {
            return alert(err);
        }
    }

    return(
        <div className="login">
            <form onSubmit={handleLogin} name="form-login" >
                <fieldset>
                    <legend>Login</legend>
                    <hr/>
                    <div className="form-group">
                        <label htmlFor="email" className="email">
                            E-mail:
                        </label>
                        <input type="email" 
                            autoFocus 
                            name="email"
                            value={email}
                            placeholder="email@email.com" 
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="senha" className="senha">
                            Senha:
                        </label>
                        <input type="password" 
                            name="password"
                            value={senha} 
                            className="form-control"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <div className="button-css">
                        <button type="submit" id="btn-login" className="btn btn-primary btn-md">
                            Logar
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

export default Login;
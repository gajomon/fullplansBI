import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';

import store from './store';

import api from './services/api';
import Cabecalho from './components/Cabecalho';
import Rodape from './components/Rodape';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [projetos, setProjetos] = useState([]);
  const [login, setLogin] = useState(false);


  // configAuth
  //
  // Objeto com os dados da configuração de autorização que deve ser passado
  // nas rotas da API.
  const configAuth = {
    headers: {
      Authorization: 'Bearer ' + String(login.token)
    }
  }


  // loadProjetos()
  //
  // Carrega os projetos do banco de dados na primeira inicialização da plataforma.
  useEffect(() => {
    async function loadProjetos() {
      const response = await api.get('/projetos', configAuth);
      setProjetos(response.data);
    }

    if (login.auth === true) {
      loadProjetos();
      setStringPagina('Home');
    }
  // eslint-disable-next-line
  }, [login.auth]);


  // submitLogin()
  //
  // Faz o submit do formulário de login e salva as informações na variável login.
  async function submitLogin(data) {
    const response = await api.post('/login', data);
    setLogin(response.data);
    if (response.data.auth === false) {
      alert('Falha no login!');
    }
  }


  // decideWhatToDisplay()
  //
  // Função que determina qual component será renderizado, baseado no estado
  // de stringPagina.
  const [stringPagina, setStringPagina] = useState('');
  function decideWhatToDisplay() {
    switch(stringPagina){
      case 'Home':
        return <Home
          projetos={projetos} 
          />
      default:
        return <Login 
          setStringPagina={setStringPagina} 
          onSubmit={submitLogin}
          />
    }
  }


  return (
    <Provider store={store}>
      <div className="App">
        <Cabecalho />
        {
          decideWhatToDisplay()
        }
        <Rodape />
      </div>
    </Provider>
  );
}

export default App;

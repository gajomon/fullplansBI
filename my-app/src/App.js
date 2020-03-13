import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';

import store from './store';

import api from './services/api';
import Cabecalho from './components/Cabecalho';
import Rodape from './components/Rodape';

function App() {

  const [projetos, setProjetos] = useState([]);
  const [login, setLogin] = useState(false);


  const configAuth = {
    headers: {
      Authorization: 'Bearer ' + String(login.token)
    }
  }


  useEffect(() => {
    async function loadProjetos() {
      const response = await api.get('/projetos', configAuth);
      setProjetos(response.data);
    }

    if (login.auth === true) {
      loadProjetos();
    }

  // eslint-disable-next-line
  }, [login.auth]);


  return (
    <Provider store={store}>
      <div className="App">
        <Cabecalho />
        <h1>FULL PLans BI</h1>
        <Rodape />
      </div>
    </Provider>
  );
}

export default App;

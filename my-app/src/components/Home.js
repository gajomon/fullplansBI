import React from 'react';

import './Home.css';

// Mostrar quantos projetos foram cadastrados por mês ou por ano.
import ProjCadastrados from './Graficos/ProjCadastrados';
// Mostrar quantos projetos foram finalizados por mês, por ano ou por quem.
import ProjFinalizados from './Graficos/ProjFinalizados';

// Mostrar quantos projetos ficaram atrasados por mês, por ano ou por quem.
// Mostrar quantos projetos foram finalizados por mês, por ano ou por quem.

function Home({ projetos }) {
    return(
        <div className="showProjetos">
            <ProjCadastrados props={projetos} />
            <ProjFinalizados props={projetos} />
        </div>
    );
}

export default Home;
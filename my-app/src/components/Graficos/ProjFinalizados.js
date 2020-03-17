import React, { useState, useEffect } from 'react';
import Chartjs from 'chart.js';

import './ProjFinalizados.css';

// Dados que serão usados para simular o funcionamento da aplicação com uma boa quantidade
// de informações. O banco de dados atualmente não apresenta muitos dados, por isso optou-se
// por simular o funcionamento do mesmo.
import exemploDados from './exemploDados.json';
let dadosExemplo = exemploDados;


// MOSTRAR QUANTOS PROJETOS FORAM FINALIZADOS POR MÊS, POR ANO OU POR QUEM.
// props = projetos
function ProjFinalizados({ props }) {
    // Descrição de funcionamento desse componente:
    //
    // Projeto finalizado tem essa propriedade com esse valor:
    //      arquivado = true
    // Filtrar pelos campos: mês, ano, pessoa
    // Se for escolhido o mês: {
    //      o usuárop escolhe o ano, com base nos anos encontrados nos dados.
    //      o usuário escolhe a pessoa com base nas pessoas encontradas nos dados.
    // }
    // Se for escolhido o ano: {
    //      o usuário pode escolher a pessoa
    //      são mostrados os dados de 5 anos a partir do ano atual.  
    // }
    const [pessoasEncontradas, setPessoasEncontradas] = useState([]);

    const [opcaoInputRadio, setOpcaoInputRadio] = useState('');
    const [opcaoAnoSelect, setOpcaoAnoSelect] = useState('');
    const [opcaoPessoaSelect, setOpcaoPessoaSelect] = useState('');

    
    // pessoasEncontradas()
    //
    // Essa função é responsável por preencher um array com informações dos nomes
    // das pessoas que são salvas no banco de dados.
    useEffect(() => {
        function pessoasEncontradasFuncao() {
            let arrayPessoa = [],
                pessoaRepetida = false,
                aux;
            dadosExemplo.map(dado => {
                dado.infoProjetos.map(pessoa => {
                    for(aux = 0; aux < arrayPessoa.length; aux++) {
                        if (String(pessoa.projetistaDesenho) === String(arrayPessoa[aux])) {
                            pessoaRepetida = true;
                        }
                    }
                    if (!pessoaRepetida) {
                        arrayPessoa.push(String(pessoa.projetistaDesenho));
                    }
                    pessoaRepetida = false;
                    return null;
                });
                return null;
            });
            return arrayPessoa;
        }

        if (props.length > 0) {
            setPessoasEncontradas(pessoasEncontradasFuncao());
        }
    // eslint-disable-next-line
    }, [props]);


    const [chartInstance2, setChartInstance2] = useState(null);
    useEffect(() => {
        let chartConfig = {
            type: 'bar',
            data: {
                labels: 0,//dataEncontrada.x,
                datasets: [{
                    label: 'Quantidade de projetos cadastrados',
                    backgroundColor: 'rgb(24, 57, 190)',
                    data: 0//dataEncontrada.y
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Provisório'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        }

        if (document.getElementById('ProjFinalizadosCanvas')) {
            if (chartInstance2) chartInstance2.destroy();
            const newChartInstance2 = new Chartjs(document.getElementById('ProjFinalizadosCanvas').getContext('2d'), chartConfig);
            setChartInstance2(newChartInstance2);
        }
    // eslint-disable-next-line
    }, [opcaoAnoSelect, opcaoInputRadio]);


    // setOpcaoDeAnos()
    //
    // Essa função determina quais possibilidades de anos que serão mostradas para o usuário
    // com base no conjunto de dados do banco de dados.
    useEffect(() => {
        function setOpcaoDeAnos() {
            let tagSelect = document.getElementById('anoQueSeraMostradoProjFinalizados2'),
                anoEncontrado = [],
                anoAtual, 
                anoRepetido = false;

            tagSelect.innerHTML = '<option value="Todos os anos">Todos os anos</option>';
            dadosExemplo.map(data => {
                anoAtual = new Date(data.createdAt);
                anoAtual = anoAtual.getFullYear();
                anoRepetido = false;
                for(let aux = 0; aux < anoEncontrado.length; aux++) {
                    if (anoAtual === anoEncontrado[aux]) {
                        anoRepetido = true;
                    }
                }
                if (!anoRepetido) {
                    anoEncontrado.push(anoAtual);
                    anoEncontrado = anoEncontrado.sort();   
                }
                return undefined;
            });
            anoEncontrado.reverse().map(ano => {
                tagSelect.innerHTML += `<option value=${ano}>${ano}</option>`;
                return null;
            });
        }

        setOpcaoDeAnos();
    // eslint-disable-next-line
    }, [dadosExemplo]);


    // setOpcaoDePessoas()
    //
    // Essa função determina quais possibilidades de pessoas que serão mostradas para o usuário
    // com base no conjunto de dados do banco de dados.
    useEffect(() => {
        function setOpcaoDePessoas() {
            let tagSelect = document.getElementById('pessoaQueSeraMostradaProjFinalizados2');

            tagSelect.innerHTML = '<option value="Todas as pessoas">Todas as pessoas</option>';
            pessoasEncontradas.map(pessoa => {
                tagSelect.innerHTML += `<option value=${pessoa}>${pessoa}</option>`;
                return null;
            });
        }

        if (pessoasEncontradas.length > 0) {
            setOpcaoDePessoas();
        }
    // eslint-disable-next-line
    }, [pessoasEncontradas]);


    // Essa função lida com a opção que foi escolhida na tag <select> pelo usuário.
    function handleAnoSelectOption(e) {
        let id = e.target.selectedIndex;
        setOpcaoAnoSelect(e.target[id].text);
    }

    function handlePessoaSelectOption(e) {
        let id = e.target.selectedIndex;
        setOpcaoPessoaSelect(e.target[id].text);
    }

    return(
        <div id="ProjFinalizados">
            <h3 className="ProjFinalizados">Quantidade de projetos finalizados</h3>
            <input 
                type="radio" 
                id="pessoa2"
                className="pessoa2" 
                value="pessoa2"
                onClick={() => {setOpcaoInputRadio('pessoa')}} />
            <label htmlFor="pessoa2">Pessoa</label>

            <div className="selectTagPessoa">
                <select id="pessoaQueSeraMostradaProjFinalizados2" onChange={handlePessoaSelectOption}>
                    <option value="Todos as pessoas">Todos as pessoas</option>
                </select>
            </div>

            <input 
                type="radio" 
                id="mes2"
                className="mes2" 
                value="mes2"
                onClick={() => {setOpcaoInputRadio('mes')}} />
            <label htmlFor="mes2">Mês</label>

            <div className="selectTagAno">
                <select id="anoQueSeraMostradoProjFinalizados2" onChange={handleAnoSelectOption}>
                    <option value="Todos os anos">Todos os anos</option>
                </select>
            </div>

            <input 
                type="radio" 
                id="ano2"
                className="ano2" 
                value="ano2"
                onClick={() => {setOpcaoInputRadio('ano')}} />
            <label htmlFor="ano2">Ano</label>

            <div className="plot1">
                <canvas id="ProjFinalizadosCanvas" />
            </div>
        </div>
    )
}

export default ProjFinalizados;
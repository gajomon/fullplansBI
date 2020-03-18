import React, { useState, useEffect } from 'react';
import Chartjs from 'chart.js';

import './ProjFinalizados.css';

// Dados que serão usados para simular o funcionamento da aplicação com uma boa quantidade
// de informações. O banco de dados atualmente não apresenta muitos dados, por isso optou-se
// por essa alternativa.
import exemploDados from './exemploDados.json';
let dadosExemplo = exemploDados;


// MOSTRAR QUANTOS PROJETOS FORAM FINALIZADOS POR MÊS, POR ANO OU POR QUEM.
// props = projetos
function ProjFinalizados({ props }) {
    // Descrição de funcionamento desse componente:
    //
    // Projeto finalizado tem a propriedade arquivado com esse valor:
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
    const [opcaoAnoSelect, setOpcaoAnoSelect] = useState('Todos os anos');
    const [opcaoPessoaSelect, setOpcaoPessoaSelect] = useState('Todas as pessoas');
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [dadosParaMostrar, setDadosParaMostrar] = useState({});


    // Dados filtrados
    // Salva em uma variável de estado os projetos que foram finalizados (arquivados)
    useEffect(() => {
        function filtrarDados() {
            let dadosFiltrados = [];
            dadosExemplo.map(dado => {
                if (dado.arquivado) { // arquivado = finalizado
                    dadosFiltrados.push(dado);
                }
                return null;
            });
            setDadosFiltrados(dadosFiltrados);
        }

        filtrarDados();
    }, [props]);


    // defineDadosASeremMostrados()
    //
    // Essa função é responsável por salvar em uma variável de estado os valores que
    // serão usados para plotar o gráfico.
    useEffect(() => {
        function defineDadosASeremMostrados() {
            let objMostrar = {
                    x: [],
                    y: []
                },
                dataArquivado,
                indice,
                projetista;
                
            if (opcaoInputRadio === 'mes') {
                // Popular os dados de x com meses e y com 0:
                for(var cont = 0; cont < 12; cont++) {
                    objMostrar.x.push(cont + 1);
                    objMostrar.y.push(0);
                }
                if (opcaoPessoaSelect === 'Todas as pessoas') {
                    if (opcaoAnoSelect === 'Todos os anos') {
                        dadosFiltrados.map(dado => {
                            dataArquivado = new Date(dado.dataArquivado);
                            indice = dataArquivado.getMonth();
                            objMostrar.y[indice]++; // Incrementa o valor salvo na posição do mês
                            return null;
                        })
                    } else {
                        dadosFiltrados.map(dado => {
                            dataArquivado = new Date(dado.dataArquivado);
                            if (String(dataArquivado.getFullYear()) === String(opcaoAnoSelect)) {
                                indice = dataArquivado.getMonth();
                                objMostrar.y[indice]++; // Incrementa o valor salvo na posição do mês
                            }
                            return null;
                        });
                    }
                } else {
                    if (opcaoAnoSelect === 'Todos os anos') {
                        dadosFiltrados.map(dado => {
                            dado.infoProjetos.map(infoProjeto => {
                                if (String(infoProjeto.projetistaDesenho) === String(opcaoPessoaSelect)) {
                                    if (String(projetista) !== String(opcaoPessoaSelect)) {
                                        dataArquivado = new Date(dado.dataArquivado)
                                        indice = dataArquivado.getMonth();
                                        objMostrar.y[indice]++;
                                        projetista = opcaoPessoaSelect;
                                    }
                                }
                                return null;
                            });
                            projetista = '';
                            return null;
                        });
                    } else {
                        dadosFiltrados.map(dado => {
                            dataArquivado = new Date(dado.dataArquivado);
                            if (String(dataArquivado.getFullYear()) === String(opcaoAnoSelect)) {
                                dado.infoProjetos.map(infoProjeto => {
                                    if (String(infoProjeto.projetistaDesenho) === String(opcaoPessoaSelect)) {
                                        if (String(projetista) !== String(opcaoPessoaSelect)) {
                                            dataArquivado = new Date(dado.dataArquivado)
                                            indice = dataArquivado.getMonth();
                                            objMostrar.y[indice]++;
                                            projetista = opcaoPessoaSelect;
                                        }
                                    }
                                    return null;
                                });
                            }
                            projetista = '';
                            return null;
                        });
                    }
                }
            } else if (opcaoInputRadio === 'ano') {
                let anoAtual = new Date(Date.now()).getFullYear();
                // Preenche os dados do eixo X que serão mostrados
                for (let cont = 0; cont <= 4; cont++) {
                    objMostrar.x.push(anoAtual - cont);
                    objMostrar.y.push(0);
                }
                if (opcaoPessoaSelect === 'Todas as pessoas') {
                    if (opcaoAnoSelect === 'Todos os anos') {
                        dadosFiltrados.map(dado => {
                            dataArquivado = new Date(dado.dataArquivado);
                            indice = Number(anoAtual - dataArquivado.getFullYear());
                            objMostrar.y[indice]++; // Incrementa o valor salvo na posição do ano
                            return null;
                        });
                        objMostrar.x = objMostrar.x.reverse();
                        objMostrar.y = objMostrar.y.reverse();
                    }
                }
            }
            console.log('objMostrar', objMostrar)
            setDadosParaMostrar(objMostrar);
        }

        defineDadosASeremMostrados();
    }, [opcaoInputRadio, opcaoAnoSelect, opcaoPessoaSelect, dadosFiltrados]);


    // Hook usado para plotar os dados com base nas informações pertinentes obtidas do
    // banco de dados.
    const [chartInstance2, setChartInstance2] = useState('');
    useEffect(() => {
        let textTitle,
            labelStringValueX;
        if (opcaoInputRadio === 'mes') {
            textTitle = `Filtro: Mês. Ano: ${opcaoAnoSelect}. Pessoa: ${opcaoPessoaSelect}`;
            labelStringValueX = 'Mês';
        } else if((opcaoInputRadio === 'ano')) {
            textTitle = `Filtro: Ano. Pessoa: ${opcaoPessoaSelect}`;
            labelStringValueX = 'Ano';
        } else {
            textTitle = '';
            labelStringValueX = '';
        }

        let chartConfig = {
            type: 'bar',
            data: {
                labels: dadosParaMostrar.x,
                datasets: [{
                    label: 'Quantidade de projetos finalizados',
                    backgroundColor: 'rgb(134, 57, 23)',
                    data: dadosParaMostrar.y
                }]
            },
            options: {
                title: {
                    display: true,
                    text: textTitle
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: labelStringValueX
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
    }, [opcaoAnoSelect, opcaoPessoaSelect, opcaoInputRadio, dadosParaMostrar]);


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
            dadosFiltrados.map(data => {
                anoAtual = new Date(data.dataArquivado);
                anoAtual = anoAtual.getFullYear();
                anoRepetido = false;
                for(let aux = 0, len = anoEncontrado.length; aux < len; aux++) {
                    if (anoAtual === anoEncontrado[aux]) {
                        anoRepetido = true;
                    }
                }
                if (!anoRepetido) {
                    anoEncontrado.push(anoAtual);
                    anoEncontrado = anoEncontrado.sort();   
                }
                return null;
            });
            anoEncontrado.reverse().map(ano => {
                tagSelect.innerHTML += `<option value=${ano}>${ano}</option>`;
                return null;
            });
        }

        setOpcaoDeAnos();
    // eslint-disable-next-line
    }, [dadosFiltrados]);


    // pessoasEncontradas()
    //
    // Essa função é responsável por preencher um array com informações dos nomes
    // das pessoas que são salvas no banco de dados.
    useEffect(() => {
        function pessoasEncontradasFuncao() {
            let arrayPessoa = [],
                pessoaRepetida = false,
                aux;
            dadosFiltrados.map(dado => {
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
            <h3 className="ProjFinalizados">Projetos finalizados</h3>

            <input 
                type="radio" 
                id="mes2"
                name="ProjFinalizados" 
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
                name="ProjFinalizados" 
                value="ano2"
                onClick={() => {setOpcaoInputRadio('ano')}} />
            <label htmlFor="ano2">Ano</label>

            <div className="selectTagPessoa">
                <select id="pessoaQueSeraMostradaProjFinalizados2" onChange={handlePessoaSelectOption}>
                    <option value="Todas as pessoas">Todas as pessoas</option>
                </select>
            </div>

            <div className="plot1">
                <canvas id="ProjFinalizadosCanvas" />
            </div>
        </div>
    )
}

export default ProjFinalizados;
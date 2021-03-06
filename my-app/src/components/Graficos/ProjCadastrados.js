import React, { useState, useEffect } from 'react';
import Chartjs from 'chart.js';

import './ProjCadastrados.css';

// Dados de exemplo para testes, pois o banco de dados atual não
// possui muitos valores.
let dataExemplo = [
    {createdAt: new Date(2019, 6, 19)}, //7
    {createdAt: new Date(2017, 5, 19)}, //6
    {createdAt: new Date(2018, 6, 19)}, //7
    {createdAt: new Date(2018, 6, 19)}, //7
    {createdAt: new Date(2020, 0, 19)}, //1
    {createdAt: new Date(2020, 1, 2)}, //2
    {createdAt: new Date(2020, 1, 3)}, //2
    {createdAt: new Date(2020, 1, 3)}, //2
    {createdAt: new Date(2020, 2, 2)}, //3
    {createdAt: new Date(2020, 2, 5)}, //3
    {createdAt: new Date(2020, 3, 14)}, //4
    {createdAt: new Date(2020, 3, 22)}, //4
    {createdAt: new Date(2020, 3, 17)}, //4
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 7, 13)}, //8
    {createdAt: new Date(2020, 7, 13)}, //8
    {createdAt: new Date(2020, 7, 13)}, //8
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 2, 6)}, //3
    {createdAt: new Date(2020, 11, 6)} //12
]; //[1->1, 2->3, 3->11, 4->3, 6->1, 7->3, 8->3, 12->1]

// MOSTRAR QUANTOS PROJETOS FORAM CADASTRADOS POR MÊS OU POR ANO.
// props = projetos
// funcao pra setar o intervalo (mes ou ano) -> ESTADO DE OPCAO.
// funcao pra plotar o grafico.
function ProjCadastrados({ props }) {
    const [opcaoInputRadio1, setOpcaoInputRadio1] = useState('');
    const [dataEncontrada1, setDataEncontrada1] = useState({});
    const [opcaoSelect1, setOpcaoSelect1] = useState("Todos os anos");

    /*  // Código para lidar com os dados do banco de dados quando o sistema estiver
        // em atuação real.
        // Quando for colocar em implementação, deve-re retirar a variável dataExemplo,
        // e alterar para o valor de props.
    function handleDateMongoDB(date) {
        let d1 = new Date(String(date));
        return {createdAt: d1};
    }

    if (props) {
        dataExemplo = [];
        props.map(prop => {
            return dataExemplo.push(handleDateMongoDB(prop.createdAt))
        });
        console.log(dataExemplo)
    }
    */


    // defineDataEncontrada()
    //
    // Esse Hook é responsável por definir os dados que serão mostrados no gráfico
    // plotado com o ChartJS.
    // Ele faz suas instruções e salva o resultado na variável de estado dataEncontrada1.
    useEffect(() => {
        // new Date(ano, mês, dia) -> Sintaxe para criar uma data
        function defineDataEncontrada() {
            let objPlot = {
                    x: [],
                    y: []
                },
                indice,
                aux;

            if (opcaoInputRadio1 === 'mes') {
                // Incializa as propriedades de objPlot com os valores necessários.
                for (aux = 0; aux < 12; aux++) {
                    objPlot.x.push(aux+1);
                    objPlot.y.push(0);
                }

                if (opcaoSelect1 === 'Todos os anos') {
                    dataExemplo.map(data => {
                        indice = (data.createdAt.getMonth());
                        objPlot.y[indice]++; // Incrementa o valor salvo na posição do mês
                        return null;
                    });
                } else {
                    dataExemplo.map(data => {
                        if (Number(data.createdAt.getFullYear()) === Number(opcaoSelect1)) {
                            indice = (data.createdAt.getMonth());
                            objPlot.y[indice]++;
                        }
                        return null;
                    });
                }
            } else if (opcaoInputRadio1 === 'ano') {
                var anoAtual = new Date(Date.now()).getFullYear();
                for (aux = -4; aux <= 0; aux++) {
                    objPlot.x.push(anoAtual + aux);
                    objPlot.y.push(0);
                }
                dataExemplo.map(data => {
                    indice = (data.createdAt.getFullYear());
                    switch(Math.abs(indice - anoAtual)) {
                        case 0:
                            objPlot.y[4]++;
                            break;
                        case 1:
                            objPlot.y[3]++;
                            break;
                        case 2:
                            objPlot.y[2]++;
                            break;
                        case 3:
                            objPlot.y[1]++;
                            break;
                        case 4:
                            objPlot.y[0]++;
                            break;
                        default:
                            break;
                    }
                    return undefined;
                });
            }
            setDataEncontrada1(objPlot);
        }

        defineDataEncontrada();
    // Esse Hook deve ser chamado sempre que o valor selecionado pelo usuário do período
    // de tempo for alterado (mês ou ano), e quando estando selecionado o mês, o usuário
    // mudar o ano que deseja visualizar os dados. Além disso, caso haja uma alteração
    // na propriedade passada para essa função, ela deve ser re-executada também.
    }, [opcaoInputRadio1, opcaoSelect1, props]);


    const [chartInstance1, setChartInstance1] = useState(null);
    // Define a configuração do gráfico que irá mostrar os dados e plota-o no canvas.
    useEffect(() => {
        let textTitle,
            labelStringValueX;
        if (opcaoInputRadio1 === 'mes') {
            textTitle = `Filtro: Mês. Ano: ${opcaoSelect1}`;
            labelStringValueX = 'Mês';
        } else if((opcaoInputRadio1 === 'ano')) {
            textTitle = `Filtro: Ano`;
            labelStringValueX = 'Ano';
        } else {
            textTitle = '';
            labelStringValueX = '';
        }

        let chartConfig = {
            type: 'bar',
            data: {
                labels: dataEncontrada1.x,
                datasets: [{
                    label: 'Quantidade de projetos cadastrados',
                    backgroundColor: 'rgb(24, 57, 190)',
                    data: dataEncontrada1.y
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

        if (document.getElementById('ProjCadastradosCanvas')) {
            if (chartInstance1) chartInstance1.destroy();
            const newChartInstance = new Chartjs(document.getElementById('ProjCadastradosCanvas').getContext('2d'), chartConfig);
            setChartInstance1(newChartInstance);
        }
    // Essa função será re-renderizada sempre que o conjunto de dados encontrado mudar.
    // eslint-disable-next-line
    }, [dataEncontrada1]);


    // setOpcaoDeAnos()
    //
    // Essa função determina quais possibilidades de anos que serão mostradas na tag select
    // para o usuário com base no conjunto de dados do banco de dados.
    useEffect(() => {
        function setOpcaoDeAnos() {
            let tagSelect = document.getElementById('anoQueSeraMostradoProjCadastrados'),
                anoEncontrado = [],
                anoAtual, 
                anoRepetido = false;

            tagSelect.innerHTML = '<option value="Todos os anos">Todos os anos</option>';
            dataExemplo.map(data => {
                anoAtual = data.createdAt.getFullYear();
                anoRepetido = false;
                for(let aux = 0; aux < anoEncontrado.length; aux++) {
                    if (anoAtual === anoEncontrado[aux]) {
                        anoRepetido = true;
                    }
                }
                if (!anoRepetido) {
                    anoEncontrado.push(anoAtual);
                }
                return undefined;
            });
            anoEncontrado = anoEncontrado.sort(); 
            anoEncontrado.reverse().map(ano => {
                tagSelect.innerHTML += `<option value=${ano}>${ano}</option>`;
                return null;
            });
        }

        setOpcaoDeAnos();
    // eslint-disable-next-line
    }, [dataExemplo]);


    // Essa função lida com a opção que foi escolhida na tag <select> pelo usuário.
    // Ela detecta essa escolha do usuário e salva na variável de estado opcaoSelect1.
    function handleSelectOption(e) {
        let id = e.target.selectedIndex;
        //console.log(e.target[id].text); // Pega o valor do innerHTML do select selecionado.
        setOpcaoSelect1(e.target[id].text);
    }
    

    return (
        <div id="ProjCadastrados" >
            <h3 className="ProjCadastrados">Projetos cadastrados</h3>
            <div className="grid-container">
                <nav>
                    <h4 className="nav-title">Menu</h4>
                    <div className="option-box">
                        <input 
                            type="radio" 
                            id="mes1" 
                            name="ProjCadastrados"
                            value="mes1"
                            onClick={() => {setOpcaoInputRadio1('mes')}} />
                        <label htmlFor="mes1">Mês</label>

                        <select id="anoQueSeraMostradoProjCadastrados" onChange={handleSelectOption}>
                            <option value="Todos os anos">Todos os anos</option>
                        </select>
                    </div>
                    
                    <div className="option-box">
                        <input 
                            type="radio" 
                            id="ano1" 
                            name="ProjCadastrados"
                            value="ano1"
                            onClick={() => {setOpcaoInputRadio1('ano')}} />
                        <label htmlFor="ano1">Ano</label>
                    </div>
                </nav>
            
                <div className="plot1">
                    <canvas id="ProjCadastradosCanvas" />
                </div>
            </div>
        </div>
    )
}

export default ProjCadastrados;
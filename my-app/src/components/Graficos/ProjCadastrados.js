import React, { useState, useEffect, useRef } from 'react';
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
    const [opcaoInputRadio, setOpcaoInputRadio] = useState('');
    const [dataEncontrada, setDataEncontrada] = useState({});
    const [opcaoSelect, setOpcaoSelect] = useState("Todos os anos");

    /*  // Código para lidar com os dados do banco de dados quando o sistema estiver
        // em atuação real.
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


    // Esse Hook é responsável por definir os dados que serão mostrados no gráfico
    // plotado com o ChartJS
    useEffect(() => {
        // new Date(ano, mês, dia) -> Sintaxe para criar uma data
        function defineDataEncontrada() {
            let objPlot = {
                    x: [],
                    y: []
                },
                indice,
                aux;

            if (opcaoInputRadio === 'mes') {
                // Incializa as propriedades de objPlot com os valores
                // necessários.
                for (aux = 0; aux < 12; aux++) {
                    objPlot.x.push(aux+1);
                    objPlot.y.push(0);
                }

                if (opcaoSelect === 'Todos os anos') {
                    dataExemplo.map(data => {
                        indice = (data.createdAt.getMonth());
                        objPlot.y[indice]++;
                        return null;
                    });
                } else {
                    dataExemplo.map(data => {
                        if (Number(data.createdAt.getFullYear()) === Number(opcaoSelect)) {
                            indice = (data.createdAt.getMonth());
                            objPlot.y[indice]++;
                        }
                        return null;
                    });
                }
            } else if (opcaoInputRadio === 'ano') {
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
            setDataEncontrada(objPlot);
        }

        defineDataEncontrada();
    // Esse Hook deve ser chamado sempre que o valor selecionado pelo usuário do período
    // de tempo for alterado (mês ou ano), e quando estando selecionado o mês, o usuário
    // mudar o ano que deseja visualizar os dados.
    }, [opcaoInputRadio, opcaoSelect]);


    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    // Define a configuração do gráfico que irá mostrar os dados.
    // Nesse Hook é usado o conteúdo de um outro Hook chamado useRef. O useRef guarda em
    // sua propriedade .current uma referência para o elemento do DOM que tem a propriedade
    // ref. Desta forma, ele substitui o document.getElementById('') que faz a mesma coisa.
    useEffect(() => {
        let textTitle;
        if (opcaoInputRadio === 'mes') {
            textTitle = `Filtro: ${opcaoInputRadio}, ano: ${opcaoSelect}`;
        } else {
            textTitle = `Filtro: ${opcaoInputRadio}`;
        }

        let chartConfig = {
            type: 'bar',
            data: {
                labels: dataEncontrada.x,
                datasets: [{
                    label: 'Quantidade de projetos cadastrados',
                    backgroundColor: 'rgb(24, 57, 190)',
                    data: dataEncontrada.y
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
                    }]
                }
            }
        }

        if (chartContainer && chartContainer.current) {
            if (chartInstance) chartInstance.destroy();
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    // eslint-disable-next-line
    }, [chartContainer, dataEncontrada]);


    // setOpcaoDeAnos()
    //
    // Essa função determina quais possibilidades de anos que serão mostradas para o usuário
    // com base no conjunto de dados do banco de dados.
    useEffect(() => {
        function setOpcaoDeAnos() {
            let tagSelect = document.getElementById('anoQueSeraMostrado'),
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
    }, [dataExemplo]);


    // Essa função lida com a opção que foi escolhida na tag <select> pelo usuário.
    function handleSelectOption(e) {
        let id = e.target.selectedIndex;
        setOpcaoSelect(e.target[id].text);
    }
    

    return(
        <div id="ProjCadastrados" >
            <h2 className="ProjCadastrados">Quantidade de projetos cadastrados</h2>
            <input 
                type="radio" 
                id="mes" 
                name="periodo" 
                value="mes"
                onClick={() => {setOpcaoInputRadio('mes')}} />
            <label htmlFor="mes">Mês</label>
            <div className="selectTag">
                <select id="anoQueSeraMostrado" onChange={handleSelectOption}>
                    <option value="Todos os anos">Todos os anos</option>
                </select>
            </div>
            <input 
                type="radio" 
                id="ano" 
                name="periodo" 
                value="ano"
                onClick={() => {setOpcaoInputRadio('ano')}} />
            <label htmlFor="ano">Ano</label>
            <div className="plot1">
                <canvas ref={chartContainer} />
            </div>
        </div>
    )
}

export default ProjCadastrados;
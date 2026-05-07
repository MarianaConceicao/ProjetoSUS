let unidadesData = [
    { id: 1, nome: "UBS Central", distancia: 2.5, horario: "Aberto até 18h", tempoEspera: 15, aberto: true },
    { id: 2, nome: "Clínica da Família", distancia: 0.8, horario: "24h", tempoEspera: 45, aberto: true },
    { id: 3, nome: "PSF Bairro Novo", distancia: 5.1, horario: "Fechado", tempoEspera: 0, aberto: false },
    { id: 4, nome: "UPA 24 Horas", distancia: 1.2, horario: "24h", tempoEspera: 75, aberto: true },
    { id: 5, nome: "Posto do Sol", distancia: 3.9, horario: "Aberto até 17h", tempoEspera: 22, aberto: true }
];

const listaUnidadesElement = document.getElementById('lista-unidades');
const buscaInput = document.getElementById('busca-unidade');
const ordenarSelect = document.getElementById('ordenar-por');

/**
 
 
 * @param {number} tempo 
 * @param {boolean} aberto 
 * @returns {string}
 */
function determinarLotacao(tempo, aberto) {
    if (!aberto || tempo === 0) return 'fechado';
    if (tempo <= 20) return 'baixa'; 
    if (tempo <= 50) return 'media';
    return 'alta'; 
}

/**
 
 * @param {Array<Object>} unidades 
 */
function renderizarUnidades(unidades) {
    listaUnidadesElement.innerHTML = ''; 

    
    const unidadesOrdenadas = aplicarOrdenacao(unidades);

    if (unidadesOrdenadas.length === 0) {
        listaUnidadesElement.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhuma unidade encontrada ou que corresponda ao filtro.</p>';
        return;
    }

    unidadesOrdenadas.forEach(unidade => {
        const lotacao = determinarLotacao(unidade.tempoEspera, unidade.aberto);
        const tempoDisplay = lotacao === 'fechado' ? 'Fechado' : `${unidade.tempoEspera} min`;
        const labelLotacao = lotacao.charAt(0).toUpperCase() + lotacao.slice(1); // Ex: Baixa

        const html = `
            <article class="unidade" data-id="${unidade.id}" data-lotacao="${lotacao}">
                <div class="status-fila" aria-label="Status da fila: ${labelLotacao}">
                    <span class="icone-status" role="img"></span>
                    <p class="tempo-espera">Espera Estimada: ${tempoDisplay}</p>
                    <span class="label-lotacao">${labelLotacao}</span> 
                </div>

                <div class="info-detalhes">
                    <h2>${unidade.nome}</h2>
                    <p class="distancia" aria-label="Distância">${unidade.distancia} km</p>
                    <p class="horario" aria-label="Horário de Funcionamento">${unidade.horario} (Ver horários de atendimento)</p>
                    <button class="detalhes-btn" aria-expanded="false" aria-controls="historico-${unidade.id}">Detalhes e Histórico</button>
                    <div id="historico-${unidade.id}" class="historico" hidden>
                        <p>Histórico: Ontem: ${unidade.tempoEspera + 5} min. Média da manhã: ${unidade.tempoEspera - 3} min.</p>
                    </div>
                </div>
            </article>
        `;
        listaUnidadesElement.innerHTML += html;
    });


    adicionarOuvintesDetalhes();
}
/**
 
 * @param {Array<Object>} unidades 
 * @returns {Array<Object>} 
 */



function aplicarOrdenacao(unidades) {
    const criterio = ordenarSelect.value;

    return [...unidades].sort((a, b) => {
        if (criterio === 'espera-menor') {

            if (a.aberto && !b.aberto) return -1;
            if (!a.aberto && b.aberto) return 1;
            return a.tempoEspera - b.tempoEspera;
        } else if (criterio === 'distancia-menor') {
            return a.distancia - b.distancia;
        }
        return 0;
    });
}


function aplicarFiltro() {
    const termoBusca = buscaInput.value.toLowerCase().trim();

    const unidadesFiltradas = unidadesData.filter(unidade => {

        return unidade.nome.toLowerCase().includes(termoBusca) ||
            unidade.horario.toLowerCase().includes(termoBusca) ||
            (unidade.distancia.toString().includes(termoBusca) && termoBusca.length > 0);
    });

    renderizarUnidades(unidadesFiltradas);
}


function atualizarDados() {
    unidadesData = unidadesData.map(u => {

        if (u.aberto) {
            const variacao = Math.floor(Math.random() * 11) - 5;
            const novoTempo = Math.max(5, u.tempoEspera + variacao);
            return { ...u, tempoEspera: novoTempo };
        }
        return u;
    });


    aplicarFiltro();

    console.log("Dados atualizados em tempo real. Novas previsões enviadas.");
}


function adicionarOuvintesDetalhes() {
    document.querySelectorAll('.detalhes-btn').forEach(button => {
        button.addEventListener('click', () => {
            const historicoId = button.getAttribute('aria-controls');
            const historicoDiv = document.getElementById(historicoId);
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            historicoDiv.hidden = isExpanded;
            button.setAttribute('aria-expanded', !isExpanded);
        });
    });
}



renderizarUnidades(unidadesData);


buscaInput.addEventListener('input', aplicarFiltro);
ordenarSelect.addEventListener('change', aplicarFiltro);

setInterval(atualizarDados, 30000); 
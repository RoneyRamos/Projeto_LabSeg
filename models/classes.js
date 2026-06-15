// ==========================================
// ARQUITETURA POO COMPLETA - 10 CLASSES
// ==========================================

class Colaborador {
    constructor(id, nome, setor, cargo) {
        this.id = id;
        this.nome = nome;
        this.setor = setor; 
        this.cargo = cargo; 
        this.epi = null;     
        this.exame = new ExameMedico(); 
        this.treinamento = new Treinamento(); 
    }
}

class Setor {
    constructor(nome) { this.nome = nome; }
    obterSetor() { return this.nome; }
}

class Cargo {
    constructor(nome) { this.nome = nome; }
    obterCargo() { return this.nome; }
}

class EPI {
    constructor(nome) {
        this.nome = nome;
        this.statusEntrega = "Entregue";
    }
    obterEpiInfo() { return this.nome; }
}

class ControleEPI {
    constructor() { this.totalEntregues = 0; }
    incrementarEPI() { this.totalEntregues++; }
    decrementarEPI() { if(this.totalEntregues > 0) this.totalEntregues--; }
}

class RegistroAcidente {
    constructor(id, data, local, descricao) {
        this.id = id;
        this.data = data;
        this.local = local;
        this.descricao = descricao;
    }
}

class ExameMedico {
    constructor() {
        this.tipo = "Não Cadastrado";
        this.status = "Pendente";
        this.possuiExame = false;
    }
    atualizarDados(tipo, status) {
        this.tipo = tipo;
        this.status = status;
        this.possuiExame = true;
    }
    resetar() {
        this.tipo = "Não Cadastrado";
        this.status = "Pendente";
        this.possuiExame = false;
    }
}

class Treinamento {
    constructor() {
        this.obrigatorio = "Não Vinculado";
        this.validade = "Pendente";
        this.possuiTreinamento = false;
    }
    atualizarDados(nome, validade) {
        this.obrigatorio = nome;
        this.validade = validade;
        this.possuiTreinamento = true;
    }
    resetar() {
        this.obrigatorio = "Não Vinculado";
        this.validade = "Pendente";
        this.possuiTreinamento = false;
    }
}

class InspecaoSeguranca {
    constructor(id, local, statusPredial) { 
        this.id = id;
        this.local = local;
        this.statusPredial = statusPredial; 
    }
}

// Classe Central do Ecossistema (Gerenciador Global)
class SistemaSST {
    constructor() {
        this.colaboradores = [];
        this.acidentes = [];
        this.inspecoes = [];
        this.contadorIdColab = 101;
        this.contadorIdAcidente = 201;
        this.contadorIdInspecao = 301;
        this.controleEpiGlobal = new ControleEPI();
    }

    // Métodos - Colaboradores
    adicionarFuncionario(nome, nomeSetor, nomeCargo) {
        const s = new Setor(nomeSetor);
        const c = new Cargo(nomeCargo);
        const novo = new Colaborador(this.contadorIdColab++, nome, s, c);
        this.colaboradores.push(novo);
        return novo;
    }
    listarTodos() { return this.colaboradores; }
    buscarPorId(id) { return this.colaboradores.find(item => item.id === parseInt(id)); }
    
    removerFuncionario(id) { 
        const funcionario = this.buscarPorId(id);
        if(funcionario && funcionario.epi) {
            this.controleEpiGlobal.decrementarEPI();
        }
        this.colaboradores = this.colaboradores.filter(item => item.id !== parseInt(id)); 
    }

    // Métodos - EPIs
    vincularEPI(id, nomeEpi) {
        const funcionario = this.buscarPorId(id);
        if (funcionario) {
            if(!funcionario.epi) this.controleEpiGlobal.incrementarEPI();
            funcionario.epi = new EPI(nomeEpi);
        }
    }
    removerEpiDeFuncionario(id) {
        const funcionario = this.buscarPorId(id);
        if (funcionario && funcionario.epi) {
            funcionario.epi = null;
            this.controleEpiGlobal.decrementarEPI();
        }
    }

    // Métodos - Exames Médicos
    atualizarExameColaborador(id, tipo, status) {
        const funcionario = this.buscarPorId(id);
        if (funcionario) funcionario.exame.atualizarDados(tipo, status);
    }
    removerExameColaborador(id) {
        const funcionario = this.buscarPorId(id);
        if (funcionario) funcionario.exame.resetar();
    }

    // Métodos - Treinamentos
    atualizarTreinamentoColaborador(id, nomeTreinamento, validade) {
        const funcionario = this.buscarPorId(id);
        if (funcionario) funcionario.treinamento.atualizarDados(nomeTreinamento, validade);
    }
    removerTreinamentoColaborador(id) {
        const funcionario = this.buscarPorId(id);
        if (funcionario) funcionario.treinamento.resetar();
    }

    // Métodos - Registro de Acidentes
    registrarAcidente(data, local, descricao) {
        const novoAcidente = new RegistroAcidente(this.contadorIdAcidente++, data, local, descricao);
        this.acidentes.push(novoAcidente);
    }
    obterAcidentes() { return this.acidentes; }
    removerAcidente(id) { this.acidentes = this.acidentes.filter(item => item.id !== parseInt(id)); }

    // Métodos - Inspeções
    registrarInspecao(local, status) {
        const novaInspecao = new InspecaoSeguranca(this.contadorIdInspecao++, local, status);
        this.inspecoes.push(novaInspecao);
    }
    obterInspecoes() { return this.inspecoes; }
    removerInspecao(id) { this.inspecoes = this.inspecoes.filter(item => item.id !== parseInt(id)); }
}

const sistema = new SistemaSST();

// ==========================================
// ROTEAMENTO DE NAVEGAÇÃO INTERATIVA
// ==========================================
function mudarPagina(idPagina) {
    document.querySelectorAll('.ue-page').forEach(pagina => pagina.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(botao => botao.classList.remove('active'));

    const paginaAlvo = document.getElementById(`pag-${idPagina}`);
    if (paginaAlvo) paginaAlvo.classList.add('active');

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    renderDados();
}
window.mudarPagina = mudarPagina;

// ==========================================
// CAPTURA DOS FORMULÁRIOS
// ==========================================

document.getElementById('form-colaborador').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.adicionarFuncionario(
        document.getElementById('colab-nome').value,
        document.getElementById('colab-setor').value,
        document.getElementById('colab-cargo').value
    );
    document.getElementById('form-colaborador').reset();
    renderDados();
});

document.getElementById('form-epi').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.vincularEPI(
        document.getElementById('epi-colab-select').value,
        document.getElementById('epi-nome').value
    );
    document.getElementById('form-epi').reset();
    renderDados();
});

document.getElementById('form-exame').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.atualizarExameColaborador(
        document.getElementById('exame-colab-select').value,
        document.getElementById('exame-tipo').value,
        document.getElementById('exame-status').value
    );
    document.getElementById('form-exame').reset();
    renderDados();
});

document.getElementById('form-treinamento').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.atualizarTreinamentoColaborador(
        document.getElementById('treinamento-colab-select').value,
        document.getElementById('treinamento-nome').value,
        document.getElementById('treinamento-validade').value
    );
    document.getElementById('form-treinamento').reset();
    renderDados();
});

document.getElementById('form-acidente').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.registrarAcidente(
        document.getElementById('acidente-data').value,
        document.getElementById('acidente-local').value,
        document.getElementById('acidente-descricao').value
    );
    document.getElementById('form-acidente').reset();
    renderDados();
});

document.getElementById('form-inspecao').addEventListener('submit', (e) => {
    e.preventDefault();
    sistema.registrarInspecao(
        document.getElementById('inspecao-local').value,
        document.getElementById('inspecao-status').value
    );
    document.getElementById('form-inspecao').reset();
    renderDados();
});

// ==========================================
// ENGENHARIA DE RENDERIZAÇÃO COM EXCLUSÕES MUDADAS
// ==========================================

function renderDados() {
    const todos = sistema.listarTodos();
    const acidentes = sistema.obterAcidentes();
    const inspecoes = sistema.obterInspecoes();

    // Sincronização dos Relatórios Gerais (Painel Home)
    document.getElementById('kpi-total-colab').innerText = todos.length;
    document.getElementById('kpi-total-epis').innerText = sistema.controleEpiGlobal.totalEntregues;
    document.getElementById('kpi-total-acidentes').innerText = acidentes.length;
    document.getElementById('kpi-total-inspecoes').innerText = inspecoes.length;

    // Atualizando as caixas de seleção
    document.querySelectorAll('.select-colaboradores').forEach(selectElement => {
        const valorSelecionadoAnterior = selectElement.value;
        selectElement.innerHTML = '<option value="" disabled selected hidden></option>';
        todos.forEach(f => {
            selectElement.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
        });
        selectElement.value = valorSelecionadoAnterior;
    });

    const listaColab = document.getElementById('lista-colaboradores');
    const listaEpis = document.getElementById('lista-epis');
    const listaExames = document.getElementById('lista-exames');
    const listaTreinamentos = document.getElementById('lista-treinamentos');
    const listaAcidentes = document.getElementById('lista-acidentes');
    const listaInspecoes = document.getElementById('lista-inspecoes');

    listaColab.innerHTML = ''; listaEpis.innerHTML = ''; listaExames.innerHTML = ''; 
    listaTreinamentos.innerHTML = ''; listaAcidentes.innerHTML = ''; listaInspecoes.innerHTML = '';

    // Render - Módulo Equipe
    todos.forEach(f => {
        listaColab.innerHTML += `
            <div class="item-card">
                <div>
                    <h4>${f.nome}</h4>
                    <p style="color:var(--text-dim); font-size:13px;">${f.setor.obterSetor()} // ${f.cargo.obterCargo()}</p>
                </div>
                <button class="btn-delete" onclick="deletarColab(${f.id})">Excluir</button>
            </div>`;

        // Render - Módulo EPIs
        if (f.epi) {
            listaEpis.innerHTML += `
                <div class="item-card">
                    <div>
                        <h4>${f.epi.obterEpiInfo()}</h4>
                        <p style="color:var(--text-dim); font-size:13px;">Usuário: ${f.nome}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span class="status-badge">${f.epi.statusEntrega}</span>
                        <button class="btn-delete" onclick="deletarEpi(${f.id})">Apagar</button>
                    </div>
                </div>`;
        }

        // Render - Módulo Saúde/ASO
        if (f.exame.possuiExame) {
            listaExames.innerHTML += `
                <div class="item-card">
                    <div>
                        <h4>${f.nome}</h4>
                        <p style="color:var(--text-dim); font-size:13px;">Procedimento: ${f.exame.tipo}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span class="status-badge" style="color:var(--accent-cyan); border-color:var(--accent-cyan);">${f.exame.status}</span>
                        <button class="btn-delete" onclick="deletarExame(${f.id})">Apagar</button>
                    </div>
                </div>`;
        }

        // Render - Módulo Treinamentos
        if (f.treinamento.possuiTreinamento) {
            listaTreinamentos.innerHTML += `
                <div class="item-card">
                    <div>
                        <h4>${f.treinamento.obrigatorio}</h4>
                        <p style="color:var(--text-dim); font-size:13px;">Profissional: ${f.nome}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span class="status-badge" style="color:var(--accent-yellow); border-color:var(--accent-yellow);">${f.treinamento.validade}</span>
                        <button class="btn-delete" onclick="deletarTreinamento(${f.id})">Apagar</button>
                    </div>
                </div>`;
        }
    });

    // Render - Módulo Acidentes
    acidentes.forEach(a => {
        listaAcidentes.innerHTML += `
            <div class="item-card" style="border-left: 3px solid var(--accent-magenta);">
                <div>
                    <h4 style="color: var(--accent-magenta);">Ocorrência: ${a.data}</h4>
                    <p style="color: white; margin-top: 4px; font-size:14px;">Local: ${a.local} — ${a.descricao}</p>
                </div>
                <button class="btn-delete" onclick="deletarAcidente(${a.id})">Apagar</button>
            </div>`;
    });

    // Render - Módulo Inspeções
    inspecoes.forEach(i => {
        const corStatus = i.statusPredial.includes("Aprovado") ? "var(--accent-cyan)" : "var(--accent-magenta)";
        listaInspecoes.innerHTML += `
            <div class="item-card">
                <div>
                    <h4>Área: ${i.local}</h4>
                    <p style="color: var(--text-dim); font-size:13px;">Status: ${i.statusPredial}</p>
                </div>
                <button class="btn-delete" onclick="deletarInspecao(${i.id})">Apagar</button>
            </div>`;
    });
}

// ==========================================
// FUNÇÕES DE EXCLUSÃO MAPEADAS NOS BOTÕES
// ==========================================

window.deletarColab = function(id) {
    if(confirm("Remover este colaborador e todas as suas vinculações?")) {
        sistema.removerFuncionario(id);
        renderDados();
    }
}

window.deletarEpi = function(id) {
    if(confirm("Remover o registro de entrega de EPI deste funcionário?")) {
        sistema.removerEpiDeFuncionario(id);
        renderDados();
    }
}

window.deletarExame = function(id) {
    if(confirm("Excluir os dados de ASO deste funcionário?")) {
        sistema.removerExameColaborador(id);
        renderDados();
    }
}

window.deletarTreinamento = function(id) {
    if(confirm("Remover histórico de treinamento do colaborador?")) {
        sistema.removerTreinamentoColaborador(id);
        renderDados();
    }
}

window.deletarAcidente = function(id) {
    if(confirm("Excluir permanentemente este registro de acidente?")) {
        sistema.removerAcidente(id);
        renderDados();
    }
}

window.deletarInspecao = function(id) {
    if(confirm("Deseja apagar este laudo de inspeção?")) {
        sistema.removerInspecao(id);
        renderDados();
    }
}

// Massa de dados inicial modificada para vir com os exames/treinamentos preenchidos
const f1 = sistema.adicionarFuncionario("Linus Torvalds", "Infraestrutura", "Arquiteto Linux");
const f2 = sistema.adicionarFuncionario("Margaret Hamilton", "Aeroespacial", "Diretora Apollo");

sistema.vincularEPI(f1.id, "Protetor Auricular Plug");
sistema.atualizarExameColaborador(f1.id, "Periódico Semestral", "Apto para Operação");
sistema.atualizarTreinamentoColaborador(f2.id, "NR-10 Instalações Elétricas", "Certificado Válido");
sistema.registrarInspecao("Laboratório Central", "Aprovado em Auditoria");

renderDados();
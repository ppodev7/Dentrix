// ADICIONADO PARA [DIAGRAMA DE CLASSES]
// Estruturas de dados que representam o diagrama de classes UML

/**
 * Classe abstrata Pessoa
 * ADICIONADO PARA [CLASSE PESSOA - DIAGRAMA DE CLASSES]
 */
class Pessoa {
    constructor(titulo, nome, email, telefone, dataNascimento, genero, endereco) {
        this.titulo = titulo; // ADICIONADO PARA [ATRIBUTO TITULO]
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.genero = genero; // ADICIONADO PARA [ATRIBUTO GENERO]
        this.endereco = endereco;
    }
}

/**
 * Classe Paciente (herda de Pessoa)
 * ADICIONADO PARA [CLASSE PACIENTE - DIAGRAMA DE CLASSES]
 */
class Paciente extends Pessoa {
    constructor(titulo, nome, email, telefone, dataNascimento, genero, endereco, id, idade, alergias = [], observacoes = '') {
        super(titulo, nome, email, telefone, dataNascimento, genero, endereco);
        this.id = id;
        this.idade = idade;
        this.alergias = alergias; // ADICIONADO PARA [ATRIBUTO ALERGIAS - ARRAY]
        this.observacoes = observacoes; // ADICIONADO PARA [ATRIBUTO OBSERVACOES]
        this.consultas = []; // ADICIONADO PARA [RELACIONAMENTO 1..* COM CONSULTA]
        this.clinica = null; // ADICIONADO PARA [RELACIONAMENTO COM CLINICA]
    }

    // ADICIONADO PARA [CASO DE USO - SOLICITAR AGENDAMENTO]
    solicitarAgendamento(consulta) {
        this.consultas.push(consulta);
        consulta.paciente = this; // Relacionamento bidirecional
        return consulta;
    }

    // ADICIONADO PARA [CASO DE USO - GERENCIAR CONSULTAS]
    gerenciarConsultas() {
        return this.consultas;
    }

    // ADICIONADO PARA [CASO DE USO - REAGENDAR CONSULTA (EXTEND)]
    reagendarConsulta(consultaId, novaData, novaHora) {
        const consulta = this.consultas.find(c => c.id === consultaId);
        if (consulta) {
            consulta.data = novaData;
            consulta.hora = novaHora;
            consulta.status = 'reagendada';
            return consulta;
        }
        return null;
    }
}

/**
 * Classe Dentista (herda de Pessoa)
 * ADICIONADO PARA [CLASSE DENTISTA - DIAGRAMA DE CLASSES]
 */
class Dentista extends Pessoa {
    constructor(titulo, nome, email, telefone, dataNascimento, genero, endereco, cro, especialidades = [], localAtendimento = [], horariosAtendimento = '') {
        super(titulo, nome, email, telefone, dataNascimento, genero, endereco);
        this.cro = cro; // ADICIONADO PARA [ATRIBUTO CRO]
        this.especialidades = especialidades; // ADICIONADO PARA [ATRIBUTO ESPECIALIDADES - ARRAY]
        this.localAtendimento = localAtendimento; // ADICIONADO PARA [ATRIBUTO LOCAL ATENDIMENTO - ARRAY]
        this.horariosAtendimento = horariosAtendimento; // ADICIONADO PARA [ATRIBUTO HORARIOS ATENDIMENTO]
        this.consultas = []; // ADICIONADO PARA [RELACIONAMENTO 1..* COM CONSULTA]
        this.clinica = null; // ADICIONADO PARA [RELACIONAMENTO COM CLINICA]
    }

    // ADICIONADO PARA [CASO DE USO - DISPONIBILIZAR ORÇAMENTO]
    disponibilizarOrcamento(paciente, itens, validade, condicoesPagamento) {
        return {
            id: Date.now(),
            paciente: paciente,
            dentista: this,
            itens: itens,
            total: itens.reduce((sum, item) => sum + item.valor, 0),
            validade: validade,
            condicoesPagamento: condicoesPagamento,
            dataCriacao: new Date().toISOString()
        };
    }

    // ADICIONADO PARA [CASO DE USO - REALIZAR CONSULTA]
    realizarConsulta(consulta) {
        consulta.dentista = this; // Relacionamento bidirecional
        this.consultas.push(consulta);
        return consulta;
    }

    // ADICIONADO PARA [CASO DE USO - GERAR RELATÓRIO]
    gerarRelatorio(tipo, periodo, formato) {
        return {
            id: Date.now(),
            tipo: tipo,
            periodo: periodo,
            formato: formato,
            dentista: this,
            dataGeracao: new Date().toISOString()
        };
    }

    // ADICIONADO PARA [CASO DE USO - EMITIR RECEITA]
    emitirReceita(paciente, medicamentos, orientacoes) {
        return {
            id: Date.now(),
            paciente: paciente,
            dentista: this,
            medicamentos: medicamentos,
            orientacoes: orientacoes,
            dataEmissao: new Date().toISOString()
        };
    }

    // ADICIONADO PARA [CASO DE USO - SOLICITAR EXAME COMPLEMENTAR]
    solicitarExameComplementar(paciente, tipoExame, justificativa, urgencia) {
        return {
            id: Date.now(),
            paciente: paciente,
            dentista: this,
            tipoExame: tipoExame,
            justificativa: justificativa,
            urgencia: urgencia,
            dataSolicitacao: new Date().toISOString()
        };
    }
}

/**
 * Classe Clínica
 * ADICIONADO PARA [CLASSE CLINICA - DIAGRAMA DE CLASSES]
 */
class Clinica {
    constructor(nome, endereco, telefone) {
        this.id = Date.now();
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.dentistas = []; // ADICIONADO PARA [RELACIONAMENTO 1..* COM DENTISTA]
        this.pacientes = []; // ADICIONADO PARA [RELACIONAMENTO 1..* COM PACIENTE]
    }

    // ADICIONADO PARA [RELACIONAMENTO CLINICA-DENTISTA]
    adicionarDentista(dentista) {
        this.dentistas.push(dentista);
        dentista.clinica = this; // Relacionamento bidirecional
    }

    // ADICIONADO PARA [RELACIONAMENTO CLINICA-PACIENTE]
    adicionarPaciente(paciente) {
        this.pacientes.push(paciente);
        paciente.clinica = this; // Relacionamento bidirecional
    }

    // ADICIONADO PARA [CASO DE USO - PESQUISAR DISPONIBILIDADE DE DENTISTAS]
    pesquisarDisponibilidadeDentistas(data, especialidade) {
        return this.dentistas.filter(dentista => {
            // Verifica se o dentista tem a especialidade solicitada
            const temEspecialidade = !especialidade || dentista.especialidades.includes(especialidade);
            
            // Verifica disponibilidade (simplificado - em produção, verificar agenda)
            return temEspecialidade;
        });
    }
}

/**
 * Classe Consulta
 * ADICIONADO PARA [CLASSE CONSULTA - DIAGRAMA DE CLASSES]
 */
class Consulta {
    constructor(id, data, hora, status, tipo, observacoes = '') {
        this.id = id;
        this.data = data;
        this.hora = hora;
        this.status = status; // ADICIONADO PARA [ATRIBUTO STATUS]
        this.tipo = tipo; // ADICIONADO PARA [ATRIBUTO TIPO]
        this.observacoes = observacoes; // ADICIONADO PARA [ATRIBUTO OBSERVACOES]
        this.paciente = null; // ADICIONADO PARA [RELACIONAMENTO COM PACIENTE]
        this.dentista = null; // ADICIONADO PARA [RELACIONAMENTO COM DENTISTA]
        this.prontuario = null; // ADICIONADO PARA [RELACIONAMENTO 1..1 COM PRONTUARIO]
    }

    // ADICIONADO PARA [RELACIONAMENTO CONSULTA-PRONTUARIO]
    associarProntuario(prontuario) {
        this.prontuario = prontuario;
        prontuario.consulta = this; // Relacionamento bidirecional
    }
}

/**
 * Classe Prontuário
 * ADICIONADO PARA [CLASSE PRONTUARIO - DIAGRAMA DE CLASSES]
 */
class Prontuario {
    constructor(idProntuario, dataRegistro, diagnostico, tratamento, observacoes = '') {
        this.idProntuario = idProntuario;
        this.dataRegistro = dataRegistro;
        this.diagnostico = diagnostico; // ADICIONADO PARA [ATRIBUTO DIAGNOSTICO]
        this.tratamento = tratamento; // ADICIONADO PARA [ATRIBUTO TRATAMENTO]
        this.observacoes = observacoes; // ADICIONADO PARA [ATRIBUTO OBSERVACOES]
        this.consulta = null; // ADICIONADO PARA [RELACIONAMENTO COM CONSULTA]
    }
}

// ADICIONADO PARA [CONTROLE DE ACESSO POR ATOR]
/**
 * Enum de Roles/Atores
 */
const Roles = {
    PACIENTE: 'PACIENTE',
    DENTISTA: 'DENTISTA',
    RECEPCIONISTA: 'RECEPCIONISTA'
};

// Exportar classes para uso global
if (typeof window !== 'undefined') {
    window.Pessoa = Pessoa;
    window.Paciente = Paciente;
    window.Dentista = Dentista;
    window.Clinica = Clinica;
    window.Consulta = Consulta;
    window.Prontuario = Prontuario;
    window.Roles = Roles;
}


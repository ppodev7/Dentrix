// ADICIONADO PARA [CASOS DE USO E SERVIÇOS]
// Serviços que implementam os casos de uso por ator

/**
 * Serviço do Paciente
 * ADICIONADO PARA [CASOS DE USO - PACIENTE]
 */
class PacienteService {
    constructor() {
        this.role = Roles.PACIENTE;
    }

    // ADICIONADO PARA [CASO DE USO - SOLICITAR AGENDAMENTO]
    solicitarAgendamento(pacienteId, dentistaId, data, hora, tipo) {
        const paciente = this.obterPaciente(pacienteId);
        const dentista = this.obterDentista(dentistaId);
        
        if (!paciente || !dentista) {
            throw new Error('Paciente ou dentista não encontrado');
        }

        const consulta = new Consulta(
            Date.now(),
            data,
            hora,
            'agendada',
            tipo,
            ''
        );

        paciente.solicitarAgendamento(consulta);
        dentista.consultas.push(consulta);
        consulta.dentista = dentista;

        this.salvarConsulta(consulta);
        return consulta;
    }

    // ADICIONADO PARA [CASO DE USO - PESQUISAR DISPONIBILIDADE DE DENTISTAS]
    pesquisarDisponibilidadeDentistas(data, especialidade) {
        const clinicas = this.obterClinicas();
        const dentistasDisponiveis = [];

        clinicas.forEach(clinica => {
            const dentistas = clinica.pesquisarDisponibilidadeDentistas(data, especialidade);
            dentistasDisponiveis.push(...dentistas);
        });

        return dentistasDisponiveis;
    }

    // ADICIONADO PARA [CASO DE USO - REALIZAR PAGAMENTO]
    realizarPagamento(consultaId, metodoPagamento, valor) {
        const consulta = this.obterConsulta(consultaId);
        if (!consulta) {
            throw new Error('Consulta não encontrada');
        }

        const pagamento = {
            id: Date.now(),
            consultaId: consultaId,
            metodoPagamento: metodoPagamento, // 'pix' ou 'boleto'
            valor: valor,
            status: 'pendente',
            dataPagamento: new Date().toISOString()
        };

        this.salvarPagamento(pagamento);
        return pagamento;
    }

    // ADICIONADO PARA [CASO DE USO - GERENCIAR CONSULTAS]
    gerenciarConsultas(pacienteId) {
        const paciente = this.obterPaciente(pacienteId);
        if (!paciente) {
            return [];
        }
        return paciente.gerenciarConsultas();
    }

    // ADICIONADO PARA [CASO DE USO - REAGENDAR CONSULTA (EXTEND)]
    reagendarConsulta(pacienteId, consultaId, novaData, novaHora) {
        const paciente = this.obterPaciente(pacienteId);
        if (!paciente) {
            throw new Error('Paciente não encontrado');
        }

        const consulta = paciente.reagendarConsulta(consultaId, novaData, novaHora);
        if (consulta) {
            this.salvarConsulta(consulta);
        }
        return consulta;
    }

    // Métodos auxiliares
    obterPaciente(id) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        const pacienteData = pacientes.find(p => p.id === id);
        if (!pacienteData) return null;
        // Recriar objeto Paciente a partir dos dados
        const paciente = new Paciente(
            pacienteData.titulo, pacienteData.nome, pacienteData.email,
            pacienteData.telefone, pacienteData.dataNascimento, pacienteData.genero,
            pacienteData.endereco, pacienteData.id, pacienteData.idade,
            pacienteData.alergias || [], pacienteData.observacoes || ''
        );
        return paciente;
    }

    obterDentista(id) {
        const dentistas = JSON.parse(localStorage.getItem('dentistas') || '[]');
        const dentistaData = dentistas.find(d => d.id === id);
        if (!dentistaData) return null;
        // Recriar objeto Dentista a partir dos dados
        const dentista = new Dentista(
            dentistaData.titulo, dentistaData.nome, dentistaData.email,
            dentistaData.telefone, dentistaData.dataNascimento, dentistaData.genero,
            dentistaData.endereco, dentistaData.cro, dentistaData.especialidades || [],
            dentistaData.localAtendimento || [], dentistaData.horariosAtendimento || ''
        );
        dentista.id = dentistaData.id;
        return dentista;
    }

    obterClinicas() {
        const clinicasData = JSON.parse(localStorage.getItem('clinicas') || '[]');
        return clinicasData.map(cd => {
            const clinica = new Clinica(cd.nome, cd.endereco, cd.telefone);
            clinica.id = cd.id;
            return clinica;
        });
    }

    obterConsulta(id) {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        const consultaData = consultas.find(c => c.id === id);
        if (!consultaData) return null;
        // Recriar objeto Consulta a partir dos dados
        const consulta = new Consulta(
            consultaData.id, consultaData.data, consultaData.hora,
            consultaData.status, consultaData.tipo, consultaData.observacoes || ''
        );
        return consulta;
    }

    salvarConsulta(consulta) {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        const index = consultas.findIndex(c => c.id === consulta.id);
        if (index >= 0) {
            consultas[index] = consulta;
        } else {
            consultas.push(consulta);
        }
        localStorage.setItem('consultas', JSON.stringify(consultas));
    }

    salvarPagamento(pagamento) {
        const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
        pagamentos.push(pagamento);
        localStorage.setItem('pagamentos', JSON.stringify(pagamentos));
    }
}

/**
 * Serviço do Dentista
 * ADICIONADO PARA [CASOS DE USO - DENTISTA]
 */
class DentistaService {
    constructor() {
        this.role = Roles.DENTISTA;
    }

    // ADICIONADO PARA [CASO DE USO - DISPONIBILIZAR ORÇAMENTO]
    disponibilizarOrcamento(dentistaId, pacienteId, itens, validade, condicoesPagamento) {
        const dentista = this.obterDentista(dentistaId);
        const paciente = this.obterPaciente(pacienteId);

        if (!dentista || !paciente) {
            throw new Error('Dentista ou paciente não encontrado');
        }

        const orcamento = dentista.disponibilizarOrcamento(paciente, itens, validade, condicoesPagamento);
        this.salvarOrcamento(orcamento);
        return orcamento;
    }

    // ADICIONADO PARA [CASO DE USO - REALIZAR CONSULTA]
    realizarConsulta(dentistaId, consultaId, diagnostico, procedimentos, observacoes) {
        const consulta = this.obterConsulta(consultaId);
        const dentista = this.obterDentista(dentistaId);

        if (!consulta || !dentista) {
            throw new Error('Consulta ou dentista não encontrado');
        }

        consulta.status = 'realizada';
        consulta.observacoes = observacoes;

        // Cria prontuário
        const prontuario = new Prontuario(
            Date.now(),
            new Date().toISOString(),
            diagnostico,
            procedimentos,
            observacoes
        );

        consulta.associarProntuario(prontuario);
        this.salvarProntuario(prontuario);
        this.salvarConsulta(consulta);

        return { consulta, prontuario };
    }

    // ADICIONADO PARA [CASO DE USO - GERAR RELATÓRIO]
    gerarRelatorio(dentistaId, tipo, periodo, formato) {
        const dentista = this.obterDentista(dentistaId);
        if (!dentista) {
            throw new Error('Dentista não encontrado');
        }

        const relatorio = dentista.gerarRelatorio(tipo, periodo, formato);
        this.salvarRelatorio(relatorio);
        return relatorio;
    }

    // ADICIONADO PARA [CASO DE USO - EMITIR RECEITA]
    emitirReceita(dentistaId, pacienteId, medicamentos, orientacoes) {
        const dentista = this.obterDentista(dentistaId);
        const paciente = this.obterPaciente(pacienteId);

        if (!dentista || !paciente) {
            throw new Error('Dentista ou paciente não encontrado');
        }

        const receita = dentista.emitirReceita(paciente, medicamentos, orientacoes);
        this.salvarReceita(receita);
        return receita;
    }

    // ADICIONADO PARA [CASO DE USO - SOLICITAR EXAME COMPLEMENTAR]
    solicitarExameComplementar(dentistaId, pacienteId, tipoExame, justificativa, urgencia) {
        const dentista = this.obterDentista(dentistaId);
        const paciente = this.obterPaciente(pacienteId);

        if (!dentista || !paciente) {
            throw new Error('Dentista ou paciente não encontrado');
        }

        const exame = dentista.solicitarExameComplementar(paciente, tipoExame, justificativa, urgencia);
        this.salvarExame(exame);
        return exame;
    }

    // Métodos auxiliares
    obterDentista(id) {
        const dentistas = JSON.parse(localStorage.getItem('dentistas') || '[]');
        const dentistaData = dentistas.find(d => d.id === id);
        if (!dentistaData) return null;
        const dentista = new Dentista(
            dentistaData.titulo, dentistaData.nome, dentistaData.email,
            dentistaData.telefone, dentistaData.dataNascimento, dentistaData.genero,
            dentistaData.endereco, dentistaData.cro, dentistaData.especialidades || [],
            dentistaData.localAtendimento || [], dentistaData.horariosAtendimento || ''
        );
        dentista.id = dentistaData.id;
        return dentista;
    }

    obterPaciente(id) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        const pacienteData = pacientes.find(p => p.id === id);
        if (!pacienteData) return null;
        const paciente = new Paciente(
            pacienteData.titulo, pacienteData.nome, pacienteData.email,
            pacienteData.telefone, pacienteData.dataNascimento, pacienteData.genero,
            pacienteData.endereco, pacienteData.id, pacienteData.idade,
            pacienteData.alergias || [], pacienteData.observacoes || ''
        );
        return paciente;
    }

    obterConsulta(id) {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        const consultaData = consultas.find(c => c.id === id);
        if (!consultaData) return null;
        const consulta = new Consulta(
            consultaData.id, consultaData.data, consultaData.hora,
            consultaData.status, consultaData.tipo, consultaData.observacoes || ''
        );
        return consulta;
    }

    salvarOrcamento(orcamento) {
        const orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]');
        orcamentos.push(orcamento);
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    }

    salvarProntuario(prontuario) {
        const prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
        prontuarios.push(prontuario);
        localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
    }

    salvarConsulta(consulta) {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        const index = consultas.findIndex(c => c.id === consulta.id);
        if (index >= 0) {
            consultas[index] = consulta;
        } else {
            consultas.push(consulta);
        }
        localStorage.setItem('consultas', JSON.stringify(consultas));
    }

    salvarRelatorio(relatorio) {
        const relatorios = JSON.parse(localStorage.getItem('relatorios') || '[]');
        relatorios.push(relatorio);
        localStorage.setItem('relatorios', JSON.stringify(relatorios));
    }

    salvarReceita(receita) {
        const receitas = JSON.parse(localStorage.getItem('receitas') || '[]');
        receitas.push(receita);
        localStorage.setItem('receitas', JSON.stringify(receitas));
    }

    salvarExame(exame) {
        const exames = JSON.parse(localStorage.getItem('exames') || '[]');
        exames.push(exame);
        localStorage.setItem('exames', JSON.stringify(exames));
    }
}

/**
 * Serviço do Recepcionista
 * ADICIONADO PARA [CASOS DE USO - RECEPCIONISTA]
 */
class RecepcionistaService {
    constructor() {
        this.role = Roles.RECEPCIONISTA;
    }

    // ADICIONADO PARA [CASO DE USO - PROCESSAR PAGAMENTO (PIX/BOLETO)]
    processarPagamento(pagamentoId, metodoPagamento) {
        const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
        const pagamento = pagamentos.find(p => p.id === pagamentoId);

        if (!pagamento) {
            throw new Error('Pagamento não encontrado');
        }

        pagamento.metodoPagamento = metodoPagamento; // 'pix' ou 'boleto'
        pagamento.status = 'processado';
        pagamento.dataProcessamento = new Date().toISOString();

        // Se PIX, processa imediatamente
        if (metodoPagamento === 'pix') {
            pagamento.status = 'aprovado';
        } else if (metodoPagamento === 'boleto') {
            pagamento.status = 'aguardando';
            pagamento.dataVencimento = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 dias
        }

        const index = pagamentos.findIndex(p => p.id === pagamentoId);
        pagamentos[index] = pagamento;
        localStorage.setItem('pagamentos', JSON.stringify(pagamentos));

        return pagamento;
    }

    // ADICIONADO PARA [CASO DE USO - EMITIR RELATÓRIO FINANCEIRO]
    emitirRelatorioFinanceiro(dataInicio, dataFim, formato) {
        const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');

        const pagamentosPeriodo = pagamentos.filter(p => {
            const dataPagamento = new Date(p.dataPagamento);
            return dataPagamento >= new Date(dataInicio) && dataPagamento <= new Date(dataFim);
        });

        const relatorio = {
            id: Date.now(),
            tipo: 'financeiro',
            dataInicio: dataInicio,
            dataFim: dataFim,
            formato: formato,
            totalRecebido: pagamentosPeriodo
                .filter(p => p.status === 'aprovado')
                .reduce((sum, p) => sum + p.valor, 0),
            totalPendente: pagamentosPeriodo
                .filter(p => p.status === 'pendente' || p.status === 'aguardando')
                .reduce((sum, p) => sum + p.valor, 0),
            quantidadeConsultas: consultas.filter(c => {
                const dataConsulta = new Date(c.data);
                return dataConsulta >= new Date(dataInicio) && dataConsulta <= new Date(dataFim);
            }).length,
            quantidadePagamentos: pagamentosPeriodo.length,
            pagamentos: pagamentosPeriodo,
            dataGeracao: new Date().toISOString()
        };

        this.salvarRelatorioFinanceiro(relatorio);
        return relatorio;
    }

    // ADICIONADO PARA [CASO DE USO - GERENCIAR CONSULTAS]
    gerenciarConsultas() {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        return consultas;
    }

    criarConsulta(pacienteId, dentistaId, data, hora, tipo) {
        const consulta = new Consulta(
            Date.now(),
            data,
            hora,
            'agendada',
            tipo,
            ''
        );

        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        consultas.push(consulta);
        localStorage.setItem('consultas', JSON.stringify(consultas));

        return consulta;
    }

    // Métodos auxiliares
    salvarRelatorioFinanceiro(relatorio) {
        const relatorios = JSON.parse(localStorage.getItem('relatoriosFinanceiros') || '[]');
        relatorios.push(relatorio);
        localStorage.setItem('relatoriosFinanceiros', JSON.stringify(relatorios));
    }
}

// ADICIONADO PARA [CONTROLE DE ACESSO POR ATOR]
/**
 * Factory de Serviços baseado no role do usuário
 */
class ServiceFactory {
    static getService(role) {
        switch (role) {
            case Roles.PACIENTE:
                return new PacienteService();
            case Roles.DENTISTA:
                return new DentistaService();
            case Roles.RECEPCIONISTA:
                return new RecepcionistaService();
            default:
                throw new Error('Role inválido');
        }
    }
}

// Exportar serviços para uso global
if (typeof window !== 'undefined') {
    window.PacienteService = PacienteService;
    window.DentistaService = DentistaService;
    window.RecepcionistaService = RecepcionistaService;
    window.ServiceFactory = ServiceFactory;
}


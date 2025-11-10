// ADICIONADO PARA [DIAGRAMA DE CLASSES - INICIALIZAÇÃO DE DADOS]
// Script para inicializar dados de exemplo conforme o diagrama de classes

/**
 * Inicializa dados de exemplo para demonstrar o diagrama de classes
 * ADICIONADO PARA [RELAÇÕES E ESTRUTURAS DO DIAGRAMA]
 */
function inicializarDados() {
    // ADICIONADO PARA [CLASSE CLINICA]
    const clinica1 = new Clinica(
        'Dentrix - Unidade Centro',
        'Rua da Harmonia, 450 - Centro, São Paulo - SP, 01000-000',
        '(11) 3000-0000'
    );

    const clinica2 = new Clinica(
        'Dentrix - Unidade Tatuapé',
        'Rua Gonçalo de Carvalho, 850 - Tatuapé, São Paulo - SP, 03090-000',
        '(11) 3000-0001'
    );

    // ADICIONADO PARA [CLASSE DENTISTA COM ATRIBUTOS DO DIAGRAMA]
    const dentista1 = new Dentista(
        'Dra.', // titulo
        'Camila Ribeiro', // nome
        'camila.ribeiro@dentrix.com', // email
        '(11) 98765-4321', // telefone
        '1980-05-15', // dataNascimento
        'Feminino', // genero
        'Rua das Flores, 100, São Paulo - SP', // endereco
        'CRO-SP 12345', // cro
        ['Ortodontia'], // especialidades
        ['Centro', 'Tatuapé'], // localAtendimento
        '08:00 - 18:00' // horariosAtendimento
    );
    dentista1.id = 1;

    const dentista2 = new Dentista(
        'Dr.',
        'Lucas Andrade',
        'lucas.andrade@dentrix.com',
        '(11) 98765-4322',
        '1975-03-20',
        'Masculino',
        'Av. Paulista, 500, São Paulo - SP',
        'CRO-SP 12346',
        ['Implantodontia'],
        ['Centro'],
        '09:00 - 17:00'
    );
    dentista2.id = 2;

    const dentista3 = new Dentista(
        'Dra.',
        'Renata Mello',
        'renata.mello@dentrix.com',
        '(11) 98765-4323',
        '1985-07-10',
        'Feminino',
        'Rua Augusta, 200, São Paulo - SP',
        'CRO-SP 12347',
        ['Estética'],
        ['Tatuapé'],
        '10:00 - 19:00'
    );
    dentista3.id = 3;

    // ADICIONADO PARA [RELACIONAMENTO CLINICA-DENTISTA]
    clinica1.adicionarDentista(dentista1);
    clinica1.adicionarDentista(dentista2);
    clinica2.adicionarDentista(dentista3);

    // ADICIONADO PARA [CLASSE PACIENTE COM ATRIBUTOS DO DIAGRAMA]
    const paciente1 = new Paciente(
        'Sr.', // titulo
        'João da Silva', // nome
        'joao.silva@email.com', // email
        '(11) 91234-5678', // telefone
        '1985-05-15', // dataNascimento
        'Masculino', // genero
        'Rua das Flores, 123, São Paulo - SP', // endereco
        1, // id
        39, // idade
        [], // alergias
        'Paciente desde 2020' // observacoes
    );

    const paciente2 = new Paciente(
        'Sra.',
        'Maria Oliveira',
        'maria.oliveira@email.com',
        '(11) 99888-1122',
        '1990-08-22',
        'Feminino',
        'Rua dos Jardins, 456, São Paulo - SP',
        2,
        34,
        ['Penicilina'], // alergias
        'Paciente desde 2019'
    );

    const paciente3 = new Paciente(
        'Sr.',
        'Pedro Lima',
        'pedro.lima@email.com',
        '(11) 93456-9988',
        '1988-12-05',
        'Masculino',
        'Av. Faria Lima, 789, São Paulo - SP',
        3,
        36,
        [], // alergias
        'Paciente desde 2021'
    );

    // ADICIONADO PARA [RELACIONAMENTO CLINICA-PACIENTE]
    clinica1.adicionarPaciente(paciente1);
    clinica1.adicionarPaciente(paciente2);
    clinica2.adicionarPaciente(paciente3);

    // ADICIONADO PARA [CLASSE CONSULTA COM ATRIBUTOS DO DIAGRAMA]
    const consulta1 = new Consulta(
        1, // id
        '2025-10-25', // data
        '14:00', // hora
        'confirmada', // status
        'Limpeza / Profilaxia', // tipo
        'Consulta de rotina' // observacoes
    );

    const consulta2 = new Consulta(
        2,
        '2025-10-30',
        '09:30',
        'pendente',
        'Avaliação de Implante',
        'Primeira avaliação'
    );

    // ADICIONADO PARA [RELACIONAMENTO PACIENTE-CONSULTA E DENTISTA-CONSULTA]
    paciente1.solicitarAgendamento(consulta1);
    dentista1.realizarConsulta(consulta1);

    paciente1.solicitarAgendamento(consulta2);
    dentista2.realizarConsulta(consulta2);

    // ADICIONADO PARA [CLASSE PRONTUARIO COM ATRIBUTOS DO DIAGRAMA]
    const prontuario1 = new Prontuario(
        1, // idProntuario
        '2025-10-25T14:00:00', // dataRegistro
        'Gengivite leve', // diagnostico
        'Profilaxia e orientação de higiene', // tratamento
        'Paciente respondeu bem ao tratamento' // observacoes
    );

    // ADICIONADO PARA [RELACIONAMENTO CONSULTA-PRONTUARIO]
    consulta1.associarProntuario(prontuario1);

    // Salvar dados no localStorage
    localStorage.setItem('clinicas', JSON.stringify([clinica1, clinica2]));
    localStorage.setItem('dentistas', JSON.stringify([dentista1, dentista2, dentista3]));
    localStorage.setItem('pacientes', JSON.stringify([paciente1, paciente2, paciente3]));
    localStorage.setItem('consultas', JSON.stringify([consulta1, consulta2]));
    localStorage.setItem('prontuarios', JSON.stringify([prontuario1]));

    console.log('✅ Dados inicializados conforme diagrama de classes UML');
}

// Inicializar dados quando o script for carregado
if (typeof window !== 'undefined') {
    // Aguardar modelos e serviços serem carregados
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(inicializarDados, 500);
        });
    } else {
        setTimeout(inicializarDados, 500);
    }
}


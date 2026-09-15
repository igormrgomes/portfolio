/* =========================================================
   PORTFÓLIO — IGOR
   script.js

   Interações escolhidas (requisito da atividade):
     1) TEXT TYPING  — efeito de digitação no hero
     2) ANIMATE ON SCROLL — elementos aparecem ao rolar
     (extras: contadores, barras, filtro, modal, máscaras)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefereMenosMovimento =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =================================================
     1. TEMA CLARO / ESCURO (salvo no navegador)
     ================================================= */
  const btnTema = document.getElementById('themeToggle');

  btnTema.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-tema');
    const novo  = atual === 'escuro' ? 'claro' : 'escuro';

    document.documentElement.setAttribute('data-tema', novo);

    // Salva a escolha — continua valendo ao recarregar ou mudar de página
    try {
      localStorage.setItem('tema', novo);
    } catch (e) {
      console.warn('Não foi possível salvar o tema:', e);
    }
  });


  /* =================================================
     2. MENU MOBILE (hambúrguer)
     ================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', aberto);
    navToggle.setAttribute('aria-expanded', String(aberto));
    navToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  function fecharMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }


  /* =================================================
     3. INTERAÇÃO JS #1 — EFEITO DE DIGITAÇÃO
     ================================================= */
  const typedEl = document.getElementById('typed');
  const frases = [
    'Desenvolvedor Front-End em formação',
    'Estudante de Informática',
    'Apaixonado por código limpo',
    'Sempre aprendendo algo novo'
  ];

  let fraseAtual = 0, letraAtual = 0, apagando = false;

  if (prefereMenosMovimento) {
    typedEl.textContent = frases[0];
  } else {
    digitar();
  }

  function digitar() {
    const frase = frases[fraseAtual];

    if (!apagando) {
      typedEl.textContent = frase.substring(0, letraAtual + 1);
      letraAtual++;
      if (letraAtual === frase.length) {
        apagando = true;
        setTimeout(digitar, 2000);
        return;
      }
      setTimeout(digitar, 65);
    } else {
      typedEl.textContent = frase.substring(0, letraAtual - 1);
      letraAtual--;
      if (letraAtual === 0) {
        apagando = false;
        fraseAtual = (fraseAtual + 1) % frases.length;
        setTimeout(digitar, 350);
        return;
      }
      setTimeout(digitar, 35);
    }
  }


  /* =================================================
     4. INTERAÇÃO JS #2 — ANIMATE ON SCROLL
     ================================================= */
  const elementosReveal = document.querySelectorAll('.reveal');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, i) => {
      if (entrada.isIntersecting) {
        setTimeout(() => entrada.target.classList.add('visible'), i * 80);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elementosReveal.forEach(el => observador.observe(el));


  /* =================================================
     5. BARRAS DE HABILIDADE
     ================================================= */
  const barras = document.querySelectorAll('.bar-fill');

  const observadorBarras = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.style.width = entrada.target.dataset.level + '%';
        observadorBarras.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });

  barras.forEach(b => observadorBarras.observe(b));


  /* =================================================
     6. CONTADOR ANIMADO
     ================================================= */
  const numeros = document.querySelectorAll('.stat-num');

  const observadorNumeros = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarNumero(entrada.target);
        observadorNumeros.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.5 });

  numeros.forEach(n => observadorNumeros.observe(n));

  function animarNumero(el) {
    const alvo    = parseInt(el.dataset.count, 10);
    const sufixo  = el.dataset.suffix || '';
    const duracao = 1400;
    const inicio  = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - progresso, 3);
      el.textContent = Math.round(alvo * suave) + sufixo;
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }


  /* =================================================
     7. FILTRO DE PROJETOS
     ================================================= */
  const botoesFiltro = document.querySelectorAll('.filter-btn');
  const cardsProjeto = document.querySelectorAll('.project-card');

  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      botoesFiltro.forEach(b => b.classList.remove('is-active'));
      botao.classList.add('is-active');

      const filtro = botao.dataset.filter;
      cardsProjeto.forEach(card => {
        const cats = card.dataset.cat.split(' ');
        card.classList.toggle('hidden', filtro !== 'todos' && !cats.includes(filtro));
      });
    });
  });


  /* =================================================
     8. MODAL DE PROJETOS
     ================================================= */
  const dadosProjetos = {
    landing: {
      icone: '🌐',
      titulo: 'Landing Page Responsiva',
      ano: '2025',
      status: 'Concluído',
      statusClasse: 'done',
      desc: 'Site institucional completo desenvolvido do zero, com foco em responsividade e experiência do usuário. Funciona perfeitamente em celular, tablet e desktop.',
      features: [
        'Layout construído com CSS Grid e Flexbox',
        'Menu hambúrguer animado em JavaScript puro',
        'Animações de entrada conforme o usuário rola a página',
        'Formulário de contato com validação em tempo real'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsivo'],
      aprendi: 'Aprendi na prática como planejar um layout mobile-first e a importância das media queries. Também entendi melhor como organizar o CSS usando variáveis para manter tudo consistente.'
    },
    cadastro: {
      icone: '📝',
      titulo: 'Sistema de Cadastro',
      ano: '2025',
      status: 'Concluído',
      statusClasse: 'done',
      desc: 'Aplicação de cadastro de usuários conectada a um banco de dados, permitindo inserir, listar, editar e excluir registros (CRUD completo).',
      features: [
        'Modelagem das tabelas e relacionamentos no banco',
        'Consultas SQL para todas as operações do CRUD',
        'Validação dos campos antes de salvar',
        'Listagem dinâmica dos registros cadastrados'
      ],
      tags: ['JavaScript', 'SQL', 'Banco de Dados', 'CRUD'],
      aprendi: 'Foi meu primeiro contato real com persistência de dados. Entendi como o front-end conversa com o banco e por que validar os dados dos dois lados é tão importante.'
    },
    jogo: {
      icone: '🎮',
      titulo: 'Mini Jogo em JavaScript',
      ano: '2026',
      status: 'Em progresso',
      statusClasse: 'progress',
      desc: 'Jogo interativo que roda direto no navegador, sem bibliotecas externas. Um projeto pessoal para praticar lógica de programação de um jeito divertido.',
      features: [
        'Controle do personagem pelo teclado',
        'Sistema de pontuação e níveis de dificuldade',
        'Detecção de colisão entre elementos',
        'Manipulação intensa do DOM e de eventos'
      ],
      tags: ['JavaScript', 'DOM', 'Lógica', 'Animação'],
      aprendi: 'Esse projeto me forçou a pensar em lógica de verdade: loops de jogo, estados e condições. É o que mais me desafia até agora, e por isso o que mais me ensina.'
    }
  };

  const modalProjeto = document.getElementById('modalProjeto');
  const modalAlerta  = document.getElementById('modalAlerta');
  let ultimoFoco = null;

  // Abre o modal ao clicar em "Ver detalhes"
  document.querySelectorAll('[data-projeto]').forEach(botao => {
    botao.addEventListener('click', () => {
      const dados = dadosProjetos[botao.dataset.projeto];
      if (!dados) return;

      document.getElementById('modalIcone').textContent  = dados.icone;
      document.getElementById('modalTitulo').textContent = dados.titulo;
      document.getElementById('modalAno').textContent    = dados.ano;
      document.getElementById('modalDesc').textContent   = dados.desc;
      document.getElementById('modalAprendi').textContent = dados.aprendi;

      const badge = document.getElementById('modalStatus');
      badge.textContent = dados.status;
      badge.className = 'status-badge ' + dados.statusClasse;

      // Monta a lista de funcionalidades
      const listaFeatures = document.getElementById('modalFeatures');
      listaFeatures.innerHTML = '';
      dados.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        listaFeatures.appendChild(li);
      });

      // Monta as tags
      const listaTags = document.getElementById('modalTags');
      listaTags.innerHTML = '';
      dados.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'mini-tag';
        span.textContent = t;
        listaTags.appendChild(span);
      });

      abrirModal(modalProjeto);
    });
  });

  // Funções genéricas de abrir/fechar
  function abrirModal(modal) {
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-aberto');
    requestAnimationFrame(() => modal.classList.add('show'));

    const btnFechar = modal.querySelector('.modal-close');
    if (btnFechar) btnFechar.focus();
  }

  function fecharModal(modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-aberto');
    setTimeout(() => { modal.hidden = true; }, 280);
    if (ultimoFoco) ultimoFoco.focus();
  }

  // Fechar: botão X, botão "Fechar", clique fora e tecla ESC
  document.getElementById('modalClose').addEventListener('click', () => fecharModal(modalProjeto));
  document.getElementById('modalFechar2').addEventListener('click', () => fecharModal(modalProjeto));
  document.getElementById('alertaClose').addEventListener('click', () => fecharModal(modalAlerta));
  document.getElementById('alertaOk').addEventListener('click', () => fecharModal(modalAlerta));

  [modalProjeto, modalAlerta].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (!modalProjeto.hidden) fecharModal(modalProjeto);
    else if (!modalAlerta.hidden) fecharModal(modalAlerta);
    else if (navLinks.classList.contains('open')) {
      fecharMenu();
      navToggle.focus();
    }
  });


  /* =================================================
     9. MÁSCARAS DO FORMULÁRIO
     ================================================= */
  const campoNome     = document.getElementById('nome');
  const campoTelefone = document.getElementById('telefone');
  const campoEmail    = document.getElementById('email');
  const campoMensagem = document.getElementById('mensagem');
  const contadorChars = document.getElementById('charCount');

  /* MÁSCARA 1: NOME — só letras, espaços e acentos */
  campoNome.addEventListener('input', () => {
    campoNome.value = campoNome.value.replace(/[^A-Za-zÀ-ÿ\s']/g, '');
  });

  /* MÁSCARA 2: TELEFONE — (00) 00000-0000 */
  campoTelefone.addEventListener('input', () => {
    let v = campoTelefone.value.replace(/\D/g, '');  // só números
    v = v.substring(0, 11);                          // máximo 11 dígitos

    if (v.length > 6) {
      // Celular com 9 dígitos: (31) 99999-9999
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else {
        // Fixo com 8 dígitos: (31) 3333-3333
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      }
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
    } else if (v.length > 0) {
      v = v.replace(/^(\d*)/, '($1');
    }

    campoTelefone.value = v;
  });

  /* MÁSCARA 3: E-MAIL — sem espaços e sempre minúsculo */
  campoEmail.addEventListener('input', () => {
    campoEmail.value = campoEmail.value.replace(/\s/g, '').toLowerCase();
  });

  /* MÁSCARA 4: MENSAGEM — contador de caracteres */
  campoMensagem.addEventListener('input', () => {
    const total = campoMensagem.value.length;
    contadorChars.textContent = total + ' / 500';
    contadorChars.style.color = total > 450 ? 'var(--amber)' : '';
  });


  /* =================================================
     10. VALIDAÇÃO E ENVIO DO FORMULÁRIO
     ================================================= */
  const formulario = document.getElementById('contactForm');

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    let valido = true;

    // Limpa os erros anteriores
    ['nome', 'telefone', 'email', 'mensagem'].forEach(id => limparErro(id));

    // Nome: pelo menos 2 caracteres
    if (campoNome.value.trim().length < 2) {
      mostrarErro('nome', 'Digite seu nome completo.');
      valido = false;
    }

    // Telefone: precisa ter 10 ou 11 dígitos
    const digitos = campoTelefone.value.replace(/\D/g, '');
    if (digitos.length < 10) {
      mostrarErro('telefone', 'Digite um telefone válido com DDD.');
      valido = false;
    }

    // E-mail: formato válido
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!padraoEmail.test(campoEmail.value.trim())) {
      mostrarErro('email', 'Digite um e-mail válido.');
      valido = false;
    }

    // Mensagem: pelo menos 10 caracteres
    if (campoMensagem.value.trim().length < 10) {
      mostrarErro('mensagem', 'A mensagem precisa ter pelo menos 10 caracteres.');
      valido = false;
    }

    if (!valido) {
      // MODAL FAZENDO PAPEL DE ALERTA
      mostrarAlerta('⚠️', 'Ops, faltou alguma coisa', 'Verifique os campos destacados em vermelho e tente novamente.');
      return;
    }

    /* ------------------------------------------------------
       Este site é apenas front-end, então não há servidor
       para receber a mensagem.

       Para receber de verdade, use o Formspree (gratuito):
       1. Crie uma conta em formspree.io e copie sua URL
       2. Descomente o bloco fetch() abaixo e cole a URL
       ------------------------------------------------------ */

    /*
    fetch('https://formspree.io/f/SEUCODIGO', {
      method: 'POST',
      body: new FormData(formulario),
      headers: { 'Accept': 'application/json' }
    })
    .then(() => {
      mostrarAlerta('✅', 'Mensagem enviada!', 'Obrigado pelo contato. Responderei em breve.');
      formulario.reset();
      contadorChars.textContent = '0 / 500';
    })
    .catch(() => {
      mostrarAlerta('❌', 'Erro no envio', 'Algo deu errado. Tente novamente ou me chame pelo e-mail.');
    });
    */

    // Enquanto o Formspree não está configurado:
    mostrarAlerta('✅', 'Mensagem validada!', 'Todos os campos estão corretos. Configure o Formspree no script.js para receber as mensagens de verdade.');
    formulario.reset();
    contadorChars.textContent = '0 / 500';
  });

  function mostrarErro(id, texto) {
    document.getElementById(id).classList.add('invalid');
    document.getElementById('err-' + id).textContent = texto;
  }

  function limparErro(id) {
    document.getElementById(id).classList.remove('invalid');
    document.getElementById('err-' + id).textContent = '';
  }

  function mostrarAlerta(icone, titulo, texto) {
    document.getElementById('alertaIcone').textContent = icone;
    document.getElementById('alertaTitulo').textContent = titulo;
    document.getElementById('alertaTexto').textContent = texto;
    abrirModal(modalAlerta);
  }

  // Limpa o erro assim que o usuário corrige
  ['nome', 'telefone', 'email', 'mensagem'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => limparErro(id));
  });


  /* =================================================
     11. NAVEGAÇÃO ATIVA, PROGRESSO E VOLTAR AO TOPO
     ================================================= */
  const secoes   = document.querySelectorAll('section[id]');
  const linksNav = document.querySelectorAll('.nav-links a');

  const observadorSecao = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const id = entrada.target.getAttribute('id');
        linksNav.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

  secoes.forEach(s => observadorSecao.observe(s));

  const barraProgresso = document.getElementById('scrollProgress');
  const header  = document.getElementById('header');
  const btnTopo = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const rolagem = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

    barraProgresso.style.width = (alturaTotal > 0 ? (rolagem / alturaTotal) * 100 : 0) + '%';
    header.classList.toggle('scrolled', rolagem > 20);
    btnTopo.classList.toggle('visible', rolagem > 500);
  }, { passive: true });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefereMenosMovimento ? 'auto' : 'smooth' });
  });


  /* =================================================
     12. ANO AUTOMÁTICO NO RODAPÉ
     ================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

});


/* =========================================================
   PORTFÓLIO — IGOR
   script.js

   Interações escolhidas (requisito da atividade):
     1) TEXT TYPING  — efeito de digitação no hero
     2) ANIMATE ON SCROLL — elementos aparecem ao rolar
     (extras: tilt 3D, cursor personalizado, botões magnéticos, ripple,
      copiar contato, confete, indicador de menu, contadores, barras,
      filtro animado, modal, máscaras)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefereMenosMovimento =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =================================================
     1. TEMA CLARO / ESCURO (salvo no navegador)
     ================================================= */
  const btnTema = document.getElementById('themeToggle');

  btnTema.addEventListener('click', () => {
    btnTema.classList.remove('girando');
    void btnTema.offsetWidth;
    btnTema.classList.add('girando');

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
    'Desenvolvedor Web em formação',
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
        const alvo = entrada.target;
        setTimeout(() => {
          alvo.classList.add('visible');
          // Depois que a entrada termina, libera as transições de hover do próprio elemento
          setTimeout(() => alvo.classList.remove('reveal', 'visible'), 900);
        }, i * 80);
        observador.unobserve(alvo);
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
        const mostrar = filtro === 'todos' || cats.includes(filtro);
        const estavaVisivel = !card.classList.contains('hidden');

        if (mostrar && !estavaVisivel) {
          card.classList.remove('hidden');
          card.classList.remove('entrando');
          void card.offsetWidth; // reinicia a animação
          card.classList.add('entrando');
        } else if (!mostrar && estavaVisivel) {
          card.classList.add('saindo');
          setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('saindo');
          }, 280);
        }
      });
    });
  });


  /* =================================================
     7B. INTERAÇÃO EXTRA — TILT 3D COM O MOUSE (foto)
     ================================================= */
  const fotoWrap = document.querySelector('.about-visual');
  const foto     = document.querySelector('.photo-frame');

  if (fotoWrap && foto && !prefereMenosMovimento && window.matchMedia('(hover: hover)').matches) {
    fotoWrap.addEventListener('mousemove', (e) => {
      const rect = fotoWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0 a 1
      const y = (e.clientY - rect.top) / rect.height;   // 0 a 1

      const rotY = (x - 0.5) * 16;  // graus para os lados
      const rotX = (0.5 - y) * 16;  // graus para cima/baixo

      foto.style.setProperty('--ry', rotY.toFixed(2) + 'deg');
      foto.style.setProperty('--rx', rotX.toFixed(2) + 'deg');
    });

    fotoWrap.addEventListener('mouseleave', () => {
      foto.style.setProperty('--ry', '0deg');
      foto.style.setProperty('--rx', '0deg');
    });
  }


  /* =================================================
     8. MODAL DE PROJETOS
     ================================================= */
  /* Ícones SVG (usam o sprite que está no começo do index.html) */
  function icone(nome) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + nome + '"/></svg>';
  }

  const dadosProjetos = {
    moneyup: {
      icone: 'wallet',
      titulo: 'MoneyUp — Landing Page',
      ano: '2025',
      status: 'Concluído',
      statusClasse: 'done',
      desc: 'Landing page para o MoneyUp, um app fictício de educação financeira que transforma organizar dinheiro em algo parecido com um jogo: metas, progresso e conquistas em vez de planilha.',
      features: [
        'Seções de problema, solução e funcionalidades do produto',
        'Comparativo entre planilha, apps comuns e o MoneyUp',
        'Formulário de lista de espera para acesso antecipado',
        'Layout 100% responsivo, do celular ao desktop'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsivo'],
      aprendi: 'Foi meu primeiro projeto de landing page pensada para converter — precisei estruturar o conteúdo em uma ordem que faz sentido para quem nunca ouviu falar do produto: problema, solução, prova e chamada para ação.',
      demo: 'https://igormrgomes.github.io/MoneyUp/',
      repo: 'https://github.com/igormrgomes/MoneyUp'
    },
    foco: {
      icone: 'kanban',
      titulo: 'Foco — Quadro de Tarefas',
      ano: '2026',
      status: 'Concluído',
      statusClasse: 'done',
      desc: 'Quadro de tarefas estilo Kanban para organizar o dia em três colunas. Cada tarefa tem prioridade e prazo, e tudo fica salvo no próprio navegador.',
      features: [
        'Três colunas e tarefas com prioridade (alta, média ou baixa) e prazo',
        'Busca por texto e filtro por prioridade',
        'Edição das tarefas em uma janela própria',
        'Tema escuro e exportação das tarefas em JSON'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'],
      aprendi: 'Foi o projeto em que mais trabalhei com estado: manter a lista de tarefas organizada, salvar no navegador e redesenhar a tela a cada mudança sem perder nada.',
      demo: 'https://igormrgomes.github.io/foco/',
      repo: 'https://github.com/igormrgomes/foco'
    },
    tempo: {
      icone: 'cloud-sun',
      titulo: 'Tempo — Previsão do Tempo',
      ano: '2026',
      status: 'Concluído',
      statusClasse: 'done',
      desc: 'App de previsão do tempo de qualquer cidade, usando os dados da API Open-Meteo, que é gratuita e não exige chave de acesso.',
      features: [
        'Busca da previsão pelo nome da cidade',
        'Botão para usar a localização do próprio aparelho',
        'Dados reais vindos de uma API pública'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'API REST'],
      aprendi: 'Foi meu primeiro projeto consumindo uma API de verdade: aprendi a fazer requisições com fetch, tratar a resposta e lidar com erros, como cidade não encontrada.',
      demo: 'https://igormrgomes.github.io/tempo/',
      repo: 'https://github.com/igormrgomes/tempo'
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

      document.getElementById('modalIcone').innerHTML = icone(dados.icone);
      document.getElementById('modalTitulo').textContent = dados.titulo;
      document.getElementById('modalAno').textContent    = dados.ano;
      document.getElementById('modalDesc').textContent   = dados.desc;
      document.getElementById('modalAprendi').textContent = dados.aprendi;

      const badge = document.getElementById('modalStatus');
      badge.textContent = dados.status;
      badge.className = 'status-badge ' + dados.statusClasse;

      // Botão "Ver site no ar" — só aparece se o projeto tiver link ao vivo
      const btnDemo = document.getElementById('modalDemo');
      if (dados.demo) {
        btnDemo.href = dados.demo;
        btnDemo.hidden = false;
      } else {
        btnDemo.hidden = true;
      }

      // Botão do GitHub — usa o repositório do projeto, ou o perfil como padrão
      document.getElementById('modalGithub').href = dados.repo || 'https://github.com/igormrgomes';

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
      mostrarAlerta('aviso', 'Ops, faltou alguma coisa', 'Verifique os campos destacados em vermelho e tente novamente.');
      return;
    }

    /* ------------------------------------------------------
       Envio real pelo Formspree. O endereço vem do atributo
       action do <form> no index.html.
       ------------------------------------------------------ */
    const botaoEnviar = document.getElementById('btnEnviar');
    const textoBotao = botaoEnviar.textContent;
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';

    fetch(formulario.action, {
      method: 'POST',
      body: new FormData(formulario),
      headers: { 'Accept': 'application/json' }
    })
    .then(async (resposta) => {
      if (!resposta.ok) {
        // Mostra no console (F12) o motivo que o Formspree devolveu
        const detalhe = await resposta.json().catch(() => ({}));
        console.error('Formspree recusou o envio:', resposta.status, detalhe);
        throw new Error('Falha no envio: ' + resposta.status);
      }
      soltarConfete();
      mostrarAlerta('sucesso', 'Mensagem enviada!', 'Obrigado pelo contato. Responderei em breve.');
      formulario.reset();
      formulario.querySelectorAll('.valid').forEach((c) => c.classList.remove('valid'));
      contadorChars.textContent = '0 / 500';
    })
    .catch(() => {
      mostrarAlerta('erro', 'Erro no envio', 'Algo deu errado. Tente novamente ou me chame pelo e-mail.');
    })
    .finally(() => {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoBotao;
    });
  });

  function mostrarErro(id, texto) {
    document.getElementById(id).classList.add('invalid');
    document.getElementById('err-' + id).textContent = texto;
  }

  function limparErro(id) {
    document.getElementById(id).classList.remove('invalid');
    document.getElementById('err-' + id).textContent = '';
  }

  const iconesAlerta = { sucesso: 'check-circle', erro: 'x-circle', aviso: 'alert-triangle' };

  function mostrarAlerta(tipo, titulo, texto) {
    const alvo = document.getElementById('alertaIcone');
    alvo.className = 'alerta-icone ' + tipo;
    alvo.innerHTML = icone(iconesAlerta[tipo] || 'check-circle');
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

  // Seção ativa = a última cuja parte de cima já passou de uma linha de referência
  // (funciona para seções de qualquer altura e também no fim da página)
  let esperandoQuadro = false;
  function atualizarSecaoAtiva() {
    esperandoQuadro = false;
    const linhaRef = window.scrollY + window.innerHeight * 0.3;
    let atual = secoes[0].id;
    secoes.forEach(s => {
      if (s.getBoundingClientRect().top + window.scrollY <= linhaRef) atual = s.id;
    });
    const chegouNoFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (chegouNoFim) atual = secoes[secoes.length - 1].id;
    linksNav.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + atual);
    });
  }
  function pedirAtualizacao() {
    if (!esperandoQuadro) { esperandoQuadro = true; requestAnimationFrame(atualizarSecaoAtiva); }
  }
  window.addEventListener('scroll', pedirAtualizacao, { passive: true });
  window.addEventListener('resize', pedirAtualizacao);
  window.addEventListener('load', atualizarSecaoAtiva);
  atualizarSecaoAtiva();

  const barraProgresso = document.getElementById('scrollProgress');
  const header  = document.getElementById('header');
  const btnTopo = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const rolagem = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

    barraProgresso.style.width = (alturaTotal > 0 ? (rolagem / alturaTotal) * 100 : 0) + '%';
    header.classList.toggle('scrolled', rolagem > 20);
    btnTopo.classList.toggle('visible', rolagem > 500);

    // Anel de progresso ao redor do botão (131.95 = circunferência do círculo)
    const anel = document.getElementById('progressRingFill');
    if (anel && alturaTotal > 0) {
      anel.style.strokeDashoffset = 131.95 * (1 - rolagem / alturaTotal);
    }
  }, { passive: true });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefereMenosMovimento ? 'auto' : 'smooth' });
  });



  /* =================================================
     13. MICRO-INTERAÇÕES (mouse, toque e detalhes)
     ================================================= */
  const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 13.1 Toast (aviso flutuante) ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function mostrarToast(texto) {
    toastEl.innerHTML = icone('check');
    toastEl.append(document.createTextNode(texto));
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---------- 13.2 Copiar e-mail / telefone ---------- */
  document.querySelectorAll('.copy-btn').forEach(botao => {
    botao.addEventListener('click', async () => {
      const texto = botao.dataset.copy;
      try {
        await navigator.clipboard.writeText(texto);
      } catch (e) {
        // Plano B para navegadores sem a API de área de transferência
        const temp = document.createElement('textarea');
        temp.value = texto;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); } catch (err) { /* ignora */ }
        temp.remove();
      }
      botao.classList.add('copiado');
      mostrarToast('Copiado: ' + texto);
      setTimeout(() => botao.classList.remove('copiado'), 1600);
    });
  });

  /* ---------- 13.3 Efeito ripple (onda ao clicar) ---------- */
  const alvosRipple = '.btn, .filter-btn, .overlay-btn, .copy-btn, .theme-toggle, .social-link';

  document.querySelectorAll(alvosRipple).forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      if (prefereMenosMovimento) return;
      const rect = el.getBoundingClientRect();
      const tamanho = Math.max(rect.width, rect.height);
      const onda = document.createElement('span');
      onda.className = 'ripple-wave';
      onda.style.width = onda.style.height = tamanho + 'px';
      onda.style.left = (e.clientX - rect.left - tamanho / 2) + 'px';
      onda.style.top  = (e.clientY - rect.top - tamanho / 2) + 'px';
      el.appendChild(onda);
      setTimeout(() => onda.remove(), 700);
    });
  });

  /* ---------- 13.4 Brilho que segue o mouse nos cards ---------- */
  document.querySelectorAll('.skill-card, .timeline-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  /* ---------- 13.5 Holofote no hero ---------- */
  const heroSecao = document.querySelector('.hero');
  if (heroSecao && temMouse && !prefereMenosMovimento) {
    heroSecao.addEventListener('mousemove', (e) => {
      const rect = heroSecao.getBoundingClientRect();
      heroSecao.style.setProperty('--sx', (e.clientX - rect.left) + 'px');
      heroSecao.style.setProperty('--sy', (e.clientY - rect.top) + 'px');
    });
  }

  /* ---------- 13.6 Tilt 3D nos cards de projeto ---------- */
  if (temMouse && !prefereMenosMovimento) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.classList.add('tilting');
        card.style.transform =
          `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  /* ---------- 13.7 Botões magnéticos ---------- */
  if (temMouse && !prefereMenosMovimento) {
    document.querySelectorAll('.btn-primary, .btn-secondary, .theme-toggle, .social-link, .back-to-top').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 13.8 Cursor personalizado ---------- */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (temMouse && !prefereMenosMovimento && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, primeiroMovimento = true;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (primeiroMovimento) {
        // Evita o cursor "piscar" no canto da tela antes do primeiro movimento
        ringX = mouseX; ringY = mouseY;
        primeiroMovimento = false;
        document.body.classList.add('cursor-ativo');
      }
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // O anel "persegue" o ponto com um pequeno atraso (efeito suave)
    (function animarAnel() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animarAnel);
    })();

    const clicaveis = 'a, button, input, textarea, select, label, .tilt-card, .chip, .stat';

    document.addEventListener('mouseover', (e) => {
      cursorRing.classList.toggle('hover', !!e.target.closest(clicaveis));
    });
    document.addEventListener('mousedown', () => cursorRing.classList.add('click'));
    document.addEventListener('mouseup',   () => cursorRing.classList.remove('click'));

    // Some quando o mouse sai da janela
    document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ativo'));
    document.documentElement.addEventListener('mouseenter', () => {
      if (!primeiroMovimento) document.body.classList.add('cursor-ativo');
    });
  }

  /* ---------- 13.9 Indicador deslizante do menu ---------- */
  const indicador = document.getElementById('navIndicator');

  function posicionarIndicador() {
    const ativo = navLinks.querySelector('a.active:not(.nav-cta)');
    if (!ativo || !indicador || window.innerWidth <= 860) {
      if (indicador) indicador.classList.remove('show');
      return;
    }
    indicador.style.left  = ativo.offsetLeft + 'px';
    indicador.style.width = ativo.offsetWidth + 'px';
    indicador.classList.add('show');
  }

  // Sempre que um link ganha/perde a classe "active", o indicador acompanha
  // (observa só os links — nunca o próprio indicador, senão ele dispara a si mesmo em loop)
  const observadorMenu = new MutationObserver(posicionarIndicador);
  navLinks.querySelectorAll('a').forEach(link => {
    observadorMenu.observe(link, { attributes: true, attributeFilter: ['class'] });
  });
  window.addEventListener('resize', posicionarIndicador);
  window.addEventListener('load', posicionarIndicador);

  /* ---------- 13.10 Confete de comemoração ---------- */
  function soltarConfete() {
    if (prefereMenosMovimento) return;
    const cores = ['#8B7CF6', '#22D3EE', '#4ADE80', '#FBBF24', '#F87171', '#60A5FA'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('div');
      p.className = 'confete';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = cores[Math.floor(Math.random() * cores.length)];
      p.style.animationDuration = (2.2 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4800);
    }
  }

  /* ---------- 13.11 Validação positiva (borda verde) ---------- */
  const regrasValidas = {
    nome:     v => v.trim().length >= 2,
    telefone: v => v.replace(/\D/g, '').length >= 10,
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
  };
  Object.keys(regrasValidas).forEach(id => {
    const campo = document.getElementById(id);
    campo.addEventListener('input', () => {
      campo.classList.toggle('valid', regrasValidas[id](campo.value));
    });
  });

  /* =================================================
     12. ANO AUTOMÁTICO NO RODAPÉ
     ================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

});

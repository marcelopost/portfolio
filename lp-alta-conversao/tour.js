/**
 * Aera Pro — Camada de TOUR guiado (peça demonstrativa)
 *
 * Isolado do resto: não altera nada da LP. Só adiciona:
 *  1) Um FAB "Ver os pontos de conversão".
 *  2) Um modal de boas-vindas (fundo blur, botão X, Cancelar e Iniciar).
 *  3) O tour em si (Driver.js), com uma explicação breve de cada ponto
 *     ancorada nas diretrizes do diagnóstico de conversão.
 *
 * Depende de: vendor/driver.iife.js e vendor/driver.css (carregados no HTML).
 * Os passos leem os data-block já existentes nas seções — nada de IDs novos.
 */
(function () {
  "use strict";

  if (!window.driver || !window.driver.js) {
    console.warn("[tour] Driver.js não carregado — tour desativado.");
    return;
  }
  var driver = window.driver.js.driver;

  /* ----------------------------------------------------------
     Passos do tour — cada um aponta para uma seção real da LP
     (por id) e traz o bloco do diagnóstico + explicação curta.
     ---------------------------------------------------------- */
  var steps = [
    {
      element: "#hero",
      popover: {
        title: "A primeira dobra",
        description:
          '<span class="aera-tour__tag">Impacto altíssimo</span>' +
          "Em ~3 segundos o visitante já decide se fica. Aqui ele vê o que é, o benefício, a prova (4,8) e o botão — tudo sem rolar, uma ação só.",
      },
    },
    {
      element: "#recursos",
      popover: {
        title: "Benefício, não ficha técnica",
        description:
          '<span class="aera-tour__tag">Descrição que vende</span>' +
          "Cada número vem com o que ele significa no seu dia a dia. Especificação sozinha não vende; especificação traduzida em benefício, sim.",
      },
    },
    {
      element: "#uso",
      popover: {
        title: "Imagens de uso real",
        description:
          '<span class="aera-tour__tag">Desejo</span>' +
          "Foto do produto sendo usado na vida real — não catálogo de fundo branco. É o que faz o visitante se imaginar com ele.",
      },
    },
    {
      element: "#demonstracao",
      popover: {
        title: "Vídeo que prova",
        description:
          '<span class="aera-tour__tag">Desejo</span>' +
          "Vídeo relevante pode elevar muito a conversão. Play manual e carregamento sob demanda, pra não pesar a página.",
      },
    },
    {
      element: "#comparacao",
      popover: {
        title: "Quebra de objeção",
        description:
          '<span class="aera-tour__tag">Prova + comparação</span>' +
          "Enfrenta de frente a dúvida do preço baixo, com a comparação lado a lado. O visual argumenta por você.",
      },
    },
    {
      element: "#avaliacoes",
      popover: {
        title: "Prova social crível",
        description:
          '<span class="aera-tour__tag">Impacto altíssimo</span>' +
          "Volume de avaliações e nota real (com uma de 4 estrelas). Nota 5,0 forçada gera desconfiança; nota crível converte.",
      },
    },
    {
      element: "#confianca",
      popover: {
        title: "Tirar o medo de comprar",
        description:
          '<span class="aera-tour__tag">Confiança + checkout</span>' +
          "Garantia, devolução, frete e compra segura à vista — e o aviso de checkout sem cadastro obrigatório, que reduz abandono.",
      },
    },
    {
      element: "#oferta",
      popover: {
        title: "Preço e urgência legítima",
        description:
          '<span class="aera-tour__tag">CTA / preço</span>' +
          "Âncora de/por, parcelamento e escassez real (lote de lançamento). Urgência verdadeira converte; falsa destrói confiança.",
      },
    },
    {
      element: "#faq",
      popover: {
        title: "Última objeção derrubada",
        description:
          '<span class="aera-tour__tag">Descrição / objeção</span>' +
          "As perguntas que travam a compra, respondidas antes do visitante desistir. É a última barreira entre ele e o botão.",
      },
    },
  ];

  var driverObj = driver({
    showProgress: true,
    animate: true,
    smoothScroll: false,
    allowClose: true,
    overlayColor: "#0a0b0d",
    overlayOpacity: 0.7,
    stagePadding: 6,
    stageRadius: 12,
    popoverClass: "aera-tour",
    progressText: "Ponto {{current}} de {{total}}",
    nextBtnText: "Próximo →",
    prevBtnText: "← Anterior",
    doneBtnText: "Concluir",
    steps: steps,
    onDestroyed: function () {
      showFab();
    },
  });

  /* ----------------------------------------------------------
     FAB — botão flutuante que abre o modal de boas-vindas
     ---------------------------------------------------------- */
  var fab = document.createElement("button");
  fab.className = "tour-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Ver os pontos de conversão desta página");
  fab.innerHTML =
    '<svg class="tour-fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v3"></path><path d="M11 14h.01"></path></svg>' +
    "<span>Ver os pontos de conversão</span>";
  document.body.appendChild(fab);

  function showFab() { fab.style.display = "inline-flex"; }
  function hideFab() { fab.style.display = "none"; }

  /* ----------------------------------------------------------
     Modal de boas-vindas (blur + X + Cancelar + Iniciar tour)
     ---------------------------------------------------------- */
  var overlay = document.createElement("div");
  overlay.className = "tour-welcome-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "tour-welcome-title");
  overlay.innerHTML =
    '<div class="tour-welcome">' +
      '<button class="tour-welcome__close" type="button" aria-label="Fechar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      "</button>" +
      '<span class="tour-welcome__badge">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>' +
        "Tour guiado" +
      "</span>" +
      '<h2 class="tour-welcome__title" id="tour-welcome-title">Cada elemento desta página tem <span class="accent">uma razão medida</span>.</h2>' +
      '<p class="tour-welcome__text">Este tour rápido mostra, ponto a ponto, as técnicas de conversão aplicadas aqui — as mesmas que uso para transformar visitas em vendas. Leva menos de 1 minuto.</p>' +
      '<div class="tour-welcome__actions">' +
        '<button class="tour-welcome__btn tour-welcome__btn--ghost" type="button" data-tour-cancel>Agora não</button>' +
        '<button class="tour-welcome__btn tour-welcome__btn--primary" type="button" data-tour-start>Iniciar o tour</button>' +
      "</div>" +
    "</div>";
  document.body.appendChild(overlay);

  var closeBtn = overlay.querySelector(".tour-welcome__close");
  var cancelBtn = overlay.querySelector("[data-tour-cancel]");
  var startBtn = overlay.querySelector("[data-tour-start]");

  function openWelcome() {
    overlay.classList.add("is-open");
    hideFab();
    startBtn.focus();
  }
  function closeWelcome() {
    overlay.classList.remove("is-open");
    showFab();
  }
  function startTour() {
    overlay.classList.remove("is-open");
    hideFab();
    driverObj.drive();
  }

  fab.addEventListener("click", openWelcome);
  closeBtn.addEventListener("click", closeWelcome);
  cancelBtn.addEventListener("click", closeWelcome);
  startBtn.addEventListener("click", startTour);

  // Fechar clicando fora do card
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeWelcome();
  });
  // Fechar com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeWelcome();
  });

  /* ----------------------------------------------------------
     Abre o modal automaticamente ao carregar (só uma vez por
     sessão, para não incomodar em recargas). Sem localStorage
     por ser peça demonstrativa — usa flag em memória via URL.
     ---------------------------------------------------------- */
  window.addEventListener("load", function () {
    // pequeno atraso para a dobra assentar antes de sobrepor o modal
    setTimeout(openWelcome, 600);
  });
})();

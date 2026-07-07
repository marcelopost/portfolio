/**
 * Aera Pro — LP de exemplo (peça demonstrativa)
 *
 * Escopo intencionalmente pequeno (Bloco 5 — velocidade):
 * 1) Sticky CTA mobile: aparece só depois que o hero sai da tela.
 * 2) Vídeo demonstrativo: troca o poster por um player real só quando
 *    o usuário clica em play (lazy load real, não apenas o atributo).
 *
 * Nenhuma biblioteca externa. Nenhum listener de scroll (usa
 * IntersectionObserver, que é performático e não trava o main thread).
 */

(function () {
  "use strict";

  initStickyCta();
  initVideoDemo();
  initFloatingDecor();

  /**
   * Mostra a barra fixa de CTA no mobile assim que o usuário rola
   * para além do hero. Some novamente se ele voltar pro topo.
   */
  function initStickyCta() {
    var hero = document.getElementById("hero");
    var stickyCta = document.getElementById("sticky-cta");

    if (!hero || !stickyCta || !("IntersectionObserver" in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var heroVisible = entry.isIntersecting;
          stickyCta.classList.toggle("is-visible", !heroVisible);
          stickyCta.setAttribute("aria-hidden", heroVisible ? "true" : "false");
        });
      },
      { threshold: 0 }
    );

    observer.observe(hero);
  }

  /**
   * Vídeo demonstrativo com play manual (Bloco 4) e lazy load de verdade:
   * o <video> só é criado no DOM quando o usuário pede pra assistir,
   * então nenhum peso de vídeo é baixado até essa ação (Bloco 5).
   *
   * Como esta é uma peça demonstrativa, não há arquivo de vídeo real —
   * o clique troca o poster por uma tela de "reproduzindo" ilustrativa.
   * Em produção, troque o conteúdo do bloco pelo <video> comentado no HTML.
   */
  function initVideoDemo() {
    var trigger = document.getElementById("video-demo-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", function () {
      var section = trigger.closest(".video-demo");
      if (section) {
        section.classList.add("is-playing");
      }
      trigger.setAttribute("aria-label", "Vídeo demonstrativo (placeholder — peça demonstrativa)");
      trigger.disabled = true;
    });
  }

  /**
   * Elementos decorativos flutuantes (fotos do produto em ângulo,
   * ver `.floating-decor-layer` no HTML).
   *
   * Comportamento: cada elemento é "amarrado" a uma zona da página
   * (do topo de uma seção até o fim de outra). Conforme essa zona
   * atravessa a viewport durante o scroll, o elemento se desloca
   * verticalmente (mais lento que o conteúdo — efeito parallax) e
   * gira suavemente; parado = elemento parado.
   *
   * Importante sobre performance/estabilidade (evita o bug anterior):
   * - A camada pai é `position: fixed` + `overflow: hidden` (ver CSS),
   *   então a posição de cada imagem é sempre relativa à VIEWPORT
   *   (via getBoundingClientRect, sem somar scrollY) — não depende de
   *   offsetParent nem de position:relative em nenhum ancestral.
   * - Só a propriedade `transform` é escrita a cada frame (nunca
   *   `top`/`left`), então não há reflow: é 100% composto pela GPU e
   *   não pode travar a rolagem da página.
   * - `overflow: hidden` fica só na camada fixa (não no html/body),
   *   então o scroll da página em si nunca é afetado.
   *
   * AJUSTES RÁPIDOS:
   * - FLOAT_PARALLAX: 0 a 1. Quanto menor, mais o elemento "flutua"
   *   devagar em relação ao conteúdo (mais lag/drift visível).
   * - FLOAT_ROTATION_DEG: amplitude do giro entre início e fim da zona.
   * - `offset` (por zona, no array abaixo): empurra o elemento pra
   *   baixo (valor positivo) ou pra cima (negativo) dentro da tela.
   * - As ZONAS (seção inicial/final de cada elemento) ficam no array
   *   `zones` abaixo — troque os ids se quiser outras seções.
   */
  function initFloatingDecor() {
    var FLOAT_PARALLAX = 0.45;
    var FLOAT_ROTATION_DEG = 10;

    var zones = [
      { el: document.getElementById("decor-left"), startId: "recursos", endId: "uso", offset: 220 },
      { el: document.getElementById("decor-right"), startId: "comparacao", endId: "cta-final", offset: 0 }
    ]
      .map(function (zone) {
        zone.start = document.getElementById(zone.startId);
        zone.end = document.getElementById(zone.endId);
        return zone;
      })
      .filter(function (zone) {
        return zone.el && zone.start && zone.end;
      });

    if (!zones.length) {
      return;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;

    function update() {
      var viewportH = window.innerHeight;

      zones.forEach(function (zone) {
        var startTop = zone.start.getBoundingClientRect().top;
        var endBottom = zone.end.getBoundingClientRect().bottom;
        var zoneHeight = Math.max(endBottom - startTop, 1);

        // progresso 0→1 conforme a zona atravessa a viewport (tudo em
        // coordenadas de viewport, recalculado a cada frame — não
        // precisa de scrollY porque getBoundingClientRect já reflete
        // a posição atual na tela).
        var progress = (viewportH - startTop) / (zoneHeight + viewportH);
        progress = Math.max(0, Math.min(1, progress));

        var translateY = startTop * FLOAT_PARALLAX + (zone.offset || 0);
        var rotate = (progress - 0.5) * 2 * FLOAT_ROTATION_DEG;

        zone.el.style.transform =
          "translateY(" + translateY.toFixed(1) + "px) rotate(" + rotate.toFixed(2) + "deg)";
      });

      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();

    window.addEventListener("resize", onScrollOrResize);

    if (!reduceMotion) {
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
    }
  }
})();

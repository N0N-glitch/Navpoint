(() => {
  "use strict";

  if (window.NavpointRain) return;

  const CHARS =
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
  const TICK_MS = 33;

  // mode "cover": a chuva cai e cobre a tela (a página fica coberta).
  // mode "reveal": começa com a tela coberta e a chuva some, revelando a página.
  function play(options = {}) {
    const mode = options.mode === "reveal" ? "reveal" : "cover";
    const duration = Math.max(1000, Number(options.duration) || 2600);
    const onReveal =
      typeof options.onReveal === "function" ? options.onReveal : () => {};
    const onDone =
      typeof options.onDone === "function" ? options.onDone : () => {};

    const reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sem animação para quem pediu movimento reduzido.
    if (reducedMotion) {
      setTimeout(() => {
        onReveal();
        onDone();
      }, 0);

      return { remove() {} };
    }

    const host = document.createElement("div");
    host.style.all = "initial";

    Object.assign(host.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "2147483647",
      pointerEvents: "auto"
    });

    const root = host.attachShadow({ mode: "closed" });

    const backdrop = document.createElement("div");

    Object.assign(backdrop.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "#000000",
      opacity: mode === "reveal" ? "1" : "0"
    });

    const canvas = document.createElement("canvas");

    Object.assign(canvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      opacity: "1"
    });

    root.append(backdrop, canvas);
    document.documentElement.appendChild(host);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      host.remove();
      setTimeout(() => {
        onReveal();
        onDone();
      }, 0);

      return { remove() {} };
    }

    ctx.scale(dpr, dpr);

    const fontSize = width < 500 ? 14 : 16;

    ctx.font = fontSize + "px 'Courier New', Courier, monospace";
    ctx.textBaseline = "top";

    const columns = Math.ceil(width / fontSize);
    const rows = Math.ceil(height / fontSize);

    const drops = [];
    const speeds = [];

    for (let i = 0; i < columns; i++) {
      drops.push(
        mode === "reveal"
          ? Math.floor(Math.random() * rows)
          : -Math.floor(Math.random() * rows * 0.35)
      );

      speeds.push(0.6 + Math.random() * 0.8);
    }

    let finished = false;
    let revealStarted = false;
    let lastTick = 0;

    function step() {
      // Apaga um pouco o desenho anterior para formar o rastro.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.10)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < columns; i++) {
        const row = Math.floor(drops[i]);

        if (row >= 0 && row <= rows) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];

          ctx.fillStyle = Math.random() > 0.9 ? "#b8ffb8" : "#00ff00";
          ctx.fillText(char, i * fontSize, row * fontSize);
        }

        drops[i] += speeds[i];

        if (
          !revealStarted &&
          drops[i] * fontSize > height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }
      }
    }

    function startReveal() {
      revealStarted = true;

      const fadeMs = Math.round(duration * 0.6);

      backdrop.style.transition = "opacity " + fadeMs + "ms ease-out";
      canvas.style.transition = "opacity " + fadeMs + "ms ease-out";

      backdrop.style.opacity = "0";
      canvas.style.opacity = "0";

      onReveal();
    }

    function finish() {
      finished = true;

      // No modo "cover" a camada fica até a página mudar.
      if (mode === "reveal") {
        host.remove();
      }

      onDone();
    }

    const startedAt = performance.now();

    function frame(now) {
      if (finished) return;

      const elapsed = now - startedAt;

      if (mode === "reveal" && !revealStarted && elapsed >= duration * 0.4) {
        startReveal();
      }

      if (now - lastTick >= TICK_MS) {
        lastTick = now;
        step();
      }

      if (elapsed >= duration) {
        finish();
        return;
      }

      requestAnimationFrame(frame);
    }

    if (mode === "reveal") {
      // Já começa com a chuva formada.
      for (let i = 0; i < 24; i++) {
        step();
      }
    } else {
      // Força o navegador a registrar a opacidade 0 antes da transição.
      void backdrop.offsetWidth;

      backdrop.style.transition =
        "opacity " + Math.round(duration * 0.8) + "ms ease-in";
      backdrop.style.opacity = "1";
    }

    requestAnimationFrame(frame);

    return {
      remove() {
        finished = true;
        host.remove();
      }
    };
  }

  window.NavpointRain = Object.freeze({ play });
})();

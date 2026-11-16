(() => {
  "use strict";

  if (document.getElementById("navpoint-floating-button")) return;

  const ONBOARDING_DONE_KEY = "navpoint_onboarding_done";
  const LANGUAGE_KEY = "navpoint_language";

  const SETUP_TEXTS = {
    pt: {
      message: "Navpoint está pronto. Posso te levar para as configurações?",
      yes: "Sim",
      no: "Agora não",
      error: "Não foi possível abrir as configurações."
    },
    en: {
      message: "Navpoint is ready. Can I take you to the settings?",
      yes: "Yes",
      no: "Not now",
      error: "Could not open the settings."
    },
    es: {
      message: "Navpoint está listo. ¿Puedo llevarte a la configuración?",
      yes: "Sí",
      no: "Ahora no",
      error: "No se pudo abrir la configuración."
    }
  };

  let terminalFrame = null;

  const button = document.createElement("button");

  button.id = "navpoint-floating-button";
  button.type = "button";
  button.textContent = "⌘";
  button.setAttribute("aria-label", "Abrir Navpoint");

  Object.assign(button.style, {
    position: "fixed",
    top: "14px",
    left: "12px",
    width: "48px",
    height: "48px",
    border: "1px solid rgba(0,255,136,.3)",
    borderRadius: "14px",
    background: "#07120c",
    color: "#00ff88",
    fontSize: "25px",
    cursor: "pointer",
    zIndex: "2147483647",
    boxShadow: "0 0 18px rgba(0,255,136,.15)"
  });

  function closeTerminal() {
    if (terminalFrame) {
      terminalFrame.remove();
      terminalFrame = null;
    }

    button.setAttribute("aria-label", "Abrir Navpoint");
  }

  function openTerminal() {
    if (terminalFrame) return;

    terminalFrame = document.createElement("iframe");
    terminalFrame.id = "navpoint-terminal-frame";
    terminalFrame.title = "Navpoint Terminal";
    terminalFrame.src = chrome.runtime.getURL("terminal/terminal.html");

    const initialWidth = Math.min(330, window.innerWidth - 20);
    const initialHeight = Math.min(360, window.innerHeight - 90);

    Object.assign(terminalFrame.style, {
      position: "fixed",
      top: "74px",
      left: "10px",
      width: `${Math.max(260, initialWidth)}px`,
      height: `${Math.max(220, initialHeight)}px`,
      border: "0",
      borderRadius: "15px",
      background: "transparent",
      zIndex: "2147483646"
    });

    document.documentElement.appendChild(terminalFrame);

    button.setAttribute("aria-label", "Navpoint aberto");
  }

  button.addEventListener("click", () => {
    if (terminalFrame) {
      closeTerminal();
    } else {
      openTerminal();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.source !== terminalFrame?.contentWindow) return;

    // Fechar o terminal
    if (event.data === "NAVPOINT_CLOSE") {
      closeTerminal();
      return;
    }

    // Solicitar navegação ao background.js
    if (event.data?.type === "NAVPOINT_OPEN_URL") {
      const requestedUrl = event.data.url;

      chrome.runtime.sendMessage(
        {
          type: "NAVPOINT_OPEN_URL",
          url: requestedUrl
        },
        (response) => {
          const runtimeError = chrome.runtime.lastError;

          if (runtimeError) {
            sendTerminalMessage({
              type: "NAVPOINT_OPEN_RESULT",
              ok: false,
              error: "Não foi possível comunicar com o Navpoint."
            });

            return;
          }

          sendTerminalMessage({
            type: "NAVPOINT_OPEN_RESULT",
            ...(response || {
              ok: false,
              error: "O navegador não retornou uma resposta."
            })
          });
        }
      );

      return;
    }

    // Redimensionar o terminal
    if (event.data?.type === "NAVPOINT_RESIZE") {
      const maxWidth = Math.max(260, window.innerWidth - 20);
      const maxHeight = Math.max(220, window.innerHeight - 90);

      const width = Math.min(
        maxWidth,
        Math.max(260, Number(event.data.width) || 330)
      );

      const height = Math.min(
        maxHeight,
        Math.max(220, Number(event.data.height) || 360)
      );

      terminalFrame.style.width = `${width}px`;
      terminalFrame.style.height = `${height}px`;
    }
  });

  function sendTerminalMessage(message) {
    if (!terminalFrame?.contentWindow) return;

    const extensionOrigin = new URL(
      chrome.runtime.getURL("")
    ).origin;

    terminalFrame.contentWindow.postMessage(
      message,
      extensionOrigin
    );
  }

  // Pede ao background para levar esta aba ao onboarding.
  function requestOnboarding(onFail) {
    try {
      chrome.runtime.sendMessage(
        { type: "NAVPOINT_OPEN_ONBOARDING" },
        (response) => {
          const runtimeError = chrome.runtime.lastError;

          if (runtimeError || !response || !response.ok) {
            onFail();
          }
        }
      );
    } catch (error) {
      onFail();
    }
  }

  // Pergunta se pode levar a pessoa às configurações.
  function showSetupPrompt(codes) {
    if (document.getElementById("navpoint-setup-prompt")) return;

    const host = document.createElement("div");

    host.id = "navpoint-setup-prompt";
    host.style.all = "initial";

    Object.assign(host.style, {
      position: "fixed",
      left: "50%",
      bottom: "16px",
      transform: "translateX(-50%)",
      width: "min(340px, calc(100vw - 24px))",
      zIndex: "2147483645"
    });

    const root = host.attachShadow({ mode: "closed" });

    const box = document.createElement("div");

    Object.assign(box.style, {
      boxSizing: "border-box",
      padding: "14px",
      border: "1px solid #00ff00",
      borderRadius: "10px",
      background: "#000000",
      color: "#00ff00",
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "14px",
      lineHeight: "1.45",
      boxShadow: "0 0 18px rgba(0,255,0,.2)"
    });

    codes.forEach((code) => {
      const line = document.createElement("p");

      line.textContent = "> " + SETUP_TEXTS[code].message;

      Object.assign(line.style, {
        margin: "0 0 8px",
        padding: "0"
      });

      box.appendChild(line);
    });

    function makeButton(label, filled) {
      const element = document.createElement("button");

      element.type = "button";
      element.textContent = label;

      Object.assign(element.style, {
        flex: "1",
        minHeight: "44px",
        padding: "8px 10px",
        border: "1px solid #00ff00",
        borderRadius: "6px",
        background: filled ? "#00ff00" : "transparent",
        color: filled ? "#000000" : "#00ff00",
        fontFamily: "inherit",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer"
      });

      return element;
    }

    const actions = document.createElement("div");

    Object.assign(actions.style, {
      display: "flex",
      gap: "8px",
      marginTop: "10px"
    });

    const yesButton = makeButton(
      codes.map((code) => SETUP_TEXTS[code].yes).join(" / "),
      true
    );

    const noButton = makeButton(
      codes.map((code) => SETUP_TEXTS[code].no).join(" / "),
      false
    );

    const statusLine = document.createElement("p");

    Object.assign(statusLine.style, {
      margin: "8px 0 0",
      padding: "0",
      color: "#ff4d4d"
    });

    actions.append(yesButton, noButton);
    box.append(actions, statusLine);
    root.appendChild(box);

    noButton.addEventListener("click", () => {
      host.remove();
    });

    yesButton.addEventListener("click", () => {
      yesButton.disabled = true;
      noButton.disabled = true;
      statusLine.textContent = "";

      let rain = null;

      const fail = () => {
        if (rain) rain.remove();

        yesButton.disabled = false;
        noButton.disabled = false;

        statusLine.textContent = codes
          .map((code) => SETUP_TEXTS[code].error)
          .join(" ");
      };

      if (!window.NavpointRain) {
        requestOnboarding(fail);
        return;
      }

      rain = window.NavpointRain.play({
        mode: "cover",
        duration: 2600,
        onDone: () => requestOnboarding(fail)
      });
    });

    document.documentElement.appendChild(host);
  }

  async function maybeShowSetupPrompt() {
    let saved;

    try {
      saved = await chrome.storage.local.get([
        ONBOARDING_DONE_KEY,
        LANGUAGE_KEY
      ]);
    } catch (error) {
      return;
    }

    if (saved[ONBOARDING_DONE_KEY] === true) return;

    const language = saved[LANGUAGE_KEY];

    // Sem idioma salvo, pergunta nos três idiomas.
    const codes = SETUP_TEXTS[language] ? [language] : ["pt", "en", "es"];

    showSetupPrompt(codes);
  }

  document.documentElement.appendChild(button);

  maybeShowSetupPrompt();
})();

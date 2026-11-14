
(() => {
  "use strict";

  const closeButton = document.getElementById("close-terminal");
  const minimizeButton = document.getElementById("minimize-terminal");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  const resizeHandle = document.getElementById("resize-handle");

  if (
    !closeButton ||
    !minimizeButton ||
    !form ||
    !input ||
    !output ||
    !resizeHandle
  ) {
    return;
  }

  // Fechar ou minimizar o terminal.
  function closeTerminal() {
    window.parent.postMessage("NAVPOINT_CLOSE", "*");
  }

  closeButton.addEventListener("click", closeTerminal);
  minimizeButton.addEventListener("click", closeTerminal);

  // Exibir mensagens no terminal.
  function printMessage(message, className = "") {
    const line = document.createElement("p");
    line.textContent = message;

    if (className) {
      line.className = className;
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  // Preparar e validar um endereço.
  function prepareAddress(value) {
    let address = value.trim();

    if (!address) {
      throw new Error("Digite um endereço para abrir.");
    }

    if (/\s/.test(address)) {
      throw new Error("O endereço não pode conter espaços.");
    }

    // Não permitir protocolos diferentes de HTTP e HTTPS.
    if (/^[a-z][a-z0-9+.-]*:/i.test(address)) {
      if (!/^https?:\/\//i.test(address)) {
        throw new Error("Somente endereços HTTP e HTTPS são permitidos.");
      }
    }

    // Nome simples: youtube vira youtube.com.
    if (!address.includes(".") && !/^https?:\/\//i.test(address)) {
      if (!/^[a-z0-9-]+$/i.test(address)) {
        throw new Error("Nome de site inválido.");
      }

      address += ".com";
    }

    if (!/^https?:\/\//i.test(address)) {
      address = "https://" + address;
    }

    let parsed;

    try {
      parsed = new URL(address);
    } catch {
      throw new Error("Não foi possível reconhecer esse endereço.");
    }

    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.username ||
      parsed.password
    ) {
      throw new Error("O endereço informado não é permitido.");
    }

    return parsed.href;
  }

  // Solicitar abertura de um endereço.
  function openAddress(value) {
    let url;

    try {
      url = prepareAddress(value);
    } catch (error) {
      printMessage(error.message, "error");
      return;
    }

    printMessage("Abrindo " + url + "...", "success");

    window.parent.postMessage(
      {
        type: "NAVPOINT_OPEN_URL",
        url
      },
      "*"
    );
  }

  // Receber respostas do content.js.
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent) return;

    const extensionOrigin = new URL(
      chrome.runtime.getURL("")
    ).origin;

    if (event.origin !== extensionOrigin) return;

    if (event.data?.type === "NAVPOINT_OPEN_RESULT") {
      if (!event.data.ok) {
        printMessage(
          event.data.error || "Não foi possível abrir o endereço.",
          "error"
        );
      }
    }
  });

  // Interpretar comandos.
  function executeCommand(rawCommand) {
    const command = rawCommand.trim();

    if (!command) return;

    printMessage("> " + command);

    const firstSpace = command.search(/\s/);

    const action = (
      firstSpace === -1
        ? command
        : command.slice(0, firstSpace)
    ).toLowerCase();

    const argument = firstSpace === -1
      ? ""
      : command.slice(firstSpace).trim();

    switch (action) {
      case "help":
        printMessage("COMANDOS DISPONÍVEIS:");
        printMessage("help — mostra os comandos.");
        printMessage("clear — limpa o terminal.");
        printMessage("version — mostra a versão.");
        printMessage("open endereço — abre um site.");
        printMessage("youtube — tenta abrir youtube.com.");
        printMessage("github — tenta abrir github.com.");
        printMessage("add — cadastrar atalho (em desenvolvimento).");
        printMessage("list — listar atalhos (em desenvolvimento).");
        printMessage("remove — remover atalho (em desenvolvimento).");
        printMessage("settings — abrir configurações (em desenvolvimento).");
        break;

      case "clear":
        output.replaceChildren();
        printMessage("Terminal limpo.");
        break;

      case "version":
        printMessage("Navpoint versão 1.0.0");
        break;

      case "open":
        if (!argument) {
          printMessage("Uso correto: open youtube.com");
          break;
        }

        openAddress(argument);
        break;

      case "add":
      case "list":
      case "remove":
      case "settings":
      case "config":
        printMessage("Este comando será implementado em uma próxima etapa.");
        break;

      default:
        // Nomes de sites digitados diretamente.
        openAddress(command);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = input.value;
    input.value = "";

    executeCommand(command);
    input.focus();
  });

  // Redimensionar com toque ou mouse.
  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  resizeHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    resizing = true;

    startX = event.clientX;
    startY = event.clientY;
    startWidth = window.innerWidth;
    startHeight = window.innerHeight;

    resizeHandle.setPointerCapture(event.pointerId);
  });

  resizeHandle.addEventListener("pointermove", (event) => {
    if (!resizing) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    const width = startWidth + deltaX;
    const height = startHeight + deltaY;

    window.parent.postMessage(
      {
        type: "NAVPOINT_RESIZE",
        width,
        height
      },
      "*"
    );
  });

  function stopResizing() {
    resizing = false;
  }

  resizeHandle.addEventListener("pointerup", stopResizing);
  resizeHandle.addEventListener("pointercancel", stopResizing);
  resizeHandle.addEventListener("lostpointercapture", stopResizing);

  input.focus();
})();

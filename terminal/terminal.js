
(() => {
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

  // Interpretar comandos.
  function executeCommand(rawCommand) {
    const command = rawCommand.trim();

    if (!command) return;

    printMessage("> " + command);

    const parts = command.split(/\s+/);
    const action = parts[0].toLowerCase();

    switch (action) {
      case "help":
        printMessage("COMANDOS DISPONÍVEIS:");
        printMessage("help — mostra os comandos.");
        printMessage("clear — limpa o terminal.");
        printMessage("version — mostra a versão.");
        printMessage("open — abrir um endereço (em desenvolvimento).");
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
      case "add":
      case "list":
      case "remove":
      case "settings":
      case "config":
        printMessage("Este comando será implementado na próxima etapa.");
        break;

      default:
        printMessage(
          'Comando não reconhecido: "' +
          command +
          '". Digite help para ver os comandos.'
        );
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

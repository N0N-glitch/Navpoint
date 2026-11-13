
(() => {
  const toggleButton = document.getElementById("navpoint-toggle");
  const terminal = document.getElementById("terminal");
  const closeButton = document.getElementById("close-terminal");
  const minimizeButton = document.getElementById("minimize-terminal");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (
    !toggleButton ||
    !terminal ||
    !closeButton ||
    !minimizeButton ||
    !form ||
    !input ||
    !output
  ) {
    return;
  }

  // Abre e fecha o terminal.
  function openTerminal() {
    terminal.classList.remove("hidden");
    toggleButton.setAttribute("aria-label", "Fechar Navpoint");
    input.focus();
  }

  function closeTerminal() {
    terminal.classList.add("hidden");
    toggleButton.setAttribute("aria-label", "Abrir Navpoint");
  }

  toggleButton.addEventListener("click", () => {
    if (terminal.classList.contains("hidden")) {
      openTerminal();
    } else {
      closeTerminal();
    }
  });

  closeButton.addEventListener("click", closeTerminal);
  minimizeButton.addEventListener("click", closeTerminal);

  // Adiciona mensagens sem interpretar HTML digitado.
  function printMessage(message, className = "") {
    const line = document.createElement("p");
    line.textContent = message;

    if (className) {
      line.className = className;
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  // Comandos iniciais do Navpoint.
  function executeCommand(rawCommand) {
    const command = rawCommand.trim();
    const normalized = command.toLowerCase();

    if (!command) return;

    printMessage("> " + command);

    switch (normalized) {
      case "help":
        printMessage("COMANDOS DISPONÍVEIS:");
        printMessage("help — mostra esta lista.");
        printMessage("clear — limpa o terminal.");
        printMessage("version — mostra a versão.");
        printMessage("open — navegação por endereço (em desenvolvimento).");
        printMessage("settings — configurações (em desenvolvimento).");
        break;

      case "clear":
        output.innerHTML = "";
        printMessage("Terminal limpo.");
        break;

      case "version":
        printMessage("Navpoint versão 1.0.0");
        break;

      case "open":
        printMessage("Informe um endereço. A navegação será implementada na próxima etapa.");
        break;

      case "settings":
      case "config":
        printMessage("As configurações serão implementadas em uma próxima etapa.");
        break;

      default:
        printMessage(
          'Comando não reconhecido: "' +
          command +
          '". Digite help para ver os comandos.'
        );
    }
  }

  // Recebe os comandos enviados pelo formulário.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = input.value;
    input.value = "";

    executeCommand(command);
    input.focus();
  });
})();


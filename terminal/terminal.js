(() => {
  "use strict";

  const closeButton = document.getElementById("close-terminal");
  const minimizeButton = document.getElementById("minimize-terminal");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  const resizeHandle = document.getElementById("resize-handle");

  const shortcutPanel = document.getElementById("shortcut-panel");
  const shortcutForm = document.getElementById("shortcut-form");
  const shortcutName = document.getElementById("shortcut-name");
  const shortcutUrl = document.getElementById("shortcut-url");
  const shortcutFeedback = document.getElementById("shortcut-feedback");
  const cancelShortcut = document.getElementById("cancel-shortcut");

  if (
    !closeButton ||
    !minimizeButton ||
    !form ||
    !input ||
    !output ||
    !resizeHandle ||
    !shortcutPanel ||
    !shortcutForm ||
    !shortcutName ||
    !shortcutUrl ||
    !shortcutFeedback ||
    !cancelShortcut
  ) {
    return;
  }

  // Armazenamento local.
  const HISTORY_KEY = "navpoint_terminal_history";
  const SHORTCUTS_KEY = "navpoint_shortcuts";
  const MAX_HISTORY = 200;

  // Nomes que não podem ser usados como atalhos.
  const RESERVED_NAMES = [
    "help",
    "clear",
    "version",
    "open",
    "add",
    "list",
    "remove",
    "settings",
    "config",
    "__proto__",
    "prototype",
    "constructor"
  ];

  let history = [];
  let shortcuts = Object.create(null);
  let shortcutMode = false;

  // Histórico do terminal.
  function saveHistory() {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history.slice(-MAX_HISTORY))
      );
    } catch (error) {
      console.warn("Navpoint: erro ao salvar histórico.", error);
    }
  }

  function renderMessage(message, className = "") {
    const line = document.createElement("p");
    line.textContent = message;

    if (className) {
      line.className = className;
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return;

      history = parsed
        .filter(
          item =>
            item &&
            typeof item.message === "string" &&
            typeof item.className === "string"
        )
        .slice(-MAX_HISTORY);

      history.forEach(item => {
        renderMessage(item.message, item.className);
      });
    } catch (error) {
      history = [];
      console.warn("Navpoint: erro ao carregar histórico.", error);
    }
  }

  function printMessage(message, className = "") {
    renderMessage(message, className);

    history.push({
      message: String(message),
      className: String(className)
    });

    if (history.length > MAX_HISTORY) {
      history = history.slice(-MAX_HISTORY);
    }

    saveHistory();
  }

  loadHistory();

  // Atalhos personalizados.
  function isStoredUrlValid(value) {
    try {
      const parsed = new URL(value);

      return (
        ["http:", "https:"].includes(parsed.protocol) &&
        !parsed.username &&
        !parsed.password
      );
    } catch {
      return false;
    }
  }

  // Sempre relê o armazenamento para evitar dados
  // desatualizados entre abas ou aberturas do terminal.
  function loadShortcuts() {
    const safeShortcuts = Object.create(null);

    try {
      const saved = localStorage.getItem(SHORTCUTS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          Object.keys(parsed).forEach(key => {
            if (
              /^[a-zA-Z0-9_-]+$/.test(key) &&
              !RESERVED_NAMES.includes(key.toLowerCase()) &&
              typeof parsed[key] === "string" &&
              isStoredUrlValid(parsed[key])
            ) {
              safeShortcuts[key] = parsed[key];
            }
          });
        }
      }
    } catch (error) {
      console.warn("Navpoint: erro ao carregar atalhos.", error);
    }

    shortcuts = safeShortcuts;
  }

  function saveShortcuts() {
    try {
      localStorage.setItem(
        SHORTCUTS_KEY,
        JSON.stringify(shortcuts)
      );

      return true;
    } catch (error) {
      console.warn("Navpoint: erro ao salvar atalhos.", error);
      return false;
    }
  }

  function getSortedShortcutNames() {
    return Object.keys(shortcuts).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }

  loadShortcuts();

  // Fechar ou minimizar.
  function closeTerminal() {
    window.parent.postMessage("NAVPOINT_CLOSE", "*");
  }

  closeButton.addEventListener("click", closeTerminal);
  minimizeButton.addEventListener("click", closeTerminal);

  // Validar endereços.
  function prepareAddress(value) {
    let address = value.trim();

    if (!address) {
      throw new Error("Digite um endereço para abrir.");
    }

    if (/\s/.test(address)) {
      throw new Error("O endereço não pode conter espaços.");
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(address)) {
      if (!/^https?:\/\//i.test(address)) {
        throw new Error("Somente HTTP e HTTPS são permitidos.");
      }
    }

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

  // Abrir endereço.
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
  window.addEventListener("message", event => {
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

  // Abrir o formulário de cadastro.
  function openShortcutForm() {
    shortcutMode = true;

    output.hidden = true;
    form.hidden = true;
    shortcutPanel.hidden = false;

    shortcutName.value = "";
    shortcutUrl.value = "";
    shortcutFeedback.textContent = "";
    shortcutFeedback.className = "shortcut-feedback";

    shortcutName.focus();
  }

  // Voltar ao terminal normal.
  function closeShortcutForm() {
    shortcutMode = false;

    shortcutPanel.hidden = true;
    output.hidden = false;
    form.hidden = false;

    input.focus();
  }

  cancelShortcut.addEventListener("click", closeShortcutForm);

  // Confirmar cadastro sem sair do formulário.
  shortcutForm.addEventListener("submit", event => {
    event.preventDefault();

    // Garante que a verificação de duplicados use dados atuais.
    loadShortcuts();

    const name = shortcutName.value.trim();
    const address = shortcutUrl.value.trim();

    if (!name || !address) {
      shortcutFeedback.textContent = "Preencha os dois campos.";
      shortcutFeedback.className = "shortcut-feedback error";
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      shortcutFeedback.textContent =
        "Use apenas letras, números, hífen ou sublinhado no nome.";
      shortcutFeedback.className = "shortcut-feedback error";
      shortcutName.focus();
      return;
    }

    const alias = name.toLowerCase();

    if (RESERVED_NAMES.includes(alias)) {
      shortcutFeedback.textContent =
        "Esse nome é reservado para um comando do Navpoint.";
      shortcutFeedback.className = "shortcut-feedback error";
      shortcutName.focus();
      return;
    }

    if (
      Object.keys(shortcuts).some(
        existing => existing.toLowerCase() === alias
      )
    ) {
      shortcutFeedback.textContent =
        "Já existe um atalho com esse nome.";
      shortcutFeedback.className = "shortcut-feedback error";
      shortcutName.focus();
      return;
    }

    let url;

    try {
      url = prepareAddress(address);
    } catch (error) {
      shortcutFeedback.textContent = error.message;
      shortcutFeedback.className = "shortcut-feedback error";
      shortcutUrl.focus();
      return;
    }

    shortcuts[name] = url;

    if (!saveShortcuts()) {
      delete shortcuts[name];

      shortcutFeedback.textContent =
        "Não foi possível salvar. Tente novamente.";
      shortcutFeedback.className = "shortcut-feedback error";
      return;
    }

    shortcutFeedback.textContent =
      "Atalho " + name + " criado com sucesso! Você pode cadastrar outro.";
    shortcutFeedback.className = "shortcut-feedback";

    shortcutName.value = "";
    shortcutUrl.value = "";
    shortcutName.focus();
  });

  // Listar atalhos cadastrados.
  function listShortcuts() {
    const names = getSortedShortcutNames();

    if (names.length === 0) {
      printMessage("Você ainda não possui atalhos cadastrados.");
      printMessage("Digite add para criar seu primeiro atalho.");
      return;
    }

    printMessage("ATALHOS CADASTRADOS:");

    names.forEach(name => {
      printMessage(name + " — " + shortcuts[name], "success");
    });

    printMessage("Total: " + names.length + " atalho(s).");
  }

  // Remover um atalho.
  function removeShortcut(name) {
    if (!name || /\s/.test(name)) {
      printMessage("Uso correto: remove NOME");
      printMessage("Digite list para consultar seus atalhos.");
      return;
    }

    const shortcutKey = Object.keys(shortcuts).find(
      key => key.toLowerCase() === name.toLowerCase()
    );

    if (!shortcutKey) {
      printMessage(
        'O atalho "' + name + '" não foi encontrado.',
        "error"
      );
      printMessage("Digite list para consultar os atalhos disponíveis.");
      return;
    }

    const removedUrl = shortcuts[shortcutKey];
    delete shortcuts[shortcutKey];

    if (!saveShortcuts()) {
      shortcuts[shortcutKey] = removedUrl;

      printMessage(
        "Não foi possível remover o atalho. Tente novamente.",
        "error"
      );
      return;
    }

    printMessage(
      'Atalho "' + shortcutKey + '" removido com sucesso.',
      "success"
    );
  }

  // Interpretar comandos.
  function executeCommand(rawCommand) {
    const command = rawCommand.trim();

    if (!command) return;

    printMessage("> " + command);

    // Relê os atalhos para refletir alterações feitas em outra aba.
    loadShortcuts();

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
        printMessage("clear — limpa o terminal e o histórico.");
        printMessage("version — mostra a versão.");
        printMessage("open endereço — abre um site.");
        printMessage("add — cadastrar um atalho.");
        printMessage("list — listar todos os atalhos.");
        printMessage("remove NOME — remover um atalho.");
        printMessage("settings — abrir configurações (em desenvolvimento).");
        break;

      case "clear":
        history = [];
        output.replaceChildren();
        saveHistory();
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
        openShortcutForm();
        break;

      case "list":
        listShortcuts();
        break;

      case "remove":
        removeShortcut(argument);
        break;

      case "settings":
      case "config":
        printMessage("Este comando será implementado em uma próxima etapa.");
        break;

      default: {
        // Atalhos personalizados têm prioridade.
        const shortcutKey = Object.keys(shortcuts).find(
          key => key.toLowerCase() === action
        );

        if (shortcutKey) {
          openAddress(shortcuts[shortcutKey]);
        } else {
          openAddress(command);
        }
      }
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const command = input.value;
    input.value = "";

    executeCommand(command);

    if (!shortcutMode) {
      input.focus();
    }
  });

  // Redimensionar com toque ou mouse.
  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  resizeHandle.addEventListener("pointerdown", event => {
    event.preventDefault();

    resizing = true;

    startX = event.clientX;
    startY = event.clientY;
    startWidth = window.innerWidth;
    startHeight = window.innerHeight;

    resizeHandle.setPointerCapture(event.pointerId);
  });

  resizeHandle.addEventListener("pointermove", event => {
    if (!resizing) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    window.parent.postMessage(
      {
        type: "NAVPOINT_RESIZE",
        width: startWidth + deltaX,
        height: startHeight + deltaY
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

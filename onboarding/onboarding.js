(() => {
  "use strict";

  const LANGUAGE_KEY = "navpoint_language";
  const LEVEL_KEY = "navpoint_setup_level";
  const DONE_KEY = "navpoint_onboarding_done";

  // Mesma chave usada pelo terminal.
  const SHORTCUTS_KEY = "navpoint_shortcuts";

  // Mesmos nomes reservados do terminal.
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

  const LANGUAGES = [
    { code: "pt", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" }
  ];

  const LEVELS = ["basic", "medium", "complete"];

  // Ordem das telas do tutorial.
  const TUTORIAL_VIEWS = ["intro", "commands", "shortcuts"];

  const TEXTS = {
    pt: {
      languageTitle: "Escolha seu idioma",
      languageSubtitle: "Esse idioma será usado na extensão e no terminal.",
      selected: "Idioma selecionado",
      confirm: "Confirmar",
      finish: "Concluir",
      saving: "Salvando...",
      error: "Não foi possível salvar o idioma. Tente novamente.",
      back: "Voltar",
      next: "Próximo",
      skip: "Pular Tutorial",
      intro: {
        title: "Antes de começar",
        paragraphs: [
          "Oi! Eu sou o criador do Navpoint e queria te contar rapidinho por que ele existe.",
          "O Navpoint é um projeto pessoal. Eu sempre fui fascinado pelo universo de Matrix e pela estética dos terminais clássicos: tela escura, letras verdes, aquela sensação de estar com o controle na mão.",
          "Quis trazer isso para o dia a dia do navegador, de um jeito prático e fluido. Em vez de procurar abas e digitar endereços longos, você escreve o que quer e o Navpoint leva você até lá.",
          "Espero que ele deixe a sua navegação mais rápida e um pouco mais divertida."
        ]
      },
      commands: {
        title: "Como usar",
        text: "É bem simples. Abra o terminal, escreva o comando e envie:",
        rows: [
          ["open youtube.com", "Abre o site na hora. Dá até para escrever só open youtube."],
          ["add", "Cria um atalho para um site que você visita sempre."],
          ["list", "Mostra os atalhos que você já criou."],
          ["remove NOME", "Apaga um atalho que você não usa mais."]
        ],
        note:
          "Se esquecer algum comando, é só digitar help. E fica tranquilo: o Navpoint só abre sites, nada além disso."
      },
      shortcuts: {
        title: "Seus atalhos",
        paragraphs: [
          "Atalho é um apelido para um site. Você digita add, escolhe um nome e o endereço, e pronto.",
          "Depois é só escrever o nome no terminal e o site abre. Um nome curto no lugar de um endereço inteiro."
        ],
        example: [
          "> add",
          "nome: yt",
          "endereço: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Pode escolher o nome que quiser, só não vale repetir nem usar o nome de um comando (como open ou help). Maiúscula ou minúscula não faz diferença."
      },
      levels: {
        title: "Como você quer configurar?",
        subtitle:
          "Escolha o quanto quer personalizar agora. Depois você poderá mudar tudo nas configurações.",
        error: "Não foi possível salvar sua escolha. Tente novamente.",
        options: {
          basic: {
            name: "Básico",
            desc: "Só o essencial, para você começar a usar rapidinho."
          },
          medium: {
            name: "Médio",
            desc: "O essencial, mais algumas preferências e atalhos comuns."
          },
          complete: {
            name: "Completo",
            desc: "Todas as opções de personalização do terminal e do visual."
          }
        }
      },
      setupShortcuts: {
        title: "Seus primeiros atalhos",
        text: "Quer já deixar alguns sites favoritos prontos? Crie seus primeiros atalhos aqui. Se preferir, toque em Continuar e crie depois com o comando add.",
        nameLabel: "Nome do atalho",
        namePlaceholder: "ex.: yt",
        addressLabel: "Endereço",
        addressPlaceholder: "ex.: youtube.com",
        listTitle: "Atalhos que você já criou",
        empty: "Nenhum atalho ainda.",
        created: "Atalho {name} criado! Você pode cadastrar outro.",
        unsaved:
          "Você preencheu um atalho, mas ainda não confirmou. Toque em Confirmar para salvar ou em Continuar de novo para ignorar.",
        continue: "Continuar",
        errors: {
          empty: "Preencha os dois campos.",
          name: "Use apenas letras, números, hífen ou sublinhado no nome.",
          reserved: "Esse nome é reservado para um comando do Navpoint.",
          duplicate: "Já existe um atalho com esse nome.",
          spaces: "O endereço não pode conter espaços.",
          protocol: "Somente HTTP e HTTPS são permitidos.",
          invalid: "Não foi possível reconhecer esse endereço.",
          save: "Não foi possível salvar. Tente novamente."
        }
      },
      done: {
        title: "Tudo pronto!",
        paragraphs: [
          "Pronto, o Navpoint já está configurado.",
          "Para usar, é só tocar no botão ⌘ que aparece no canto da página e escrever seus comandos. Qualquer dúvida, digite help.",
          "Espero que você curta. Bom proveito!"
        ],
        closeTip: "Você já pode fechar esta aba.",
        error: "Não foi possível finalizar. Tente novamente."
      }
    },

    en: {
      languageTitle: "Choose your language",
      languageSubtitle:
        "This language will be used in the extension and the terminal.",
      selected: "Selected language",
      confirm: "Confirm",
      finish: "Finish",
      saving: "Saving...",
      error: "Could not save the language. Please try again.",
      back: "Back",
      next: "Next",
      skip: "Skip Tutorial",
      intro: {
        title: "Before we start",
        paragraphs: [
          "Hi! I'm the creator of Navpoint, and I wanted to tell you quickly why it exists.",
          "Navpoint is a personal project. I've always been fascinated by the Matrix universe and the look of classic terminals: dark screen, green letters, that feeling of having full control in your hands.",
          "I wanted to bring that into everyday browsing, in a practical and fluid way. Instead of hunting for tabs and typing long addresses, you write what you want and Navpoint takes you there.",
          "I hope it makes your browsing faster and a little more fun."
        ]
      },
      commands: {
        title: "How to use it",
        text: "It's really simple. Open the terminal, type the command and send it:",
        rows: [
          ["open youtube.com", "Opens the site right away. You can even type just open youtube."],
          ["add", "Creates a shortcut for a site you visit all the time."],
          ["list", "Shows the shortcuts you have already created."],
          ["remove NAME", "Deletes a shortcut you no longer use."]
        ],
        note:
          "If you forget a command, just type help. And don't worry: Navpoint only opens websites, nothing more."
      },
      shortcuts: {
        title: "Your shortcuts",
        paragraphs: [
          "A shortcut is a nickname for a website. You type add, pick a name and the address, and that's it.",
          "After that, just type the name in the terminal and the site opens. A short name instead of a whole address."
        ],
        example: [
          "> add",
          "name: yt",
          "address: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Pick any name you like, just don't repeat one or use a command name (like open or help). Uppercase or lowercase makes no difference."
      },
      levels: {
        title: "How do you want to set it up?",
        subtitle:
          "Choose how much you want to customize now. You'll be able to change everything later in the settings.",
        error: "Could not save your choice. Please try again.",
        options: {
          basic: {
            name: "Basic",
            desc: "Just the essentials, so you can start using it right away."
          },
          medium: {
            name: "Medium",
            desc: "The essentials plus a few preferences and common shortcuts."
          },
          complete: {
            name: "Complete",
            desc: "Every customization option for the terminal and the look."
          }
        }
      },
      setupShortcuts: {
        title: "Your first shortcuts",
        text: "Want to get a few favorite sites ready right away? Create your first shortcuts here. If you prefer, tap Continue and create them later with the add command.",
        nameLabel: "Shortcut name",
        namePlaceholder: "e.g.: yt",
        addressLabel: "Address",
        addressPlaceholder: "e.g.: youtube.com",
        listTitle: "Shortcuts you have already created",
        empty: "No shortcuts yet.",
        created: "Shortcut {name} created! You can add another.",
        unsaved:
          "You filled in a shortcut but haven't confirmed it yet. Tap Confirm to save it, or Continue again to ignore it.",
        continue: "Continue",
        errors: {
          empty: "Fill in both fields.",
          name: "Use only letters, numbers, hyphen or underscore in the name.",
          reserved: "This name is reserved for a Navpoint command.",
          duplicate: "A shortcut with this name already exists.",
          spaces: "The address cannot contain spaces.",
          protocol: "Only HTTP and HTTPS are allowed.",
          invalid: "Could not recognize this address.",
          save: "Could not save. Please try again."
        }
      },
      done: {
        title: "All set!",
        paragraphs: [
          "All set, Navpoint is ready.",
          "To use it, just tap the ⌘ button in the corner of the page and type your commands. If in doubt, type help.",
          "I hope you enjoy it. Have fun!"
        ],
        closeTip: "You can close this tab now.",
        error: "Could not finish. Please try again."
      }
    },

    es: {
      languageTitle: "Elige tu idioma",
      languageSubtitle:
        "Este idioma se usará en la extensión y en el terminal.",
      selected: "Idioma seleccionado",
      confirm: "Confirmar",
      finish: "Finalizar",
      saving: "Guardando...",
      error: "No se pudo guardar el idioma. Inténtalo de nuevo.",
      back: "Atrás",
      next: "Siguiente",
      skip: "Omitir tutorial",
      intro: {
        title: "Antes de empezar",
        paragraphs: [
          "¡Hola! Soy el creador de Navpoint y quería contarte rápido por qué existe.",
          "Navpoint es un proyecto personal. Siempre me fascinó el universo de Matrix y la estética de los terminales clásicos: pantalla oscura, letras verdes, esa sensación de tener el control en las manos.",
          "Quise llevar eso al día a día del navegador, de una forma práctica y fluida. En vez de buscar pestañas y escribir direcciones largas, escribes lo que quieres y Navpoint te lleva hasta allí.",
          "Espero que haga tu navegación más rápida y un poco más divertida."
        ]
      },
      commands: {
        title: "Cómo usarlo",
        text: "Es muy simple. Abre el terminal, escribe el comando y envíalo:",
        rows: [
          ["open youtube.com", "Abre el sitio al instante. Incluso puedes escribir solo open youtube."],
          ["add", "Crea un atajo para un sitio que visitas siempre."],
          ["list", "Muestra los atajos que ya creaste."],
          ["remove NOMBRE", "Elimina un atajo que ya no usas."]
        ],
        note:
          "Si olvidas algún comando, escribe help. Y tranquilo: Navpoint solo abre sitios web, nada más."
      },
      shortcuts: {
        title: "Tus atajos",
        paragraphs: [
          "Un atajo es un apodo para un sitio web. Escribes add, eliges un nombre y la dirección, y listo.",
          "Después solo escribe el nombre en el terminal y el sitio se abre. Un nombre corto en lugar de una dirección completa."
        ],
        example: [
          "> add",
          "nombre: yt",
          "dirección: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Puedes elegir el nombre que quieras, solo no repitas uno ni uses el nombre de un comando (como open o help). Mayúsculas o minúsculas no importan."
      },
      levels: {
        title: "¿Cómo quieres configurarlo?",
        subtitle:
          "Elige cuánto quieres personalizar ahora. Después podrás cambiar todo en la configuración.",
        error: "No se pudo guardar tu elección. Inténtalo de nuevo.",
        options: {
          basic: {
            name: "Básico",
            desc: "Solo lo esencial, para que empieces a usarlo ya."
          },
          medium: {
            name: "Medio",
            desc: "Lo esencial, más algunas preferencias y atajos comunes."
          },
          complete: {
            name: "Completo",
            desc: "Todas las opciones de personalización del terminal y del aspecto."
          }
        }
      },
      setupShortcuts: {
        title: "Tus primeros atajos",
        text: "¿Quieres dejar listos algunos sitios favoritos? Crea aquí tus primeros atajos. Si prefieres, toca Continuar y créalos después con el comando add.",
        nameLabel: "Nombre del atajo",
        namePlaceholder: "ej.: yt",
        addressLabel: "Dirección",
        addressPlaceholder: "ej.: youtube.com",
        listTitle: "Atajos que ya creaste",
        empty: "Aún no hay atajos.",
        created: "¡Atajo {name} creado! Puedes crear otro.",
        unsaved:
          "Completaste un atajo, pero aún no lo confirmaste. Toca Confirmar para guardarlo o Continuar de nuevo para ignorarlo.",
        continue: "Continuar",
        errors: {
          empty: "Completa los dos campos.",
          name: "Usa solo letras, números, guion o guion bajo en el nombre.",
          reserved: "Este nombre está reservado para un comando de Navpoint.",
          duplicate: "Ya existe un atajo con ese nombre.",
          spaces: "La dirección no puede contener espacios.",
          protocol: "Solo se permiten HTTP y HTTPS.",
          invalid: "No se pudo reconocer esa dirección.",
          save: "No se pudo guardar. Inténtalo de nuevo."
        }
      },
      done: {
        title: "¡Todo listo!",
        paragraphs: [
          "Todo listo, Navpoint ya está configurado.",
          "Para usarlo, solo toca el botón ⌘ que aparece en la esquina de la página y escribe tus comandos. Ante cualquier duda, escribe help.",
          "Espero que lo disfrutes. ¡A disfrutar!"
        ],
        closeTip: "Ya puedes cerrar esta pestaña.",
        error: "No se pudo finalizar. Inténtalo de nuevo."
      }
    }
  };

  const stepLabel = document.getElementById("step-label");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const languageArea = document.getElementById("language-area");
  const selectedCaption = document.getElementById("selected-caption");
  const selectedName = document.getElementById("selected-name");
  const optionsBox = document.getElementById("language-options");
  const contentArea = document.getElementById("content-area");
  const status = document.getElementById("status");
  const backButton = document.getElementById("back-button");
  const confirmButton = document.getElementById("confirm-button");
  const nextButton = document.getElementById("next-button");
  const skipButton = document.getElementById("skip-button");

  if (
    !stepLabel ||
    !title ||
    !subtitle ||
    !languageArea ||
    !selectedCaption ||
    !selectedName ||
    !optionsBox ||
    !contentArea ||
    !status ||
    !backButton ||
    !confirmButton ||
    !nextButton ||
    !skipButton
  ) {
    return;
  }

  // Mostra a tela. Se veio da chuva de código, a chuva
  // cobre tudo primeiro e some revelando a tela.
  function showScreen() {
    document.documentElement.classList.remove("entering");
  }

  const params = new URLSearchParams(window.location.search);
  const cameFromRain = params.get("transition") === "rain";

  if (cameFromRain) {
    // Limpa o endereço para a animação não repetir ao recarregar.
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (cameFromRain && window.NavpointRain) {
    window.NavpointRain.play({
      mode: "reveal",
      duration: 2600,
      onReveal: showScreen
    });
  } else {
    showScreen();
  }

  function detectLanguage() {
    const code = (navigator.language || "").slice(0, 2).toLowerCase();
    return TEXTS[code] ? code : "en";
  }

  let selected = detectLanguage();
  let selectedLevel = "basic";
  let view = "language";

  const optionButtons = new Map();
  let levelButtons = new Map();

  // Elementos da tela de atalhos.
  let shortcutForm = null;
  let shortcutNameInput = null;
  let shortcutUrlInput = null;
  let shortcutFeedback = null;
  let shortcutListBox = null;
  let unsavedWarned = false;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? "status error" : "status";
  }

  // Atalhos (mesmo formato e mesma chave do terminal).
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

    return safeShortcuts;
  }

  function saveShortcuts(shortcuts) {
    try {
      localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
      return true;
    } catch (error) {
      console.warn("Navpoint: erro ao salvar atalhos.", error);
      return false;
    }
  }

  // Mesmas regras de endereço do terminal.
  // Os erros são códigos, traduzidos depois.
  function prepareAddress(value) {
    let address = value.trim();

    if (/\s/.test(address)) {
      throw new Error("spaces");
    }

    if (
      /^[a-z][a-z0-9+.-]*:/i.test(address) &&
      !/^https?:\/\//i.test(address)
    ) {
      throw new Error("protocol");
    }

    if (!address.includes(".") && !/^https?:\/\//i.test(address)) {
      if (!/^[a-z0-9-]+$/i.test(address)) {
        throw new Error("invalid");
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
      throw new Error("invalid");
    }

    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.username ||
      parsed.password
    ) {
      throw new Error("invalid");
    }

    return parsed.href;
  }

  // Funções para montar o conteúdo das telas.
  function makeParagraph(text) {
    const paragraph = document.createElement("p");

    paragraph.className = "body-text";
    paragraph.textContent = text;

    return paragraph;
  }

  function makeExample(lines) {
    const block = document.createElement("pre");

    block.className = "example";
    block.textContent = lines.join("\n");

    return block;
  }

  function makeCommandList(rows) {
    const list = document.createElement("ul");

    list.className = "command-list";

    rows.forEach(([name, description]) => {
      const item = document.createElement("li");
      const nameElement = document.createElement("span");
      const descElement = document.createElement("span");

      item.className = "command-row";
      nameElement.className = "command-name";
      descElement.className = "command-desc";

      nameElement.textContent = name;
      descElement.textContent = description;

      item.append(nameElement, descElement);
      list.appendChild(item);
    });

    return list;
  }

  function updateLevelButtons() {
    levelButtons.forEach((button, code) => {
      button.setAttribute("aria-checked", String(code === selectedLevel));
    });
  }

  function makeLevelList(texts) {
    const list = document.createElement("div");

    list.className = "level-list";
    list.setAttribute("role", "radiogroup");
    list.setAttribute("aria-label", texts.levels.title);

    levelButtons = new Map();

    LEVELS.forEach(code => {
      const option = texts.levels.options[code];

      const button = document.createElement("button");
      const nameElement = document.createElement("span");
      const descElement = document.createElement("span");

      button.type = "button";
      button.className = "level-option";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");

      nameElement.className = "level-name";
      descElement.className = "level-desc";

      nameElement.textContent = option.name;
      descElement.textContent = option.desc;

      button.append(nameElement, descElement);

      button.addEventListener("click", () => {
        selectedLevel = code;
        setStatus("");
        updateLevelButtons();
      });

      list.appendChild(button);
      levelButtons.set(code, button);
    });

    updateLevelButtons();

    return list;
  }

  // Tela de atalhos.
  function showFeedback(message, isError = false) {
    if (!shortcutFeedback) return;

    shortcutFeedback.textContent = message;
    shortcutFeedback.className = isError ? "feedback error" : "feedback";
  }

  function renderShortcutList() {
    if (!shortcutListBox) return;

    const t = TEXTS[selected].setupShortcuts;
    const shortcuts = loadShortcuts();

    const names = Object.keys(shortcuts).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    const heading = document.createElement("h2");

    heading.className = "created-title";
    heading.textContent = t.listTitle;

    shortcutListBox.replaceChildren(heading);

    if (names.length === 0) {
      const empty = document.createElement("p");

      empty.className = "empty";
      empty.textContent = t.empty;

      shortcutListBox.appendChild(empty);
      return;
    }

    const list = document.createElement("ul");

    list.className = "created-list";

    names.forEach(name => {
      const item = document.createElement("li");
      const nameElement = document.createElement("span");
      const urlElement = document.createElement("span");

      item.className = "created-item";
      nameElement.className = "created-name";
      urlElement.className = "created-url";

      nameElement.textContent = name;
      urlElement.textContent = shortcuts[name];

      item.append(nameElement, urlElement);
      list.appendChild(item);
    });

    shortcutListBox.appendChild(list);
  }

  function handleShortcutSubmit(event) {
    event.preventDefault();

    if (!shortcutNameInput || !shortcutUrlInput) return;

    const t = TEXTS[selected].setupShortcuts;

    // Lê de novo para refletir atalhos criados em outro lugar.
    const shortcuts = loadShortcuts();

    const name = shortcutNameInput.value.trim();
    const address = shortcutUrlInput.value.trim();

    if (!name || !address) {
      showFeedback(t.errors.empty, true);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      showFeedback(t.errors.name, true);
      shortcutNameInput.focus();
      return;
    }

    const alias = name.toLowerCase();

    if (RESERVED_NAMES.includes(alias)) {
      showFeedback(t.errors.reserved, true);
      shortcutNameInput.focus();
      return;
    }

    if (
      Object.keys(shortcuts).some(
        existing => existing.toLowerCase() === alias
      )
    ) {
      showFeedback(t.errors.duplicate, true);
      shortcutNameInput.focus();
      return;
    }

    let url;

    try {
      url = prepareAddress(address);
    } catch (error) {
      const message =
        error.message === "spaces" || error.message === "protocol"
          ? t.errors[error.message]
          : t.errors.invalid;

      showFeedback(message, true);
      shortcutUrlInput.focus();
      return;
    }

    shortcuts[name] = url;

    if (!saveShortcuts(shortcuts)) {
      showFeedback(t.errors.save, true);
      return;
    }

    unsavedWarned = false;

    showFeedback(t.created.replace("{name}", name));

    shortcutNameInput.value = "";
    shortcutUrlInput.value = "";
    shortcutNameInput.focus();

    renderShortcutList();
  }

  function makeField(id, labelText, placeholder, inputMode) {
    const wrapper = document.createDocumentFragment();

    const label = document.createElement("label");
    const input = document.createElement("input");

    label.className = "field-label";
    label.htmlFor = id;
    label.textContent = labelText;

    input.className = "field-input";
    input.id = id;
    input.type = "text";
    input.placeholder = placeholder;
    input.autocomplete = "off";
    input.autocapitalize = "none";
    input.spellcheck = false;

    if (inputMode) {
      input.inputMode = inputMode;
    }

    input.addEventListener("input", () => {
      unsavedWarned = false;
    });

    wrapper.append(label, input);

    return { wrapper, input };
  }

  function makeShortcutForm(texts) {
    const t = texts.setupShortcuts;

    unsavedWarned = false;

    shortcutForm = document.createElement("form");
    shortcutForm.className = "shortcut-form";
    shortcutForm.noValidate = true;
    shortcutForm.autocomplete = "off";

    const nameField = makeField(
      "shortcut-name",
      t.nameLabel,
      t.namePlaceholder
    );

    const urlField = makeField(
      "shortcut-url",
      t.addressLabel,
      t.addressPlaceholder,
      "url"
    );

    shortcutNameInput = nameField.input;
    shortcutUrlInput = urlField.input;

    shortcutFeedback = document.createElement("p");
    shortcutFeedback.className = "feedback";
    shortcutFeedback.setAttribute("aria-live", "polite");

    shortcutForm.append(
      nameField.wrapper,
      urlField.wrapper,
      shortcutFeedback
    );

    // Enter envia o formulário.
    [shortcutNameInput, shortcutUrlInput].forEach(input => {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          shortcutForm.requestSubmit();
        }
      });
    });

    shortcutForm.addEventListener("submit", handleShortcutSubmit);

    return shortcutForm;
  }

  function makeCreatedBox() {
    shortcutListBox = document.createElement("section");
    shortcutListBox.className = "created-box";

    renderShortcutList();

    return shortcutListBox;
  }

  function renderContent(texts) {
    contentArea.replaceChildren();

    shortcutForm = null;
    shortcutNameInput = null;
    shortcutUrlInput = null;
    shortcutFeedback = null;
    shortcutListBox = null;

    if (view === "intro") {
      texts.intro.paragraphs.forEach(text => {
        contentArea.appendChild(makeParagraph(text));
      });
    }

    if (view === "commands") {
      contentArea.appendChild(makeParagraph(texts.commands.text));
      contentArea.appendChild(makeCommandList(texts.commands.rows));
      contentArea.appendChild(makeParagraph(texts.commands.note));
    }

    if (view === "shortcuts") {
      texts.shortcuts.paragraphs.forEach(text => {
        contentArea.appendChild(makeParagraph(text));
      });

      contentArea.appendChild(makeExample(texts.shortcuts.example));
      contentArea.appendChild(makeParagraph(texts.shortcuts.note));
    }

    if (view === "levels") {
      contentArea.appendChild(makeLevelList(texts));
    }

    if (view === "setupShortcuts") {
      contentArea.appendChild(makeParagraph(texts.setupShortcuts.text));
      contentArea.appendChild(makeShortcutForm(texts));
      contentArea.appendChild(makeCreatedBox());
    }

    if (view === "done") {
      texts.done.paragraphs.forEach(text => {
        contentArea.appendChild(makeParagraph(text));
      });
    }
  }

  function render() {
    const texts = TEXTS[selected];
    const isLanguage = view === "language";
    const tutorialIndex = TUTORIAL_VIEWS.indexOf(view);
    const isTutorial = tutorialIndex !== -1;
    const isLevels = view === "levels";
    const isSetupShortcuts = view === "setupShortcuts";

    document.documentElement.lang = selected;

    // Rótulo da etapa.
    if (isLanguage) {
      stepLabel.textContent = "1/4";
    } else if (isTutorial) {
      stepLabel.textContent = "2/4";
    } else if (isLevels) {
      stepLabel.textContent = "3/4";
    } else {
      stepLabel.textContent = "4/4";
    }

    // Título e subtítulo.
    if (isLanguage) {
      title.textContent = texts.languageTitle;
      subtitle.textContent = texts.languageSubtitle;
    } else {
      title.textContent = texts[view].title;

      if (isTutorial) {
        subtitle.textContent =
          (tutorialIndex + 1) + " / " + TUTORIAL_VIEWS.length;
      } else if (isLevels) {
        subtitle.textContent = texts.levels.subtitle;
      } else {
        subtitle.textContent = "";
      }
    }

    // Áreas visíveis.
    languageArea.hidden = !isLanguage;
    contentArea.hidden = isLanguage;

    // Idioma.
    selectedCaption.textContent = texts.selected;
    selectedName.textContent = LANGUAGES.find(
      item => item.code === selected
    ).name;

    optionButtons.forEach((button, code) => {
      button.setAttribute("aria-checked", String(code === selected));
    });

    // Botões do rodapé.
    confirmButton.textContent = view === "done" ? texts.finish : texts.confirm;
    backButton.textContent = texts.back;
    nextButton.textContent = isSetupShortcuts
      ? texts.setupShortcuts.continue
      : texts.next;
    skipButton.textContent = texts.skip;

    confirmButton.hidden = isTutorial;
    backButton.hidden = isLanguage;
    nextButton.hidden = !(isTutorial || isSetupShortcuts);
    skipButton.hidden = !isTutorial;

    if (!isLanguage) {
      renderContent(texts);
    }
  }

  function goTo(nextView) {
    view = nextView;
    setStatus("");
    render();
    window.scrollTo(0, 0);
  }

  // Seleção de idioma.
  function selectLanguage(code) {
    if (!TEXTS[code]) return;

    selected = code;
    setStatus("");
    render();
  }

  LANGUAGES.forEach(language => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "option";
    button.textContent = language.name;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");

    button.addEventListener("click", () => {
      selectLanguage(language.code);
    });

    optionsBox.appendChild(button);
    optionButtons.set(language.code, button);
  });

  // Fim do onboarding: volta para a página anterior.
  function closeOnboarding() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    setStatus(TEXTS[selected].done.closeTip);
  }

  // Confirmar: salva o idioma ou o nível, o atalho, ou conclui.
  confirmButton.addEventListener("click", async () => {
    const texts = TEXTS[selected];

    if (view === "setupShortcuts") {
      if (shortcutForm) {
        shortcutForm.requestSubmit();
      }

      return;
    }

    if (view === "done") {
      closeOnboarding();
      return;
    }

    confirmButton.disabled = true;
    setStatus(texts.saving);

    try {
      if (view === "language") {
        await chrome.storage.local.set({ [LANGUAGE_KEY]: selected });
        goTo("intro");
      } else if (view === "levels") {
        await chrome.storage.local.set({ [LEVEL_KEY]: selectedLevel });
        goTo("setupShortcuts");
      }
    } catch (error) {
      console.warn("Navpoint: erro ao salvar.", error);

      setStatus(
        view === "levels" ? texts.levels.error : texts.error,
        true
      );
    } finally {
      confirmButton.disabled = false;
    }
  });

  // Próximo (tutorial) e Continuar (atalhos).
  nextButton.addEventListener("click", async () => {
    const texts = TEXTS[selected];

    if (view === "setupShortcuts") {
      const hasUnsaved =
        shortcutNameInput &&
        shortcutUrlInput &&
        (shortcutNameInput.value.trim() || shortcutUrlInput.value.trim());

      // Avisa uma vez antes de descartar um atalho não confirmado.
      if (hasUnsaved && !unsavedWarned) {
        unsavedWarned = true;
        showFeedback(texts.setupShortcuts.unsaved, true);
        return;
      }

      nextButton.disabled = true;
      setStatus(texts.saving);

      try {
        await chrome.storage.local.set({ [DONE_KEY]: true });
        goTo("done");
      } catch (error) {
        console.warn("Navpoint: erro ao concluir o onboarding.", error);
        setStatus(texts.done.error, true);
      } finally {
        nextButton.disabled = false;
      }

      return;
    }

    const index = TUTORIAL_VIEWS.indexOf(view);

    if (index === -1) return;

    if (index < TUTORIAL_VIEWS.length - 1) {
      goTo(TUTORIAL_VIEWS[index + 1]);
    } else {
      goTo("levels");
    }
  });

  backButton.addEventListener("click", () => {
    if (view === "done") {
      goTo("setupShortcuts");
      return;
    }

    if (view === "setupShortcuts") {
      goTo("levels");
      return;
    }

    if (view === "levels") {
      goTo(TUTORIAL_VIEWS[TUTORIAL_VIEWS.length - 1]);
      return;
    }

    const index = TUTORIAL_VIEWS.indexOf(view);

    if (index > 0) {
      goTo(TUTORIAL_VIEWS[index - 1]);
    } else if (index === 0) {
      goTo("language");
    }
  });

  skipButton.addEventListener("click", () => {
    goTo("levels");
  });

  // Carrega o idioma e o nível já salvos, se existirem.
  async function init() {
    try {
      const saved = await chrome.storage.local.get([
        LANGUAGE_KEY,
        LEVEL_KEY
      ]);

      if (TEXTS[saved[LANGUAGE_KEY]]) {
        selected = saved[LANGUAGE_KEY];
      }

      if (LEVELS.includes(saved[LEVEL_KEY])) {
        selectedLevel = saved[LEVEL_KEY];
      }
    } catch (error) {
      console.warn("Navpoint: erro ao ler as preferências salvas.", error);
    }

    render();
  }

  init();
})();

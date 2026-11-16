(() => {
  "use strict";

  const LANGUAGE_KEY = "navpoint_language";

  const LANGUAGES = [
    { code: "pt", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" }
  ];

  // Ordem das telas do tutorial.
  const TUTORIAL_VIEWS = ["intro", "commands", "shortcuts"];

  const TEXTS = {
    pt: {
      languageTitle: "Escolha seu idioma",
      languageSubtitle: "Esse idioma será usado na extensão e no terminal.",
      selected: "Idioma selecionado",
      confirm: "Confirmar",
      saving: "Salvando...",
      error: "Não foi possível salvar o idioma. Tente novamente.",
      back: "Voltar",
      next: "Próximo",
      skip: "Pular Tutorial",
      intro: {
        title: "O que é o Navpoint",
        paragraphs: [
          "O Navpoint é uma extensão para navegar mais rápido usando comandos, direto de um terminal flutuante que fica sobre qualquer página.",
          "O visual é inspirado no universo Matrix e nos terminais Linux: fundo escuro, letras verdes e nada além do necessário. Esse estilo existe para ser simples, rápido e confortável de ler, inclusive em telas pequenas.",
          "O Navpoint não é um terminal do sistema e não executa comandos arbitrários. Ele só abre endereços HTTP e HTTPS."
        ]
      },
      commands: {
        title: "Comandos básicos",
        text: "Digite os comandos no terminal e envie:",
        rows: [
          ["open endereço", "Abre um site. Exemplo: open youtube.com"],
          ["help", "Mostra os comandos disponíveis."],
          ["list", "Mostra os seus atalhos."],
          ["remove NOME", "Apaga um atalho pelo nome."],
          ["clear", "Limpa o terminal e o histórico."]
        ]
      },
      shortcuts: {
        title: "Atalhos",
        paragraphs: [
          "Atalhos são nomes curtos para os seus sites favoritos. Digite add, informe um nome e o endereço, e pronto.",
          "Depois de criado, basta digitar o nome do atalho para abrir o site."
        ],
        example: [
          "> add",
          "nome: yt",
          "endereço: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Atalhos têm prioridade sobre o reconhecimento automático de endereços. Não é possível repetir nomes nem usar nomes de comandos, como help ou open. Maiúsculas e minúsculas não fazem diferença."
      },
      levels: {
        title: "Níveis de configuração",
        text: "Esta etapa está em desenvolvimento. Aqui você vai escolher entre os níveis Básico, Médio e Completo."
      }
    },

    en: {
      languageTitle: "Choose your language",
      languageSubtitle:
        "This language will be used in the extension and the terminal.",
      selected: "Selected language",
      confirm: "Confirm",
      saving: "Saving...",
      error: "Could not save the language. Please try again.",
      back: "Back",
      next: "Next",
      skip: "Skip Tutorial",
      intro: {
        title: "What is Navpoint",
        paragraphs: [
          "Navpoint is an extension for browsing faster with commands, right from a floating terminal that sits on top of any page.",
          "Its look is inspired by the Matrix universe and Linux terminals: dark background, green letters and nothing more than necessary. This style exists to be simple, fast and comfortable to read, even on small screens.",
          "Navpoint is not a system terminal and does not run arbitrary commands. It only opens HTTP and HTTPS addresses."
        ]
      },
      commands: {
        title: "Basic commands",
        text: "Type the commands in the terminal and send:",
        rows: [
          ["open address", "Opens a website. Example: open youtube.com"],
          ["help", "Shows the available commands."],
          ["list", "Shows your shortcuts."],
          ["remove NAME", "Deletes a shortcut by name."],
          ["clear", "Clears the terminal and the history."]
        ]
      },
      shortcuts: {
        title: "Shortcuts",
        paragraphs: [
          "Shortcuts are short names for your favorite websites. Type add, enter a name and the address, and you are done.",
          "Once created, just type the shortcut name to open the website."
        ],
        example: [
          "> add",
          "name: yt",
          "address: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Shortcuts take priority over automatic address recognition. You cannot repeat names or use command names, such as help or open. Uppercase and lowercase make no difference."
      },
      levels: {
        title: "Setup levels",
        text: "This step is under development. Here you will choose between the Basic, Medium and Complete levels."
      }
    },

    es: {
      languageTitle: "Elige tu idioma",
      languageSubtitle:
        "Este idioma se usará en la extensión y en el terminal.",
      selected: "Idioma seleccionado",
      confirm: "Confirmar",
      saving: "Guardando...",
      error: "No se pudo guardar el idioma. Inténtalo de nuevo.",
      back: "Atrás",
      next: "Siguiente",
      skip: "Omitir tutorial",
      intro: {
        title: "Qué es Navpoint",
        paragraphs: [
          "Navpoint es una extensión para navegar más rápido usando comandos, desde un terminal flotante que aparece sobre cualquier página.",
          "Su aspecto está inspirado en el universo Matrix y en los terminales Linux: fondo oscuro, letras verdes y nada más de lo necesario. Este estilo existe para ser simple, rápido y cómodo de leer, incluso en pantallas pequeñas.",
          "Navpoint no es un terminal del sistema y no ejecuta comandos arbitrarios. Solo abre direcciones HTTP y HTTPS."
        ]
      },
      commands: {
        title: "Comandos básicos",
        text: "Escribe los comandos en el terminal y envíalos:",
        rows: [
          ["open dirección", "Abre un sitio. Ejemplo: open youtube.com"],
          ["help", "Muestra los comandos disponibles."],
          ["list", "Muestra tus atajos."],
          ["remove NOMBRE", "Elimina un atajo por su nombre."],
          ["clear", "Limpia el terminal y el historial."]
        ]
      },
      shortcuts: {
        title: "Atajos",
        paragraphs: [
          "Los atajos son nombres cortos para tus sitios favoritos. Escribe add, indica un nombre y la dirección, y listo.",
          "Una vez creado, solo escribe el nombre del atajo para abrir el sitio."
        ],
        example: [
          "> add",
          "nombre: yt",
          "dirección: youtube.com",
          "",
          "> yt"
        ],
        note:
          "Los atajos tienen prioridad sobre el reconocimiento automático de direcciones. No se pueden repetir nombres ni usar nombres de comandos, como help u open. Mayúsculas y minúsculas no importan."
      },
      levels: {
        title: "Niveles de configuración",
        text: "Este paso está en desarrollo. Aquí elegirás entre los niveles Básico, Medio y Completo."
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
  let view = "language";

  const optionButtons = new Map();

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? "status error" : "status";
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

  function renderContent(texts) {
    contentArea.replaceChildren();

    if (view === "intro") {
      texts.intro.paragraphs.forEach(text => {
        contentArea.appendChild(makeParagraph(text));
      });
    }

    if (view === "commands") {
      contentArea.appendChild(makeParagraph(texts.commands.text));
      contentArea.appendChild(makeCommandList(texts.commands.rows));
    }

    if (view === "shortcuts") {
      texts.shortcuts.paragraphs.forEach(text => {
        contentArea.appendChild(makeParagraph(text));
      });

      contentArea.appendChild(makeExample(texts.shortcuts.example));
      contentArea.appendChild(makeParagraph(texts.shortcuts.note));
    }

    if (view === "levels") {
      contentArea.appendChild(makeParagraph(texts.levels.text));
    }
  }

  function render() {
    const texts = TEXTS[selected];
    const isLanguage = view === "language";
    const tutorialIndex = TUTORIAL_VIEWS.indexOf(view);
    const isTutorial = tutorialIndex !== -1;

    document.documentElement.lang = selected;

    // Rótulo da etapa.
    if (isLanguage) {
      stepLabel.textContent = "1/4";
    } else if (isTutorial) {
      stepLabel.textContent = "2/4";
    } else {
      stepLabel.textContent = "3/4";
    }

    // Título e subtítulo.
    if (isLanguage) {
      title.textContent = texts.languageTitle;
      subtitle.textContent = texts.languageSubtitle;
    } else {
      title.textContent = texts[view].title;
      subtitle.textContent = isTutorial
        ? (tutorialIndex + 1) + " / " + TUTORIAL_VIEWS.length
        : "";
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
    confirmButton.textContent = texts.confirm;
    backButton.textContent = texts.back;
    nextButton.textContent = texts.next;
    skipButton.textContent = texts.skip;

    confirmButton.hidden = !isLanguage;
    backButton.hidden = isLanguage;
    nextButton.hidden = !isTutorial;
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

  // Confirmar idioma e seguir para a apresentação.
  confirmButton.addEventListener("click", async () => {
    confirmButton.disabled = true;
    setStatus(TEXTS[selected].saving);

    try {
      await chrome.storage.local.set({ [LANGUAGE_KEY]: selected });
      goTo("intro");
    } catch (error) {
      console.warn("Navpoint: erro ao salvar o idioma.", error);
      setStatus(TEXTS[selected].error, true);
    } finally {
      confirmButton.disabled = false;
    }
  });

  // Navegação do tutorial.
  nextButton.addEventListener("click", () => {
    const index = TUTORIAL_VIEWS.indexOf(view);

    if (index === -1) return;

    if (index < TUTORIAL_VIEWS.length - 1) {
      goTo(TUTORIAL_VIEWS[index + 1]);
    } else {
      goTo("levels");
    }
  });

  backButton.addEventListener("click", () => {
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

  // Carrega o idioma já salvo, se existir.
  async function init() {
    try {
      const saved = await chrome.storage.local.get(LANGUAGE_KEY);

      if (TEXTS[saved[LANGUAGE_KEY]]) {
        selected = saved[LANGUAGE_KEY];
      }
    } catch (error) {
      console.warn("Navpoint: erro ao ler o idioma salvo.", error);
    }

    render();
  }

  init();
})();

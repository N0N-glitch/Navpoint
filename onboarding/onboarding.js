(() => {
  "use strict";

  const LANGUAGE_KEY = "navpoint_language";
  const LEVEL_KEY = "navpoint_setup_level";

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
        text: "Esta etapa está em desenvolvimento. Aqui você vai criar seus primeiros atalhos.",
        levelLabel: "Nível escolhido:"
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
        text: "This step is under development. Here you will create your first shortcuts.",
        levelLabel: "Chosen level:"
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
        text: "Este paso está en desarrollo. Aquí crearás tus primeros atajos.",
        levelLabel: "Nivel elegido:"
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

      const chosen = document.createElement("p");

      chosen.className = "chosen-level";
      chosen.textContent =
        texts.setupShortcuts.levelLabel +
        " " +
        texts.levels.options[selectedLevel].name;

      contentArea.appendChild(chosen);
    }
  }

  function render() {
    const texts = TEXTS[selected];
    const isLanguage = view === "language";
    const tutorialIndex = TUTORIAL_VIEWS.indexOf(view);
    const isTutorial = tutorialIndex !== -1;
    const isLevels = view === "levels";

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
    confirmButton.textContent = texts.confirm;
    backButton.textContent = texts.back;
    nextButton.textContent = texts.next;
    skipButton.textContent = texts.skip;

    confirmButton.hidden = !(isLanguage || isLevels);
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

  // Confirmar: salva o idioma ou o nível e avança.
  confirmButton.addEventListener("click", async () => {
    const texts = TEXTS[selected];

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

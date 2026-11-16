(() => {
  "use strict";

  const LANGUAGE_KEY = "navpoint_language";

  const LANGUAGES = [
    { code: "pt", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" }
  ];

  const TEXTS = {
    pt: {
      title: "Escolha seu idioma",
      subtitle: "Esse idioma será usado na extensão e no terminal.",
      selected: "Idioma selecionado",
      confirm: "Confirmar",
      saving: "Salvando...",
      saved: "Idioma salvo. A próxima etapa está em desenvolvimento.",
      error: "Não foi possível salvar o idioma. Tente novamente."
    },
    en: {
      title: "Choose your language",
      subtitle: "This language will be used in the extension and the terminal.",
      selected: "Selected language",
      confirm: "Confirm",
      saving: "Saving...",
      saved: "Language saved. The next step is under development.",
      error: "Could not save the language. Please try again."
    },
    es: {
      title: "Elige tu idioma",
      subtitle: "Este idioma se usará en la extensión y en el terminal.",
      selected: "Idioma seleccionado",
      confirm: "Confirmar",
      saving: "Guardando...",
      saved: "Idioma guardado. El siguiente paso está en desarrollo.",
      error: "No se pudo guardar el idioma. Inténtalo de nuevo."
    }
  };

  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const selectedCaption = document.getElementById("selected-caption");
  const selectedName = document.getElementById("selected-name");
  const optionsBox = document.getElementById("language-options");
  const status = document.getElementById("status");
  const confirmButton = document.getElementById("confirm-button");

  if (
    !title ||
    !subtitle ||
    !selectedCaption ||
    !selectedName ||
    !optionsBox ||
    !status ||
    !confirmButton
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

  let selected = detectLanguage();
  const optionButtons = new Map();

  function detectLanguage() {
    const code = (navigator.language || "").slice(0, 2).toLowerCase();
    return TEXTS[code] ? code : "en";
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? "status error" : "status";
  }

  function render() {
    const texts = TEXTS[selected];
    const language = LANGUAGES.find(item => item.code === selected);

    document.documentElement.lang = selected;
    title.textContent = texts.title;
    subtitle.textContent = texts.subtitle;
    selectedCaption.textContent = texts.selected;
    selectedName.textContent = language.name;
    confirmButton.textContent = texts.confirm;

    optionButtons.forEach((button, code) => {
      button.setAttribute("aria-checked", String(code === selected));
    });
  }

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

  confirmButton.addEventListener("click", async () => {
    confirmButton.disabled = true;
    setStatus(TEXTS[selected].saving);

    try {
      await chrome.storage.local.set({ [LANGUAGE_KEY]: selected });
      setStatus(TEXTS[selected].saved);
    } catch (error) {
      console.warn("Navpoint: erro ao salvar o idioma.", error);
      setStatus(TEXTS[selected].error, true);
    } finally {
      confirmButton.disabled = false;
    }
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

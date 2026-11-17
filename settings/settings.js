(() => {
  "use strict";

  const LANGUAGE_KEY = "navpoint_language";
  const OPEN_MODE_KEY = "navpoint_open_mode";
  const HISTORY_ENABLED_KEY = "navpoint_history_enabled";

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

  const OPEN_MODES = ["same", "new"];

  const TEXTS = {
    pt: {
      tag: "CONFIGURAÇÕES",
      title: "Configurações",
      subtitle: "As mudanças são salvas na hora.",
      saved: "Salvo.",
      saveError: "Não foi possível salvar. Tente novamente.",
      language: {
        title: "Idioma",
        desc: "Idioma da extensão."
      },
      openMode: {
        title: "Abertura de abas",
        desc: "Onde os sites abertos pelo terminal devem aparecer.",
        options: {
          same: "Na aba atual",
          new: "Em uma nova aba"
        }
      },
      history: {
        title: "Histórico do terminal",
        desc: "Guarda o que aparece no terminal entre uma abertura e outra. Ao desativar, o histórico salvo é apagado.",
        options: {
          on: "Ativado",
          off: "Desativado"
        }
      },
      shortcuts: {
        title: "Atalhos",
        desc: "Veja, adicione ou exclua seus atalhos.",
        nameLabel: "Nome do atalho",
        namePlaceholder: "ex.: yt",
        addressLabel: "Endereço",
        addressPlaceholder: "ex.: youtube.com",
        add: "Adicionar",
        remove: "Excluir",
        confirmRemove: "Tem certeza?",
        empty: "Nenhum atalho ainda.",
        created: "Atalho {name} criado!",
        removed: "Atalho {name} excluído.",
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
      }
    },

    en: {
      tag: "SETTINGS",
      title: "Settings",
      subtitle: "Changes are saved instantly.",
      saved: "Saved.",
      saveError: "Could not save. Please try again.",
      language: {
        title: "Language",
        desc: "Extension language."
      },
      openMode: {
        title: "Opening tabs",
        desc: "Where websites opened from the terminal should appear.",
        options: {
          same: "In the current tab",
          new: "In a new tab"
        }
      },
      history: {
        title: "Terminal history",
        desc: "Keeps what appears in the terminal between openings. Turning it off erases the saved history.",
        options: {
          on: "On",
          off: "Off"
        }
      },
      shortcuts: {
        title: "Shortcuts",
        desc: "View, add or delete your shortcuts.",
        nameLabel: "Shortcut name",
        namePlaceholder: "e.g.: yt",
        addressLabel: "Address",
        addressPlaceholder: "e.g.: youtube.com",
        add: "Add",
        remove: "Delete",
        confirmRemove: "Are you sure?",
        empty: "No shortcuts yet.",
        created: "Shortcut {name} created!",
        removed: "Shortcut {name} deleted.",
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
      }
    },

    es: {
      tag: "CONFIGURACIÓN",
      title: "Configuración",
      subtitle: "Los cambios se guardan al instante.",
      saved: "Guardado.",
      saveError: "No se pudo guardar. Inténtalo de nuevo.",
      language: {
        title: "Idioma",
        desc: "Idioma de la extensión."
      },
      openMode: {
        title: "Apertura de pestañas",
        desc: "Dónde deben aparecer los sitios abiertos desde el terminal.",
        options: {
          same: "En la pestaña actual",
          new: "En una pestaña nueva"
        }
      },
      history: {
        title: "Historial del terminal",
        desc: "Guarda lo que aparece en el terminal entre aperturas. Al desactivarlo, se borra el historial guardado.",
        options: {
          on: "Activado",
          off: "Desactivado"
        }
      },
      shortcuts: {
        title: "Atajos",
        desc: "Mira, agrega o elimina tus atajos.",
        nameLabel: "Nombre del atajo",
        namePlaceholder: "ej.: yt",
        addressLabel: "Dirección",
        addressPlaceholder: "ej.: youtube.com",
        add: "Agregar",
        remove: "Eliminar",
        confirmRemove: "¿Seguro?",
        empty: "Aún no hay atajos.",
        created: "¡Atajo {name} creado!",
        removed: "Atajo {name} eliminado.",
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
      }
    }
  };

  const tag = document.getElementById("tag");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const sectionsBox = document.getElementById("sections");
  const toastElement = document.getElementById("toast");

  if (!tag || !title || !subtitle || !sectionsBox || !toastElement) {
    return;
  }

  function detectLanguage() {
    const code = (navigator.language || "").slice(0, 2).toLowerCase();
    return TEXTS[code] ? code : "en";
  }

  // Estado atual das configurações.
  let lang = detectLanguage();
  let openMode = "same";
  let historyEnabled = true;

  // Estado da lista de atalhos.
  let shortcutListElement = null;
  let pendingDelete = null;
  let pendingTimer = null;

  // Aviso rápido na parte de baixo da tela.
  let toastTimer = null;

  function showToast(message, isError = false) {
    toastElement.textContent = message;
    toastElement.className = isError ? "toast error" : "toast";
    toastElement.hidden = false;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastElement.hidden = true;
    }, 2500);
  }

  async function saveSetting(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      showToast(TEXTS[lang].saved);
      return true;
    } catch (error) {
      console.warn("Navpoint: erro ao salvar configuração.", error);
      showToast(TEXTS[lang].saveError, true);
      return false;
    }
  }

  // Salva e só então aplica a mudança na tela.
  async function choose(key, value, apply) {
    const saved = await saveSetting(key, value);

    if (saved) {
      apply();
    }
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

  // Montagem da tela.
  function makeCategory(titleText, descText) {
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const description = document.createElement("p");

    section.className = "category";
    description.className = "category-desc";

    heading.textContent = titleText;
    description.textContent = descText;

    section.append(heading, description);

    return section;
  }

  // Lista de opções com [ ] e [x].
  function makeChoiceList(label, items, getValue, onSelect) {
    const list = document.createElement("div");
    const buttons = new Map();

    list.className = "choice-list";
    list.setAttribute("role", "radiogroup");
    list.setAttribute("aria-label", label);

    items.forEach(item => {
      const button = document.createElement("button");
      const nameElement = document.createElement("span");

      button.type = "button";
      button.className = "choice";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");

      nameElement.className = "choice-name";
      nameElement.textContent = item.name;

      button.appendChild(nameElement);

      if (item.desc) {
        const descElement = document.createElement("span");

        descElement.className = "choice-desc";
        descElement.textContent = item.desc;

        button.appendChild(descElement);
      }

      button.addEventListener("click", () => {
        onSelect(item.value);
      });

      list.appendChild(button);
      buttons.set(item.value, button);
    });

    function update() {
      buttons.forEach((button, value) => {
        button.setAttribute("aria-checked", String(value === getValue()));
      });
    }

    update();

    return { element: list, update };
  }

  function buildLanguageSection(t) {
    const section = makeCategory(t.language.title, t.language.desc);

    const choice = makeChoiceList(
      t.language.title,
      LANGUAGES.map(item => ({ value: item.code, name: item.name })),
      () => lang,
      code => {
        choose(LANGUAGE_KEY, code, () => {
          lang = code;
          renderAll();
        });
      }
    );

    section.appendChild(choice.element);

    return section;
  }

  function buildOpenModeSection(t) {
    const section = makeCategory(t.openMode.title, t.openMode.desc);

    const choice = makeChoiceList(
      t.openMode.title,
      OPEN_MODES.map(value => ({
        value,
        name: t.openMode.options[value]
      })),
      () => openMode,
      value => {
        choose(OPEN_MODE_KEY, value, () => {
          openMode = value;
          choice.update();
        });
      }
    );

    section.appendChild(choice.element);

    return section;
  }

  function buildHistorySection(t) {
    const section = makeCategory(t.history.title, t.history.desc);

    const choice = makeChoiceList(
      t.history.title,
      [
        { value: "on", name: t.history.options.on },
        { value: "off", name: t.history.options.off }
      ],
      () => (historyEnabled ? "on" : "off"),
      value => {
        choose(HISTORY_ENABLED_KEY, value === "on", () => {
          historyEnabled = value === "on";
          choice.update();
        });
      }
    );

    section.appendChild(choice.element);

    return section;
  }

  // Lista de atalhos com exclusão em dois toques.
  function renderShortcutList() {
    if (!shortcutListElement) return;

    const t = TEXTS[lang].shortcuts;
    const shortcuts = loadShortcuts();

    const names = Object.keys(shortcuts).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    shortcutListElement.replaceChildren();

    if (names.length === 0) {
      const empty = document.createElement("p");

      empty.className = "empty";
      empty.textContent = t.empty;

      shortcutListElement.appendChild(empty);
      return;
    }

    names.forEach(name => {
      const item = document.createElement("div");
      const info = document.createElement("div");
      const nameElement = document.createElement("span");
      const urlElement = document.createElement("span");
      const removeButton = document.createElement("button");

      item.className = "shortcut-item";
      info.className = "shortcut-info";
      nameElement.className = "shortcut-name";
      urlElement.className = "shortcut-url";

      nameElement.textContent = name;
      urlElement.textContent = shortcuts[name];

      removeButton.type = "button";
      removeButton.className = "ghost";

      if (pendingDelete === name) {
        removeButton.classList.add("sure");
        removeButton.textContent = t.confirmRemove;
      } else {
        removeButton.textContent = t.remove;
      }

      removeButton.addEventListener("click", () => {
        if (pendingDelete === name) {
          clearTimeout(pendingTimer);
          pendingDelete = null;
          removeShortcut(name);
          return;
        }

        // Primeiro toque: pede confirmação por alguns segundos.
        pendingDelete = name;

        clearTimeout(pendingTimer);

        pendingTimer = setTimeout(() => {
          pendingDelete = null;
          renderShortcutList();
        }, 4000);

        renderShortcutList();
      });

      info.append(nameElement, urlElement);
      item.append(info, removeButton);
      shortcutListElement.appendChild(item);
    });
  }

  function removeShortcut(name) {
    const t = TEXTS[lang].shortcuts;
    const shortcuts = loadShortcuts();

    if (!(name in shortcuts)) {
      renderShortcutList();
      return;
    }

    delete shortcuts[name];

    if (!saveShortcuts(shortcuts)) {
      showToast(t.errors.save, true);
      renderShortcutList();
      return;
    }

    showToast(t.removed.replace("{name}", name));
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

    wrapper.append(label, input);

    return { wrapper, input };
  }

  function buildShortcutsSection(t) {
    const st = t.shortcuts;
    const section = makeCategory(st.title, st.desc);

    shortcutListElement = document.createElement("div");
    shortcutListElement.className = "shortcut-list";

    const form = document.createElement("form");

    form.className = "shortcut-form";
    form.noValidate = true;
    form.autocomplete = "off";

    const nameField = makeField(
      "shortcut-name",
      st.nameLabel,
      st.namePlaceholder
    );

    const urlField = makeField(
      "shortcut-url",
      st.addressLabel,
      st.addressPlaceholder,
      "url"
    );

    const feedback = document.createElement("p");

    feedback.className = "feedback";
    feedback.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    const addButton = document.createElement("button");

    actions.className = "form-actions";

    addButton.type = "submit";
    addButton.className = "confirm";
    addButton.textContent = st.add;

    actions.appendChild(addButton);

    form.append(
      nameField.wrapper,
      urlField.wrapper,
      feedback,
      actions
    );

    form.addEventListener("submit", event => {
      event.preventDefault();

      const shortcuts = loadShortcuts();

      const name = nameField.input.value.trim();
      const address = urlField.input.value.trim();

      if (!name || !address) {
        feedback.textContent = st.errors.empty;
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        feedback.textContent = st.errors.name;
        nameField.input.focus();
        return;
      }

      const alias = name.toLowerCase();

      if (RESERVED_NAMES.includes(alias)) {
        feedback.textContent = st.errors.reserved;
        nameField.input.focus();
        return;
      }

      if (
        Object.keys(shortcuts).some(
          existing => existing.toLowerCase() === alias
        )
      ) {
        feedback.textContent = st.errors.duplicate;
        nameField.input.focus();
        return;
      }

      let url;

      try {
        url = prepareAddress(address);
      } catch (error) {
        feedback.textContent =
          error.message === "spaces" || error.message === "protocol"
            ? st.errors[error.message]
            : st.errors.invalid;

        urlField.input.focus();
        return;
      }

      shortcuts[name] = url;

      if (!saveShortcuts(shortcuts)) {
        feedback.textContent = st.errors.save;
        return;
      }

      feedback.textContent = "";
      showToast(st.created.replace("{name}", name));

      nameField.input.value = "";
      urlField.input.value = "";
      nameField.input.focus();

      renderShortcutList();
    });

    section.append(shortcutListElement, form);

    renderShortcutList();

    return section;
  }

  function renderAll() {
    const t = TEXTS[lang];

    document.documentElement.lang = lang;

    tag.textContent = t.tag;
    title.textContent = t.title;
    subtitle.textContent = t.subtitle;

    pendingDelete = null;
    clearTimeout(pendingTimer);

    sectionsBox.replaceChildren(
      buildLanguageSection(t),
      buildOpenModeSection(t),
      buildHistorySection(t),
      buildShortcutsSection(t)
    );
  }

  // Atualiza a lista se os atalhos mudarem em outra aba.
  window.addEventListener("storage", event => {
    if (event.key === SHORTCUTS_KEY || event.key === null) {
      renderShortcutList();
    }
  });

  // Carrega as configurações salvas e monta a tela.
  async function init() {
    try {
      const saved = await chrome.storage.local.get([
        LANGUAGE_KEY,
        OPEN_MODE_KEY,
        HISTORY_ENABLED_KEY
      ]);

      if (TEXTS[saved[LANGUAGE_KEY]]) {
        lang = saved[LANGUAGE_KEY];
      }

      if (OPEN_MODES.includes(saved[OPEN_MODE_KEY])) {
        openMode = saved[OPEN_MODE_KEY];
      }

      historyEnabled = saved[HISTORY_ENABLED_KEY] !== false;
    } catch (error) {
      console.warn("Navpoint: erro ao ler as configurações salvas.", error);
    }

    renderAll();
  }

  init();
})();

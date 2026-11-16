(() => {
  "use strict";

  const ONBOARDING_URL = "onboarding/onboarding.html?transition=rain";
  const SETTINGS_PAGE = "settings/settings.html";
  const OPEN_MODE_KEY = "navpoint_open_mode";

  function normalizeAddress(value) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Digite um endereço válido.");
    }

    let address = value.trim();

    if (/\s/.test(address)) {
      throw new Error("O endereço não pode conter espaços.");
    }

    if (!/^https?:\/\//i.test(address)) {
      if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(address)) {
        throw new Error("Protocolo não permitido. Use HTTP ou HTTPS.");
      }

      if (!address.includes(".")) {
        address += ".com";
      }

      address = "https://" + address;
    }

    let parsed;

    try {
      parsed = new URL(address);
    } catch {
      throw new Error("Não consegui reconhecer esse endereço.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Somente endereços HTTP e HTTPS são permitidos.");
    }

    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      throw new Error("Digite um domínio válido.");
    }

    return parsed.href;
  }

  // Abre o endereço na aba atual ou em uma nova,
  // conforme a preferência salva nas configurações.
  function openUrl(url, sender, sendResponse) {
    chrome.storage.local.get(OPEN_MODE_KEY, saved => {
      const readError = chrome.runtime.lastError;

      // Se a leitura falhar, usa a aba atual.
      const openInNewTab =
        !readError && saved && saved[OPEN_MODE_KEY] === "new";

      const finish = () => {
        if (chrome.runtime.lastError) {
          sendResponse({
            ok: false,
            error: "Não foi possível abrir esse endereço."
          });

          return;
        }

        sendResponse({
          ok: true,
          url
        });
      };

      if (openInNewTab) {
        chrome.tabs.create(
          { url, active: true, openerTabId: sender.tab.id },
          finish
        );
      } else {
        chrome.tabs.update(sender.tab.id, { url }, finish);
      }
    });
  }

  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      // Abrir um endereço.
      if (message?.type === "NAVPOINT_OPEN_URL") {
        if (!sender.tab || typeof sender.tab.id !== "number") {
          sendResponse({
            ok: false,
            error: "Não foi possível identificar a aba atual."
          });

          return;
        }

        let url;

        try {
          url = normalizeAddress(message.url);
        } catch (error) {
          sendResponse({
            ok: false,
            error: error.message
          });

          return;
        }

        openUrl(url, sender, sendResponse);

        return true;
      }

      // Levar a aba atual para a página de configuração inicial.
      if (message?.type === "NAVPOINT_OPEN_ONBOARDING") {
        if (!sender.tab || typeof sender.tab.id !== "number") {
          sendResponse({ ok: false });
          return;
        }

        chrome.tabs.update(
          sender.tab.id,
          { url: chrome.runtime.getURL(ONBOARDING_URL) },
          () => {
            if (chrome.runtime.lastError) {
              sendResponse({ ok: false });
              return;
            }

            sendResponse({ ok: true });
          }
        );

        return true;
      }

      // Abrir o painel de configurações em uma nova aba.
      if (message?.type === "NAVPOINT_OPEN_SETTINGS") {
        chrome.tabs.create(
          { url: chrome.runtime.getURL(SETTINGS_PAGE) },
          () => {
            if (chrome.runtime.lastError) {
              sendResponse({ ok: false });
              return;
            }

            sendResponse({ ok: true });
          }
        );

        return true;
      }
    }
  );
})();

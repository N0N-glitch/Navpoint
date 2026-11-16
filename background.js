(() => {
  "use strict";

  const ONBOARDING_PAGE = "onboarding/onboarding.html";
  const ONBOARDING_DONE_KEY = "navpoint_onboarding_done";

  // Abre o onboarding na primeira execução.
  // Também abre após uma atualização/recarga da extensão
  // enquanto o onboarding ainda não foi concluído.
  chrome.runtime.onInstalled.addListener(async details => {
    if (details.reason !== "install" && details.reason !== "update") {
      return;
    }

    try {
      if (details.reason === "update") {
        const saved = await chrome.storage.local.get(ONBOARDING_DONE_KEY);

        if (saved[ONBOARDING_DONE_KEY] === true) {
          return;
        }
      }

      await chrome.tabs.create({
        url: chrome.runtime.getURL(ONBOARDING_PAGE)
      });
    } catch (error) {
      console.warn("Navpoint: não foi possível abrir o onboarding.", error);
    }
  });

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

  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      if (message?.type !== "NAVPOINT_OPEN_URL") {
        return;
      }

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

      chrome.tabs.update(sender.tab.id, { url }, () => {
        const browserError = chrome.runtime.lastError;

        if (browserError) {
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
      });

      return true;
    }
  );
})();

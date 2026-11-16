(() => {
  "use strict";

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


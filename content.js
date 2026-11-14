
(() => {
  if (document.getElementById("navpoint-floating-button")) return;

  let terminalFrame = null;

  const button = document.createElement("button");
  button.id = "navpoint-floating-button";
  button.type = "button";
  button.textContent = "⌘";
  button.setAttribute("aria-label", "Abrir Navpoint");

  Object.assign(button.style, {
    position: "fixed",
    top: "14px",
    left: "12px",
    width: "48px",
    height: "48px",
    border: "1px solid rgba(0,255,136,.3)",
    borderRadius: "14px",
    background: "#07120c",
    color: "#00ff88",
    fontSize: "25px",
    cursor: "pointer",
    zIndex: "2147483647",
    boxShadow: "0 0 18px rgba(0,255,136,.15)"
  });

  function closeTerminal() {
    if (terminalFrame) {
      terminalFrame.remove();
      terminalFrame = null;
    }

    button.setAttribute("aria-label", "Abrir Navpoint");
  }

  function openTerminal() {
    if (terminalFrame) return;

    terminalFrame = document.createElement("iframe");
    terminalFrame.id = "navpoint-terminal-frame";
    terminalFrame.title = "Navpoint Terminal";
    terminalFrame.src = chrome.runtime.getURL("terminal/terminal.html");

    const initialWidth = Math.min(330, window.innerWidth - 20);
    const initialHeight = Math.min(360, window.innerHeight - 90);

    Object.assign(terminalFrame.style, {
      position: "fixed",
      top: "74px",
      left: "10px",
      width: `${Math.max(260, initialWidth)}px`,
      height: `${Math.max(220, initialHeight)}px`,
      border: "0",
      borderRadius: "15px",
      background: "transparent",
      zIndex: "2147483646"
    });

    document.documentElement.appendChild(terminalFrame);

    button.setAttribute("aria-label", "Navpoint aberto");
  }

  button.addEventListener("click", () => {
    if (terminalFrame) {
      closeTerminal();
    } else {
      openTerminal();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.source !== terminalFrame?.contentWindow) return;

    if (event.data === "NAVPOINT_CLOSE") {
      closeTerminal();
      return;
    }

    if (event.data?.type === "NAVPOINT_RESIZE") {
      const maxWidth = Math.max(260, window.innerWidth - 20);
      const maxHeight = Math.max(220, window.innerHeight - 90);

      const width = Math.min(
        maxWidth,
        Math.max(260, Number(event.data.width) || 330)
      );

      const height = Math.min(
        maxHeight,
        Math.max(220, Number(event.data.height) || 360)
      );

      terminalFrame.style.width = `${width}px`;
      terminalFrame.style.height = `${height}px`;
    }
  });

  document.documentElement.appendChild(button);
})();

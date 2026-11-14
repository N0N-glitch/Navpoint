
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

    Object.assign(terminalFrame.style, {
      position: "fixed",
      top: "74px",
      left: "10px",
      width: "min(430px, calc(100vw - 20px))",
      height: "min(520px, calc(100dvh - 90px))",
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
    }
  });

  document.documentElement.appendChild(button);
})();

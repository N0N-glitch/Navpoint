
(() => {
  // Evita criar o Navpoint mais de uma vez na mesma página.
  if (document.getElementById("navpoint-frame")) {
    return;
  }

  // Cria a estrutura que carregará a interface do terminal.
  const frame = document.createElement("iframe");

  frame.id = "navpoint-frame";
  frame.title = "Navpoint";

  // Carrega a interface interna da extensão.
  frame.src = chrome.runtime.getURL("terminal/terminal.html");

  // Mantém o Navpoint sobre a página.
  Object.assign(frame.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    border: "none",
    zIndex: "2147483647",
    background: "transparent",
    pointerEvents: "none"
  });

  // Adiciona o terminal à página.
  document.documentElement.appendChild(frame);
})();


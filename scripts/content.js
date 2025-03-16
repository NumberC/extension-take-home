// content.js
let actions = [];

document.addEventListener("click", (event) => {
  let selector = getSelector(event.target);
  actions.push({ type: "click", selector, timestamp: Date.now() });
  saveActions();
});

document.addEventListener("input", (event) => {
  let selector = getSelector(event.target);
  actions.push({ type: "input", selector, value: event.target.value, timestamp: Date.now() });
  saveActions();
});

function getSelector(element) {
  if (!element) return "";
  let path = [];
  while (element.parentElement) {
    let tag = element.tagName.toLowerCase();
    let siblings = Array.from(element.parentElement.children).filter(e => e.tagName === element.tagName);
    let index = siblings.indexOf(element) + 1;
    path.unshift(`${tag}:nth-of-type(${index})`);
    element = element.parentElement;
  }
  return path.join(" > ");
}

function saveActions() {
  chrome.storage.local.set({ actions });
}

// content.js
let actions = [];
let isFirstAction = true;

// start off without recording anything
// chrome.storage.local.set({ recording: "false" });

document.addEventListener("click", (event) => {
  let selector = getSelector(event.target);
  actions.push({ type: "click", selector, timestamp: Date.now() });
  saveActions();
});

document.addEventListener("keydown", (event) => {
  actions.push({ type: "keydown", value: event.key, timestamp: Date.now() });
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
  // Check if recording is enabled
  // chrome.storage.local.get("recording", ({ recording }) => {
  //   if (recording === "false") {
  //     // If recording is disabled, then clear actions and return
  //     actions = [];
  //     return;
  //   }
  // });

  if(actions.length === 1){
    // If this is the first action saved, then first save what website we are at
    actions[1] = actions[0]
    actions[0] = {type: "BEGIN", url: window.location.href, timestamp: Date.now()};
  }
  chrome.storage.local.set({ actions }).then(() => {
    console.log("Actions saved:", actions);
  })
  .catch((error) => {
    console.error("Error saving actions:", error);
  });
}

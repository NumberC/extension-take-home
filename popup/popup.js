// popup.js
document.getElementById("download").addEventListener("click", () => {
    chrome.storage.local.get("actions", ({ actions }) => {
        let blob = new Blob([JSON.stringify(actions, null, 2)], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "action_trace.json";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    });
});

// // start recording
// document.getElementById("start-recording").addEventListener("click", () => {
//     chrome.storage.local.set({ recording: "true" });
//     // reset actions
//     chrome.storage.local.set({ actions: [] });
//     console.log("Recording started");
// });

// // stop recording
// document.getElementById("stop-recording").addEventListener("click", () => {
//     chrome.storage.local.set({ recording: "false" });
//     console.log("Recording stopped");
// });
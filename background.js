chrome.runtime.onInstalled.addListener(() => {
    console.log("Chrome DevTools Recorder Extension Installed");
});

// Listen for messages from content.js to store recorded actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "record_action") {
        chrome.storage.local.get({ actions: [] }, (data) => {
            const updatedActions = [...data.actions, message.action];

            // Store updated action trace
            chrome.storage.local.set({ actions: updatedActions }, () => {
                console.log("Action recorded:", message.action);
            });
        });
    } else if (message.type === "clear_actions") {
        // Clear recorded actions
        chrome.storage.local.set({ actions: [] }, () => {
            console.log("Action trace cleared");
        });
    } else if (message.type === "get_actions") {
        // Retrieve recorded actions for popup
        chrome.storage.local.get({ actions: [] }, (data) => {
            sendResponse({ actions: data.actions });
        });
        return true; // Indicates an asynchronous response
    }
});

window.chrome.browserAction.onClicked.addListener(function (tab) {
  window.chrome.tabs.create(
    { url: window.chrome.extension.getURL("index.html") },
    function (tab) {
      // Tab opened.
    }
  );
});

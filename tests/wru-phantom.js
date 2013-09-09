var page = new WebPage;

page.onConsoleMessage = function(msg) {
  // cursor removed from phantomjs
  if (!/^\s+(?:\\|\/|\||\-)/.test(msg)) {
    console.log(msg.replace("\n", ""));
  }
};

page.open(phantom.args[0] || "about:blank", function(status) {
  if (status === "success") {
    page.evaluate(function () {
      window.phantomExit = false;
      window.quit = function () {
        window.phantomWruStatus = wru.status;
        window.phantomExit = true;
      };
      window.require = function () {
        return {wru: window.wru};
      };
      window.global = window;
    });
    page.injectJs("../node_modules/wru/build/wru.console.js");
    page.injectJs("sorttable-test.js");
  } else {
    phantom.exit(1);
  }
  setInterval(function () {
    var exiting = page.evaluate(function () {
      return [window.phantomExit, window.phantomWruStatus];
    });
    if (exiting && exiting[0]) {
      var exitcode;
      if (exiting[1] == "pass") {
        exitcode = 0;
      } else if (exiting[1] == "fail") {
        exitcode = 1;
      } else {
        exitcode = 2;
      }
      phantom.exit(exitcode);
    }
  }, 50);
});
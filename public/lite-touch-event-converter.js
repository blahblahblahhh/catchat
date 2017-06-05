(function() {
  function touchHandler(e) {
    var touches = e.changedTouches;
    var first = touches[0];
    var type = "";

    switch(e.type) {
      case "touchstart":
        type = "mousedown";
        break;
      case "touchmove":
        type="mousemove";
        break;
      case "touchend":
        type="mouseup";
        break;
      default:
        return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
    // e.preventDefault();
  }

  function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
  }

  init();
})();

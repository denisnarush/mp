import { Tap } from "./motion-tap.js";

declare global {
  // Megring to Element interface
  interface Element {
    doOff(eventName: string, handler: () => void, options?): Element;
    doOn(eventName: string, handler: () => void, options?): Element;
  }
}

/**
 *
 */
function doOn(eventName: "tap", handler: () => void, options) {
  const targetElement = this;
  const wrap = eventName[0] === "-";
  const action = detectAction(wrap ? eventName.slice(1) : eventName);

  if (!action) {
    return;
  }

  switch (action) {
    case "tap":
      Tap.call(targetElement, handler);

      return;

    // Case "hold":
    //     Hold.call(targetElement, handler);
    //     Return;
    // }
  }

  // TODO: Move this out
  function wrapper(event) {
    if (wrap) {
      let params = {};

      // Mouse
      if (event.type.indexOf("mouse") === 0) {
        params = {
          x: event.offsetX,
          y: event.offsetY,
          target: event.target,
        };
      }

      // Touch
      if (event.type.indexOf("touch") === 0) {
        params = {
          x: event.changedTouches[0].clientX - event.changedTouches[0].radiusX,
          y: event.changedTouches[0].clientY - event.changedTouches[0].radiusY,
          target: event.changedTouches[0].target,
        };
      }

      handler.call(targetElement, params);
    } else {
      handler.call(targetElement, event);
    }
  }

  targetElement.handlers = targetElement.handlers || {};
  targetElement.handlers[action] = targetElement.handlers[action] || [];
  targetElement.handlers[action].push([handler, wrapper]);

  targetElement.addEventListener(action, wrapper, options);

  return this;
}
/**
 *
 */
function doOff(eventName: string, handler: () => void, options?) {
  const targetElement = this;
  const action = detectAction(eventName);

  if (!action) {
    return;
  }

  switch (action) {
    case "tap":
      if (targetElement.destroyTapHandler) {
        targetElement.destroyTapHandler(handler);
      }

      return;

    case "hold":
      if (targetElement.destroyHoldHandler) {
        targetElement.destroyHoldHandler(handler);
      }

      return;
  }

  let i = this.handlers[action].length;

  while (i--) {
    const element = this.handlers[action][i];
    // Looking for handler
    if (element[0] === handler) {
      // Remove listner
      this.removeEventListener(action, element[1]);
      // Remove handler from array
      this.handlers[action].splice(i, 1);
      // Exit from loop;
      break;
    }
  }

  if (this.handlers[action].length === 0) {
    delete this.handlers[action];
  }

  return this;
}

function detectAction(name: string) {
  let action = name;

  switch (name) {
    case "start":
      action = "ontouchstart" in document ? "touchstart" : "mousedown";
      break;

    case "move":
      action = "ontouchmove" in document ? "touchmove" : "mousemove";
      break;

    case "end":
      action = "ontouchend" in document ? "touchend" : "mouseup";
      break;

    case "tap":
      action = "tap";
      break;

    case "hold":
      action = "hold";
      break;
  }

  return action;
}

Element.prototype.doOn = doOn;
Element.prototype.doOff = doOff;

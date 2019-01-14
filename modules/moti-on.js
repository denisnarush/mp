import { Tap } from "./moti-on.tap.js";
import { Hold } from "./moti-on.hold.js";

/**
 * Detec
 * @param {string} name 
 * @returns {string}
 */
function detectAction (name) {
    let action;

    switch(name) {

    case "start":
        action = ("ontouchstart" in document ? "touchstart" : "mousedown");
        break;

    case "move":
        action = ("ontouchmove" in document ? "touchmove" : "mousemove");
        break;

    case "end":
        action = ("ontouchend" in document ? "touchend" : "mouseup");
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

/**
 * Wrapper ON
 * @param {string} eventName "start" | "move" | "end" | "tap"
 * @param {function} handler 
 * @param {Object} [options]
 */
HTMLElement.prototype.doOn = function (eventName, handler, options) {
    const targetElement = this;
    let wrap = (eventName[0] === "-");
    let action = detectAction(wrap ? eventName.slice(1) : eventName);

    if (!action) {
        return;
    }

    switch(action) {
    case "tap":
        Tap.call(targetElement, handler);
        return;

    case "hold":
        Hold.call(targetElement, handler);
        return;
    }

    /* TODO: Move this out */
    function wrapper (event) {
        if (wrap) {
            let params = {};

            // mouse
            if (event.type.indexOf("mouse") === 0) {
                params = {
                    x: event.offsetX,
                    y: event.offsetY,
                    target: event.target
                };
            }

            // touch
            if (event.type.indexOf("touch") === 0) {
                params = {
                    x: event.changedTouches[0].clientX - event.changedTouches[0].radiusX,
                    y: event.changedTouches[0].clientY  - event.changedTouches[0].radiusY,
                    target: event.changedTouches[0].target,
                };
            }


            // TODO: Debug property
            params._event = event;

            handler.call(targetElement, params);
        } else {
            handler.call(targetElement, event);
        }
    }

    targetElement.handlers = targetElement.handlers || {};
    targetElement.handlers[action] = targetElement.handlers[action] || [];
    targetElement.handlers[action].push([handler, wrapper]);

    targetElement.addEventListener(action, wrapper , options);
};

/**
 * Wrapper OFF
 * @param {string} eventName "start" | "move" | "end"
 * @param {function} handler 
 * @param {Object} [options]
 */
HTMLElement.prototype.doOff = function (eventName, handler) {
    const targetElement = this;
    let action = detectAction(eventName);

    if (!action) {
        return;
    }

    switch(action) {

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

    while (i--){
        let element = this.handlers[action][i];
        // looking for handler
        if (element[0] === handler) {
            // remove listner
            this.removeEventListener(action, element[1]);
            // remove handler from array
            this.handlers[action].splice(i, 1);
            // exit from loop;
            break;
        }
    }

    if (this.handlers[action].length === 0) {
        delete this.handlers[action];
    }
};

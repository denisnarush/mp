import { Tap } from "./motion-tap.js";

declare global {
    // megring to Element interface
    interface Element {
        doOn(eventName: "tap", handler: Function, options?: any): Element;
        doOff(eventName: "tap", handler: Function, options?: any): Element;
    }
}

Element.prototype.doOn = doOn;

function doOn(eventName: "tap", handler: Function, options: any) {
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

    // case "hold":
    //     Hold.call(targetElement, handler);
    //     return;
    // }
    }

    // TODO: Move this out
    function wrapper (event) {
        if (wrap) {
            let params: any = {};

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


            // FIXME: Debug property
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

    return this;
}

function detectAction (name: string) {
    let action = name;

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

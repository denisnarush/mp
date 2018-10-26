import { DELAY } from "./moti-on.settings.js";

/**
 * HoldEvent
 */
class HoldEvent {
    /**
     * 
     * @param {Object} options Event options
     * @param {Number} options.screenX Screen X value
     * @param {Number} options.screenY Screen Y value
     * @param {HTMLElement} options.target Target element
     */
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.delay = options.dT;
        this.target = options.target;

        this._event = options._event;
    }
}

/**
* Hold
* 1. Target: Same
* 2. Delta position: 0 <= dX and dY <= 5
* 3. Touches: 1
* 4. Fire: Event after Delay x 3
* @param {function} handler 
*/
function Hold(handler) {
    const targetElement = this;

    targetElement.handlers = targetElement.handlers || {};
    targetElement.handlers["hold"] = targetElement.handlers["hold"] || [];
    targetElement.handlers["hold"].push(handler);

    // do not register new helper handlers
    if (targetElement.handlers["hold"].length > 1) {
        return;
    }

    let sX, sY, dX = 0, dY = 0,
        sT, dT,
        sE,
        t;

    function onHoldStart (e) {
        e._event.preventDefault();
        sT = (new Date()).getTime();
        sX = e.x;
        sY = e.y;
        sE = e;

        t = setTimeout(() => {
            if (dX <= 5 && dY <= 5 && sE.target === e.target) {
                targetElement.handlers["hold"].forEach(element => {
                    element.call(targetElement, new HoldEvent({
                        x: e.x,
                        y: e.y,
                        dT: dT,
                        target: e.target
                    }));
                });
            }
        }, DELAY * 3);
    }

    targetElement.doOn("-start", onHoldStart);

    function onHoldEnd (e) {
        dX = (sX - e.x < 0 ? -(sX - e.x) : sX - e.x);
        dY = (sY - e.y < 0 ? -(sY - e.y) : sY - e.y);
        dT = (new Date().getTime()) - sT;

        if (dT < DELAY * 3 && dX === 0 && dY === 0 && sE.target === e.target) {
            clearTimeout(t);
        }
    }

    targetElement.doOn("-end", onHoldEnd);

    function onHoldMove (e) {
        dX = (sX - e.x < 0 ? -(sX - e.x) : sX - e.x);
        dY = (sY - e.y < 0 ? -(sY - e.y) : sY - e.y);
    }

    targetElement.doOn("-move", onHoldMove);

    targetElement.destroyHoldHandler = function (handler) {
        let index = targetElement.handlers["hold"].indexOf(handler);

        if (index !== -1) {
            // remove when matched
            targetElement.handlers["hold"].splice(index, 1);
        }

        if (targetElement.handlers["hold"].length === 0) {
            // full destroy when no any registered handlers
            delete targetElement.handlers["hold"];
            delete targetElement.destroyTapHandler;

            targetElement.doOff("start", onHoldStart);
            targetElement.doOff("end", onHoldEnd);
            targetElement.doOff("move", onHoldMove);
        }
    };
}

export { Hold };
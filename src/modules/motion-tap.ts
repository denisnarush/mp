import { DELAY } from "./motion.settings.js";

interface TapEventInterface {
    x: number;
    y: number;
    target: Element|HTMLElement|HTMLAudioElement;
}

/**
 * TapEvent
 */
class TapEvent {
    x: number;
    y: number;
    target: Element|HTMLElement|HTMLAudioElement;

    constructor(options: TapEventInterface) {
        this.x = options.x;
        this.y = options.y;
        this.target = options.target;
    }
}



/**
* Tap
* 1. Target: Same
* 2. Delta position: dX and dY = 0
* 3. Touches: 1
* 4. Fire: 0 < Event < Delay
* @param {function} handler 
*/
function Tap (handler) {
    const targetElement = this;

    targetElement.handlers = targetElement.handlers || {};
    targetElement.handlers["tap"] = targetElement.handlers["tap"] || [];
    targetElement.handlers["tap"].push(handler);

    // do not register new helper handlers
    if (targetElement.handlers["tap"].length > 1) {
        return;
    }

    let sX, sY, dX, dY,
        sT, dT,
        sE;

    function onTapStart (e) {
        sT = (new Date()).getTime();
        sX = e.x;
        sY = e.y;
        sE = e;
    }

    targetElement.doOn("-start", onTapStart);

    function onTapEnd (e) {
        dX = (sX - e.x < 0 ? -(sX - e.x) : sX - e.x);
        dY = (sY - e.y < 0 ? -(sY - e.y) : sY - e.y);
        dT = (new Date().getTime()) - sT;

        // console.log("dX:", dX + "px", "dY:", dY + "px", "dT:", dT + "ms");

        if (dT < DELAY && dX === 0 && dY === 0 && sE.target === e.target) {
            targetElement.handlers["tap"].forEach(element => {
                element.call(targetElement, new TapEvent({
                    x: e.x,
                    y: e.y,
                    target: e.target
                }));
            });
        }
    }

    targetElement.doOn("-end", onTapEnd);

    targetElement.destroyTapHandler = function (handler) {
        let index = targetElement.handlers["tap"].indexOf(handler);

        if (index !== -1) {
            // remove when matched
            targetElement.handlers["tap"].splice(index, 1);
        }

        if (targetElement.handlers["tap"].length === 0) {
            // full destroy when no any registered handlers
            delete targetElement.handlers["tap"];
            delete targetElement.destroyTapHandler;

            targetElement.doOff("start", onTapStart);
            targetElement.doOff("end", onTapEnd);
        }
    };
}



export { Tap };
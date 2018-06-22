import { State } from "../modules/state.js";
import { Settings } from "../modules/settings.js";

class DevelopState extends State {
    constructor() {
        super("develop");

        this.state.topBar = [{
            icon: {
                type: "icon-arrow-left",
                handler: () => {
                    this.switchTo("player", {init: false});
                }
            }
        }, {
            title: "Develop"
        }, {
            push: "right"
        }];
    }

    init() {
        this.on();
        this.state.innerHTML = `<style>
            [data-state=develop]{
                color: #FFF;
                position: fixed;
                top: 0;
            }
            [data-state=develop][off]{
                position: initial;
                top: initial;
            }
            pre{
                background-color: #000;
                padding: 0;
                margin: 0;
            }
        </style>
        
<pre>




    Volume:             ${Settings.volume}
    Genre:              ${Settings.genre}
    Offset:             ${Settings.offset}
    Limit:              ${Settings.limit}
    Duration Limit:     ${Settings.volume}





</pre>
        `;
    }
}

export default new DevelopState();
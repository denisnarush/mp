import { State } from "./state.js";

class Equalizer extends State {
    constructor() {
        super("eq");

        this.state.addEventListener("mousemove", (event) => {this.move(event);});

        this.state.topBar = [{
            icon: {
                type: "icon-arrow-left",
                handler: () => this.switchToPlayer()
            }
        }, {
            title: "Equalizer"
        }];

        this.pressed = false;
        this.gradient = "#0c0c10, #56586c";
        this.d = this.state.querySelector(".roller .d");
        this.stream = document.querySelector("#stream");
        this.volumeBar = this.state.querySelector("#volume-bar");
        this.volumeLabel = this.state.querySelector("#volume-label");

        this.init();
    }

    up() {
        this.pressed = false;
    }

    down(event) {
        this.A = {
            x: event.pageX,
            y: event.pageY
        };
        this.V = this.volume;
        this.pressed = true;
    }

    move(event) {
        if (event.which === 0 && this.pressed) {
            this.up();
        } else if (event.which !== 0 && this.pressed) {

            this.B = {
                x: event.pageX,
                y: event.pageY
            };

            let angle = -360 * (this.B.y / 200 - this.A.y / 200) / 360 * 100;
            let volume = 100 * this.V + angle;

            if (volume > 100) {
                volume = 100;
            }

            if (volume < 0) {
                volume = 0;
            }

            this.stream.volume = volume / 100;
        }
    }

    onVolumeChange() {
        this.volume = this.stream.volume;
        this.volumeBar.setAttribute("stroke-dashoffset", `calc(2 * 3.14 * 47.5% * (1 - ${this.volume}))`);
        this.volumeLabel.innerHTML = `Volume <em>${(100 * this.volume).toFixed(0)}%</em>`;

        this.d.style.webkitTransform = `rotate(${360 * this.volume}deg)`;
        this.d.style.backgroundImage = `linear-gradient(${-360 * this.volume}deg, ${this.gradient})`;
    }

    switchToPlayer() {
        this.switchTo("player");
    }

    init() {
        this.d.addEventListener("mouseup", () => {this.up();});
        this.d.addEventListener("mousedown", (event) => {this.down(event);});
        // volume change
        this.stream.addEventListener("volumechange", () => {this.onVolumeChange();});
        this.onVolumeChange();
        this.on();
    }
}

export default new Equalizer();

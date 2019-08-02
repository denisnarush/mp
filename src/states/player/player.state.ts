import { State, StateOptionsInterface } from "../../modules/state.js";
import { Player } from "../../modules/player.js";


export class PlayerState extends State {
    private player: Player

    constructor(options: StateOptionsInterface) {
        super(`player`, options);
    }

    init() {
        console.log(this.player.preloadRandomTracks(), 123);
    }
}
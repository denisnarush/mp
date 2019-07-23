import { State } from "../../modules/state";
import { Player } from "../../modules/player";

export class PlayerState extends State {
    constructor(
        options: {
            player: Player,
            background: HTMLElement
        }) {

        super("player", options);
    }

    init() {}
}
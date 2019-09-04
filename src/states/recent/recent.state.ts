import { State, StateOptionsInterface } from "../../modules/state.js";

export class RecentState extends State {
    constructor(options: StateOptionsInterface) {
        super(`recent`, options);
    }
}
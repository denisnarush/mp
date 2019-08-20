import { Player } from "./../../dist/modules/player.js";

describe(`Player`, () => {
    const clean = () => {
        document.querySelectorAll('audio').forEach((e) => {
            e.remove();
        })
        localStorage.removeItem('player-settings');
    }

    afterEach(() => {
        clean();
    });

    it (`Init`, () => {
        new Player();
        chai.assert.exists(Player);
    })

    it(`is a Class`, () => {
        chai.assert.instanceOf(new Player(), Player, `eq`)
    })

    it(`each new Player() creates new <audio> element`, () => {
        new Player();
        new Player();
        const elements = document.querySelectorAll(`audio`);
        chai.assert.lengthOf(elements, 2);
    })

    it(`<audio> should creates with preload="auto" attribute`, () => {
        new Player();
        const elements = document.querySelector(`audio`);
        chai.assert.isTrue(elements.hasAttribute(`preload`));
        chai.assert.equal(elements.getAttribute(`preload`), `auto`);
    })

    it(`.settings is a Setter`, () => {
        const player = new Player();
        const fn = () => { player.settings = {
            volume: 4
        }; }
        chai.assert.changes(fn, player, `settings`);
    })

    it(`.volume default value is 1`, () => {
        const player = new Player();
        chai.assert.equal(player.volume, 1);
    })

    it(`.volume is a Setter`, () => {
        const player = new Player();
        const fn = () => { player.volume = 0; }
        chai.assert.changes(fn, player, `volume`);
    })

    it(`.volume can't be greate then 1`, () => {
        const player = new Player();
        player.volume = 0.5;
        const fn = () => { player.volume = 2; }
        chai.assert.changes(fn, player, `volume`);
        chai.assert.equal(player.volume, 1);
    })

    it(`.volume can't be less then 0`, () => {
        const player = new Player();
        player.volume = 0.5;
        const fn = () => { player.volume = -2; }
        chai.assert.changes(fn, player, `volume`);
        chai.assert.equal(player.volume, 0);
    })
});

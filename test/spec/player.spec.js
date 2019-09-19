import { Player } from "./../../dist/modules/player.js";

describe(`Player`, () => {
    let i = 0;
    const PLAYER_SETTINGS_KEY = `player-settings`;

    const clean = function () {
        // clean storage setting
        localStorage.removeItem(PLAYER_SETTINGS_KEY);
        // elements setting
        document.querySelectorAll('audio').forEach((e) => e.remove());
    }

    before(clean);

    beforeEach(function() {
        if (localStorage.getItem(PLAYER_SETTINGS_KEY)) {
            console.error(`Player settings should be null`)
        }
    })

    afterEach(() => {
        clean();
        console.clear();
    })

    describe(`Class`, () => {
        it(`is a class`, () => {
            chai.assert.instanceOf(new Player(), Player);
        })

        it(`whose new instance creates a new <audio> element;`, () => {
            new Player();
            new Player();
            const elements = document.querySelectorAll(`audio`);
            chai.assert.lengthOf(elements, 2);
        })

        it(`Each <audio> element should be created with preload="auto" attribute;`, () => {
            new Player();
            const elements = document.querySelector(`audio`);
            chai.assert.isTrue(elements.hasAttribute(`preload`));
            chai.assert.equal(elements.getAttribute(`preload`), `auto`);
        })

        it(`Should contains default settings properties`, () => {
            chai.assert.equal(Player.hasOwnProperty(`defaultSettings`), true);
        })

        it(`but doesn't exist as an instance propery;`, () => {
            const player = new Player();
            chai.assert.notDeepOwnInclude(player, {defaultSettings: {}});
        })
    })

    describe(`.settings <propery>`, () => {
        it(`Is a setter property;`, () => {
            const player = new Player();
            const fn = () => { player.settings = {
                volume: 4
            }; }
            chai.assert.changes(fn, player, `settings`);
        })

        it(`Should be defined with default settings parameters;`, () => {
            const player = new Player();
            chai.assert.deepEqual(player.settings, Player.defaultSettings);
        })
    })

    describe(`.track <propery>`, () => {
        it(`Should be defined as null;`, () => {
            const player = new Player();
            chai.assert.isDefined(player.track);
            chai.assert.isNull(player.track);
        })
    })

    describe(`.tracks <property>`, () => {
        it(`Should be defined;`, () => {
            const player = new Player();
            chai.assert.isDefined(player.tracks)
        })
    })

    describe(`.volume <propery>`, () => {
        it(`Is a setter property;`, () => {
            const player = new Player();
            const fn = () => { player.volume = 0; }

            chai.assert.changes(fn, player, `volume`);
        })

        it(`Default value is 1;`, () => {
            const player = new Player();
            chai.assert.equal(player.volume, 1);
        })

        it(`Can't be greate then 1`, () => {
            const player = new Player();
            player.volume = 0.5;
            const fn = () => { player.volume = 2; }
            chai.assert.changes(fn, player, `volume`);
            chai.assert.equal(player.volume, 1);
        })

        it(`or less then 0;`, () => {
            const player = new Player();
            player.volume = 0.5;
            const fn = () => { player.volume = -2; }
            chai.assert.changes(fn, player, `volume`);
            chai.assert.equal(player.volume, 0);
        })
    })


    describe(`.preloadRandomTracks() <method>`, () => {
        let player = new Player();;
        let tracks;

        it (`Is a method`, () => {
            chai.assert.isFunction(player.preloadRandomTracks)
        })

        it(`that preload compositions and returns data as array`, async () => {
            player = new Player();
            tracks = await player.preloadRandomTracks();
            chai.assert.isArray(tracks);
        })

       it(`that stored to tracks property`, async () => {
            chai.assert.deepEqual(player.tracks, tracks);
        })
    })


    describe(`.start() <method>`, () => {
        let player = new Player();

        it (`Is a method;`, () => {
            chai.assert.isFunction(player.start)
        })

        it(`Calling method when tracks data is empty should return instance;`, () => {
            chai.assert.deepEqual(player.start(), player)
        })

        it(`Should set current composition to track property;`, async () => {
            player = new Player();
            await player.preloadRandomTracks();
            player.start();
            chai.assert.isNotNull(player.track)
        })

        it(`Calling method without argument starts first composition;`, () => {
            chai.assert.deepEqual(player.track, player.tracks[0])
        })

        it(`Calling method twice with the same argument returns instance;`, () => {
            chai.assert.deepEqual(player.start(), player)
        })
    })


    describe(`.getTrackId() <method>`, () => {
        let player = new Player();
        player.preloadRandomTracks();

        it (`Is a method`, () => {
            chai.assert.isFunction(player.getTrackId)
        })

        it(`that returns null when no current composition is setted`, () => {
            chai.assert.isNull(player.getTrackId());
        })

        it(`or returns current composition ID as number`, () => {
            player.start();
            chai.assert.isNumber(player.getTrackId());
        })
    })
});

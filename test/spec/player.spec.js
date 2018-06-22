/* eslint no-unused-vars: "off" */

describe("Player", function () {
    let Settings, Player;

    // runs before each test in this block
    beforeEach(function(done) {        
        // create player element
        const stream = document.createElement("audio");
        stream.setAttribute("id", "stream");
        document.body.appendChild(stream);

        // load modules
        Promise.all([
            "../../modules/settings.js",
            "../../modules/player.js"
        ]
            .map(x => import(x)))
            .then(([settings, player]) => {
                Settings = settings;
                Player = player.default;

                done();
            });
    });

    // runs after each test in this block
    afterEach(function(done) {
        // remove player element
        document.getElementById("stream").remove();
        // clear localStorage
        localStorage.removeItem("settings");

        done();
    });

    /**
     * Should be applyed with <audio id=\"stream\">
     */
    it("Should be applyed with <audio id=\"stream\">", function () {
        chai.expect(Player).to.have.property("stream");
    });
    /**
     * Should get tracks
     */
    it("Should get tracks", function (done) {

        let f = () => {
            chai.expect(Player.stream.tracks).to.be.an("array");

            Player.stream.removeEventListener("loadstart", f);
            done();
        };

        Player.getTracks();
        Player.stream.addEventListener("loadstart", f);
    });
    /**
     * Should play track
     */
    it("Should play track", function (done) {
        this.timeout(1000);

        let t = () => {
            if (Player.stream.currentTime !== 0) {
                Player.stream.removeEventListener("timeupdate", t);
                Player.stop();
                done();
            }
        };

        Player.getTracks();
        Player.stream.addEventListener("canplay", () => Player.play());
        Player.stream.addEventListener("timeupdate", t);
    });
});
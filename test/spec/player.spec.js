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
            "../../modules/player.js"
        ]
            .map(x => import(x)))
            .then(([player]) => {
                Player = player.default;

                done();
            });
    });

    /**
     * Should be applyed with <audio id=\"stream\">
     */
    it("Should be applyed with <audio> HTML element and have id=\"stream\"", function () {
        chai.expect(Player).to.have.property("stream");
        chai.expect(Player.stream).to.be.an.instanceof(HTMLAudioElement);
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
        this.timeout(2000);

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
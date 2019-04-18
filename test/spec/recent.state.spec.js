describe("Recent State", function () {
    /**
     * Used for saving information about played track
     */
    let recent_track;
    /**
     * 1. Play one track
     * 2. Store information about it
     */
    it("Should plays at least one track and stores information about he into the Settings.recent array", function (done) {
        this.timeout(2000);

        // load modules
        Promise.all([
            "./../../modules/settings.js",
            "./../../modules/player.js"
        ]
            .map(x => import(x)))
            .then(([settings, player]) => {
                let Settings = settings.Settings;
                let Player = player.default;

                let t = () => {
                    if (Player.stream.currentTime !== 0) {
                        Player.stop();
                        Player.stream.removeEventListener("timeupdate", t);

                        chai.expect(Settings.recent).to.be.an("array").that.is.not.empty;
                        // save track played track information
                        recent_track = Settings.recent[0];

                        done();
                    }
                };
        
                Player.getTracks();
                Player.stream.addEventListener("canplay", () => Player.play());
                Player.stream.addEventListener("timeupdate", t);
            });
    });
    /**
     * Track object keys:
     * id, duration, artwork_url, stream_url, title, genre, user
     * for User:
     * user.username, user.avatar_url
     */
    it("Settings.recent is array of objects that should not contain unnecessary values", function () {
        chai.expect(recent_track)
            .to.be.an("object")
            .that.have.all.keys("id", "duration", "artwork_url", "stream_url", "title", "genre", "user");
        
        chai.expect(recent_track.user.avatar_url).that.is.not.empty;
        chai.expect(recent_track.user.username).that.is.not.empty;
    });
});

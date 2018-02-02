class Animation {
    constructor() {
        this.player = document.querySelector("[data-state=\"player\"]");
        this.playlist = document.querySelector("[data-state=\"playlist\"]");
        this.eq = document.querySelector("[data-state=\"eq\"]");

        this.init();
    }

    applyHandlers() {
        this.playlist.querySelector(".top").addEventListener("click", () => {
            this.togglePlayerUp();
            this.togglePlaylist();
        });
        this.player.querySelector(".top-equalizer").applyEvent("tap", () => {
            this.eq.removeAttribute("hidden");
            import("./equalizer.js").then(() => {
                this.togglePlayerLeft();
                this.toggleEqLeft();
                this.togglePlaylistLeft();
            });
        }, "Equalizer");
        this.eq.querySelector(".top-back").applyEvent("click", () => {
            this.toggleEqLeft();
            this.togglePlayerLeft();
            this.togglePlaylistLeft();
        }, "Now playing");
    }

    togglePlayerLeft() {
        this.player.style.webkitTransform = this.player.style.webkitTransform ? "" : "translateY(0) translateX(-100%)";
    }

    toggleEqLeft() {
        this.eq.style.webkitTransform = this.eq.style.webkitTransform ? "" : "translateX(0)";
    }

    togglePlayerUp() {
        this.player.style.webkitTransform = this.player.style.webkitTransform ? "" : "translateY(-100%)";
    }

    togglePlayerDown() {
        this.player.style.webkitTransform = this.player.style.webkitTransform ? "" : "translateY(100%)";
    }

    togglePlaylist() {
        this.playlist.style.webkitTransform = this.playlist.style.webkitTransform ? "" : "translateY(0)";
    }

    togglePlaylistLeft() {
        this.playlist.style.webkitTransform = this.playlist.style.webkitTransform ? "" : "translateY(calc(100% - 60px)) translateX(-100%)";
    }

    init() {
        this.applyHandlers();
    }
}

export default new Animation();
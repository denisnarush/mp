class Animation {
    constructor() {
        this.player = document.querySelector("[data-state=\"player\"]");
        this.playlist = document.querySelector("[data-state=\"playlist\"]");

        this.init();
    }

    applyHandlers() {
        this.playlist.querySelector(".top").addEventListener("click", () => {
            this.togglePlayerUp();
            this.togglePlaylist();
        });
    }


    togglePlayerUp() {
        this.player.style.webkitTransform = this.player.style.webkitTransform ? "" : "translateY(-100%)";
    }

    togglePlayerDown() {
        this.player.style.webkitTransform = this.player.style.webkitTransform ? "" : "translateY(100%)";
    }

    togglePlaylist() {
        this.playlist.style.webkitTransform = this.playlist.style.webkitTransform ? "" : "translateY(calc(100% - 60px))";
    }

    init() {
        this.applyHandlers();
    }
}

export default new Animation();
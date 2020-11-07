import {
  DEFAULT_PLAYER_SETTINGS,
  PLAYER_SETTINGS_STORAGE_KEY,
} from "../../environments/environment.js";
import {
  PlayerService,
  PlayerServiceEmum,
} from "../../services/player.service.js";
import { ElementsInterface } from "../state/state.js";
import { arrayOfObjectsDistinct } from "../utils/utils.js";

export interface PlayerSettingsInterface {
  duration?: {
    from: number;
    to: number;
  };
  genres?: string[];
  limit?: number;
  offset?: number;
  recent?: TrackInterface[];
  volume?: number;
}

export interface TrackInterface {
  author: string;
  cover: string;
  duration: number;
  genre: string;
  id: number;
  src: string;
  title: string;
}

export interface PlayerOptionsInterface {
  service: PlayerServiceEmum;
}

export class Player {
  /**
   *
   */
  public get currentTime() {
    return (this.elements[`container`] as HTMLAudioElement).currentTime;
  }
  /**
   *
   */
  public set currentTime(value) {
    (this.elements[`container`] as HTMLAudioElement).currentTime = value;
  }
  /**
   * Returns true if audio element is HAVE_ENOUGH_DATA
   */
  public get isReady() {
    // 4 HAVE_ENOUGH_DATA Enough data is available—and the download rate
    // Is high enough—that the media can be played through to the end without interruption.
    return (this.elements[`container`] as HTMLAudioElement).readyState === 4;
  }

  public get settings(): PlayerSettingsInterface {
    try {
      return JSON.parse(localStorage.getItem(PLAYER_SETTINGS_STORAGE_KEY));
    } catch (error) {
      // TODO: drop notification
      // Console.warn(error);
    }
  }

  public set settings(params: PlayerSettingsInterface) {
    const settings = {
      ...this.settings,
      ...params,
    };
    try {
      localStorage.setItem(
        PLAYER_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      // TODO: drop notification
      // Console.warn(error);
    }
  }

  public get volume(): number {
    return (this.elements[`container`] as HTMLAudioElement).volume;
  }

  public set volume(value) {
    if (value >= 1) {
      value = 1;
    } else if (value <= 0) {
      value = 0;
    }

    (this.elements[`container`] as HTMLAudioElement).volume = Number(
      value.toFixed(2)
    );
  }
  // Default parameters
  public static defaultSettings = DEFAULT_PLAYER_SETTINGS;
  // Current track
  public track: TrackInterface = null;
  // Preloaded tracks
  public tracks: TrackInterface[] = [];
  /**
   * Get Track cover
   */
  public getCover() {
    return this.track.cover;
  }
  /**
   * Get Track time percent representation
   */
  public getCurrentTimePercent() {
    return `${
      this.getTrackDuration()
        ? (this.currentTime * 100000) / this.getTrackDuration()
        : 0
    }%`;
  }
  /**
   * Get Track time string representation
   */
  public getCurrentTimeString() {
    const time = new Date(this.currentTime * 1000);

    return `${
      time.getUTCHours()
        ? time.toUTCString().slice(17, 25)
        : time.toUTCString().slice(20, 25)
    }`;
  }
  /**
   *
   */
  public getDuration() {
    return (this.elements[`container`] as HTMLAudioElement).duration;
  }
  /**
   * Get Track duration
   */
  public getTrackDuration() {
    return this.track.duration;
  }
  /**
   * Get Track duration string representation
   */
  public getTrackDurationString() {
    const time = new Date(this.getTrackDuration());

    return `${
      time.getUTCHours()
        ? time.toUTCString().slice(17, 25)
        : time.toUTCString().slice(20, 25)
    }`;
  }
  /**
   * Get Track genre
   */
  public getTrackGenre() {
    return this.track.genre;
  }
  /**
   * Get Track Id
   */
  public getTrackId() {
    return this.track ? this.track.id : null;
  }
  /**
   * Get Track title
   */
  public getTrackTitle() {
    return this.track.title;
  }
  /**
   * OnEnded
   */
  public onEnded(fn: () => void) {
    this.elements[`container`].addEventListener(`ended`, fn);
  }
  /**
   * OnLoadStart
   */
  public onLoadStart(fn: () => void) {
    this.elements[`container`].addEventListener(`loadstart`, fn);
  }
  /**
   * OnMetadataLoaded
   */
  public onMetadataLoaded(fn: () => void) {
    this.elements[`container`].addEventListener(`loadedmetadata`, fn);
  }
  /**
   * OnPause
   */
  public onPause(fn: () => void) {
    this.elements[`container`].addEventListener(`pause`, fn);
  }
  /**
   * OnPlay
   */
  public onPlay(fn: () => void) {
    this.elements[`container`].addEventListener(`play`, fn);
  }
  /**
   * OnTimeUpdate
   */
  public onTimeUpdate(fn: () => void) {
    this.elements[`container`].addEventListener(`timeupdate`, fn);
  }
  /**
   * Play
   */
  public play() {
    // Is tracks not prealoded
    if (this.tracks.length === 0) {
      // Skip
      return this;
    }
    // Is track playing ?
    if (!this.isPaused()) {
      // Skip
      return this;
    }
    // Is no current track
    if (this.track === void 0) {
      // Skip
      return this;
    }
    // Resume or start playing
    const promise = (this.elements[`container`] as HTMLAudioElement).play();
    // IOS 11 play() is a promise.
    if (promise !== undefined) {
      promise.catch(() => {});
    }
  }

  public preloadRandomTracks() {
    const promise = this.service.preloadTracks({
      limit: this.settings.limit,
      offset: this.settings.offset,
    });

    promise.then((data) => {
      this.tracks = data;
    });

    return promise;
  }
  /**
   * Start
   */
  public start(idx = 0) {
    if (this.tracks.length === 0) {
      // TODO: drop notification
      // Console.warn(`Tracks list is epmty`);

      // Skip
      return this;
    }
    // Detecting if current track the same as new
    if (
      (this.elements[`container`] as HTMLAudioElement).src ===
      this.tracks[idx].src
    ) {
      // TODO: drop notification
      // Console.warn(`You are trying to start an already playing track`);

      // Skip
      return this;
    }
    // Set current by index
    this.track = Object.assign({}, this.tracks[idx]);
    // Important pause!
    this.stop();
    // Setting source
    (this.elements[`container`] as HTMLAudioElement).src = this.tracks[idx].src;
  }
  /**
   * Stop
   */
  public stop() {
    setTimeout(() => {
      (this.elements[`container`] as HTMLAudioElement).pause();
    }, 0);
  }
  /**
   *
   */
  public togglePlaying() {
    this.isPaused() ? this.play() : this.stop();
  }

  public constructor(
    options: PlayerOptionsInterface = { service: PlayerServiceEmum.SoundCloud }
  ) {
    const { service } = options;

    // Selected service
    this.service = new PlayerService(service);
    // Player main container element
    const container = document.createElement(`audio`);
    // Setting container element params
    container.setAttribute(`preload`, `auto`);
    // Volume change
    container.addEventListener(`volumechange`, () => {
      if (this.settings === null) {
        return this;
      }
      // Apply volume value to settings
      this.settings = {
        volume: this.volume,
      };
    });
    // Load start
    container.addEventListener(`loadstart`, () => {
      if (this.settings === null) {
        return this;
      }
      // Do not apply the same track to recent array
      this.settings = {
        recent: arrayOfObjectsDistinct(
          this.settings.recent.concat([this.track])
        ),
      };
    });

    const defaultSettings = {
      ...Player.defaultSettings,
      ...this.settings,
    };

    this.settings = defaultSettings;
    // Appending to body
    document.body.appendChild(container);
    // Appending to elements
    this.elements[`container`] = container;
  }
  private elements: ElementsInterface = {};
  // Selected service
  private service: PlayerService;
  /**
   * Is current Track playing paused
   */
  private isPaused(): boolean {
    return (this.elements[`container`] as HTMLAudioElement).paused;
  }
}

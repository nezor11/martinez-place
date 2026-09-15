/**
 * A react-player built with only the providers this site embeds: YouTube
 * (lazy chunk) and plain media files (the HTML5 fallback). The default
 * `react-player` export registers every provider and emits lazy chunks for
 * hls.js, dash.js, Mux, Vimeo, Wistia, Spotify, Twitch and TikTok (about
 * 2.4 MB in dist) that no project card ever loads.
 *
 * `createReactPlayer`, `HtmlPlayer` and `canPlay` are subpath exports of
 * react-player 3 rather than documented API; if an upgrade breaks them,
 * switching back to `import ReactPlayer from "react-player"` restores the
 * full build.
 */
import HtmlPlayer from "react-player/HtmlPlayer";
import { canPlay } from "react-player/patterns";
import type { PlayerEntry } from "react-player/players";
import { createReactPlayer } from "react-player/ReactPlayer";
import { lazy } from "react";

const html: PlayerEntry = {
  key: "html",
  name: "html",
  canPlay: canPlay.html,
  canEnablePIP: () => true,
  player: HtmlPlayer,
};

const youtube: PlayerEntry = {
  key: "youtube",
  name: "YouTube",
  canPlay: canPlay.youtube,
  // Same lazy import react-player uses internally; its element props are
  // wider than PlayerEntry's, hence the cast.
  player: lazy(
    () => import("youtube-video-element/react"),
  ) as unknown as PlayerEntry["player"],
};

export const ReactPlayer = createReactPlayer([youtube, html], html);

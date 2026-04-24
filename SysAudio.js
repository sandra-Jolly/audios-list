/**
 * SysAudio - GitHub Audio Module
 * Builds track URLs and provides a clean API for your site
 */

const SysAudio = (() => {

    // Base GitHub raw URL for your audio repo
    const GITHUB_BASE = "https://github.com/sandra-Jolly/audios-list/raw/refs/heads/main";

    // Track manifest (simple, clean)
    const tracks = [
        { id: "hipshop",    title: "Hip Shop",    file: "hip_shop.ogg" },
        { id: "chillbeat",  title: "Chill Beat",  file: "chillbeat.ogg" },
        { id: "sketchloop", title: "Sketch Loop", file: "sketchloop.ogg" }
    ];

    // Build a full GitHub raw URL
    const buildURL = (file) => `${GITHUB_BASE}/${file}`;

    // Find a track by ID
    const getTrack = (id) => tracks.find(t => t.id === id) || null;

    // Return all tracks (safe copy)
    const getAllTracks = () => tracks.map(t => ({ ...t }));

    // Return a track with a full URL included
    const getTrackWithURL = (id) => {
        const track = getTrack(id);
        return track ? { ...track, url: buildURL(track.file) } : null;
    };

    // OPTIONAL: localStorage handshake (only if you still use SysEngine)
    const requestSong = (trackId) => {
        const track = getTrack(trackId);
        if (!track) {
            console.warn(`SysAudio: Track not found: ${trackId}`);
            return null;
        }

        localStorage.setItem("SongRequest", JSON.stringify({
            id: trackId,
            ts: Date.now()
        }));

        return track;
    };

    // OPTIONAL: listen for vault responses
    const onResponse = (callback) => {
        window.addEventListener("storage", event => {
            if (event.key !== "SongResponse") return;

            try {
                const response = JSON.parse(event.newValue);
                if (response) callback(response);
            } catch (error) {
                console.error("SysAudio: Invalid response format:", error);
            }
        });
    };

    return {
        tracks: getAllTracks,
        getTrack,
        getTrackWithURL,
        buildURL,
        requestSong,   // optional
        onResponse     // optional
    };

})();


/**
 * SysAudio - URL Requester Module
 * Communicates with vault via localStorage
 * Builds URLs from GitHub source data
 */

const SysAudio = (() => {
    // GitHub raw content base URL
    const GITHUB_BASE = "https://github.com/sandra-Jolly/audios-list/raw/refs/heads/main";

    // Track manifest
    const tracks = [
        { id: "hipshop", title: "Hip Shop", file: "hip_shop.ogg" },
        { id: "chillbeat", title: "Chill Beat", file: "chillbeat.ogg" },
        { id: "sketchloop", title: "Sketch Loop", file: "sketchloop.ogg" }
    ];

    // Build URL from track file
    const buildURL = (file) => `${GITHUB_BASE}/${file}`;

    // Find track by ID
    const getTrack = (id) => tracks.find(t => t.id === id);

    // Request song from vault (localStorage handshake)
    const requestSong = (trackId) => {
        const track = getTrack(trackId);
        if (!track) {
            console.warn(`Track not found: ${trackId}`);
            return null;
        }

        const payload = JSON.stringify({
            id: trackId,
            ts: Date.now()
        });
        localStorage.setItem("SongRequest", payload);
        return track;
    };

    // Listen for vault responses
    const onResponse = (callback) => {
        window.addEventListener("storage", event => {
            if (event.key !== "SongResponse") return;

            try {
                const response = JSON.parse(event.newValue);
                if (!response) return;
                callback(response);
            } catch (error) {
                console.error("Invalid response format:", error);
            }
        });
    };

    // Get all tracks
    const getAllTracks = () => [...tracks];

    // Build full track object with URL
    const getTrackWithURL = (trackId) => {
        const track = getTrack(trackId);
        if (!track) return null;
        return {
            ...track,
            url: buildURL(track.file)
        };
    };

    return {
        tracks: getAllTracks,
        requestSong,
        onResponse,
        getTrack,
        getTrackWithURL,
        buildURL
    };
})();

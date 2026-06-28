(function () {
    const STORAGE_KEY = 'crushPersistentAudioState';
    const AUDIO_ID = 'audioPlayer';
    const DEFAULT_VOLUME = 0.7;
    const DEFAULT_TRACK = 'Fallen.mp3';
    const TRACK_INFO_BY_SRC = {
        'Alex Warren - On My Mind (Lyrics) ft. ROSÉ.mp3': { title: 'On My Mind', artist: 'Alex Warren & ROSÉ' },
        'Fallen.mp3': { title: 'Fallen', artist: 'Lola Amour' },
        'Daniel Caesar - Who Knows (Official Lyric Video).mp3': { title: 'Who Knows', artist: 'Daniel Caesar' },
        'Kalapastangan - fitterkarma (Lyrics).mp3': { title: 'Kalapastangan', artist: 'Fitterkarma' },
        'Pamungkas - To The Bone (Lyrics).mp3': { title: 'To The Bone', artist: 'Pamungkas' }
    };

    function isIndex0Page() {
        const pageName = window.location.pathname.split('/').pop().toLowerCase();
        return pageName === 'index0.html';
    }

    function getOrCreateAudio() {
        let audio = document.getElementById(AUDIO_ID);
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = AUDIO_ID;
            audio.preload = 'auto';
            audio.style.display = 'none';
            document.body.appendChild(audio);
        }
        return audio;
    }

    function readState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (error) {
            return {};
        }
    }

    function writeState(audio) {
        if (!audio || !audio.src) return;

        try {
            const nextState = {
                src: audio.currentSrc || audio.src,
                currentTime: audio.currentTime || 0,
                volume: audio.volume || DEFAULT_VOLUME,
                playing: !audio.paused && !audio.ended
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        } catch (error) {
            console.warn('Could not save audio state', error);
        }
    }

    function syncUi(audio, src) {
        const titleEl = document.getElementById('trackTitle');
        const artistEl = document.getElementById('artistName');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValueEl = document.getElementById('volumeValue');
        const bar = document.getElementById('sitePlayerBar');
        const barTitle = document.getElementById('sitePlayerTitle');
        const barArtist = document.getElementById('sitePlayerArtist');
        const barPlay = document.getElementById('sitePlayerPlay');

        const trackItem = Array.from(document.querySelectorAll('.track-item')).find((item) => {
            return (item.getAttribute('data-src') || '').trim() === (src || '').trim();
        });

        if (trackItem) {
            document.querySelectorAll('.track-item').forEach((item) => {
                item.classList.toggle('active', item === trackItem);
            });

            const title = trackItem.querySelector('.track-name')?.textContent?.trim() || 'Unknown';
            const artist = trackItem.querySelector('.track-artist')?.textContent?.trim() || 'Unknown Artist';
            if (titleEl) titleEl.textContent = title;
            if (artistEl) artistEl.textContent = artist;
            if (barTitle) barTitle.textContent = title;
            if (barArtist) barArtist.textContent = artist;
        }

        if (bar) {
            bar.style.display = 'flex';
        }
        if (barPlay) {
            barPlay.textContent = audio.paused ? '▶' : '⏸';
        }

        if (volumeSlider && volumeValueEl) {
            const savedVolume = Math.round((audio.volume || DEFAULT_VOLUME) * 100);
            volumeSlider.value = savedVolume;
            volumeValueEl.textContent = `${savedVolume}%`;
        }
    }

    function restorePlayback(audio) {
        const savedState = readState();
        const shouldAutoPlay = isIndex0Page();

        if (!savedState.src) {
            const fallbackSrc = DEFAULT_TRACK;
            audio.src = fallbackSrc;
            audio.volume = DEFAULT_VOLUME;
            syncUi(audio, fallbackSrc);
            if (shouldAutoPlay) {
                audio.play().catch(() => {});
            }
            return;
        }

        audio.src = savedState.src;
        audio.volume = savedState.volume || DEFAULT_VOLUME;

        audio.addEventListener('loadedmetadata', () => {
            if (savedState.currentTime > 0) {
                audio.currentTime = savedState.currentTime;
            }
            syncUi(audio, savedState.src);
            if (savedState.playing || shouldAutoPlay) {
                audio.play().catch(() => {});
            }
        }, { once: true });

        if (audio.readyState >= 2) {
            if (savedState.currentTime > 0) {
                audio.currentTime = savedState.currentTime;
            }
            syncUi(audio, savedState.src);
            if (savedState.playing || shouldAutoPlay) {
                audio.play().catch(() => {});
            }
        }
    }

    function init() {
        const audio = getOrCreateAudio();
        audio.volume = DEFAULT_VOLUME;

        const barPlay = document.getElementById('sitePlayerPlay');
        const barPrev = document.getElementById('sitePlayerPrev');
        const barNext = document.getElementById('sitePlayerNext');

        const togglePlayback = () => {
            if (audio.paused) {
                audio.play().catch(() => {});
            } else {
                audio.pause();
            }
            syncUi(audio, audio.currentSrc || audio.src);
        };

        const jumpTrack = (direction) => {
            const items = Array.from(document.querySelectorAll('.track-item'));
            if (!items.length) return;
            const currentSrc = audio.currentSrc || audio.src;
            const currentIndex = items.findIndex((item) => (item.getAttribute('data-src') || '').trim() === currentSrc.split('/').pop());
            const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + items.length) % items.length;
            const nextSrc = items[nextIndex].getAttribute('data-src');
            audio.src = nextSrc;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            syncUi(audio, nextSrc);
        };

        if (barPlay) barPlay.addEventListener('click', togglePlayback);
        if (barPrev) barPrev.addEventListener('click', () => jumpTrack(-1));
        if (barNext) barNext.addEventListener('click', () => jumpTrack(1));

        let saveTimer = null;
        const saveStateSoon = () => {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => writeState(audio), 250);
        };

        audio.addEventListener('timeupdate', saveStateSoon);
        audio.addEventListener('play', saveStateSoon);
        audio.addEventListener('pause', saveStateSoon);
        audio.addEventListener('ended', saveStateSoon);
        window.addEventListener('beforeunload', () => writeState(audio));
        window.addEventListener('pagehide', () => writeState(audio));

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                writeState(audio);
            }
        });

        restorePlayback(audio);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

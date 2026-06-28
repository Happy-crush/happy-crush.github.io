let currentTrackIndex = 0;
let playlist = [];

function initPlayer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const volumeSlider = document.getElementById('volumeSlider');
    
    if (!audioPlayer) {
        console.error('Audio player elements not found');
        return;
    }

 
    function buildPlaylist() {
        const playlistItems = document.querySelectorAll('.track-item');
        playlist = [];
        playlistItems.forEach((item) => {
            const src = item.getAttribute('data-src');
            const trackName = item.querySelector('.track-name')?.textContent || 'Unknown';
            playlist.push({
                title: trackName,
                artist: 'Unknown Artist',
                src: src
            });
        });
        console.log('Playlist built:', playlist);
    }

    function loadTrack(index) {
        if (playlist.length === 0) return;
        const track = playlist[index];
        console.log('Loading track:', track);
        audioPlayer.src = track.src;
        
        const trackTitle = document.getElementById('trackTitle');
        const artistName = document.getElementById('artistName');
        const durationEl = document.getElementById('duration');
        const currentTimeEl = document.getElementById('currentTime');
        
        trackTitle.textContent = track.title;
        artistName.textContent = track.artist;
        durationEl.textContent = '0:00';
        currentTimeEl.textContent = '0:00';
        
        const allItems = document.querySelectorAll('.track-item');
        allItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
        
        const albumArt = document.querySelector('.album-art');
        const images = ['f1.png', 'f2.png', 'f3.png', 'f4.png', 'f5.png', 'f6.png', 'f7.png', 'f8.png'];
        albumArt.src = `images/${images[index % images.length]}`;
    }

    function playTrack() {
        audioPlayer.play().catch(err => {
            console.log('Play error:', err);
            document.getElementById('trackTitle').textContent = 'Error: Cannot play file';
        });
        playBtn.textContent = '⏸️';
    }

    function pauseTrack() {
        audioPlayer.pause();
        playBtn.textContent = '▶️';
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    }

    // Navigation functions
    function prevTrackHandler() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    function nextTrackHandler() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    // Update progress
    function updateProgress() {
        if (audioPlayer.duration) {
            const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = percentage;
            
            const currentTimeEl = document.getElementById('currentTime');
            const durationEl = document.getElementById('duration');
            
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            
            if (durationEl.textContent === '0:00') {
                durationEl.textContent = formatTime(audioPlayer.duration);
            }
        }
    }

    function updateProgressOnDrag() {
        if (audioPlayer.duration) {
            const currentTimeEl = document.getElementById('currentTime');
            currentTimeEl.textContent = formatTime((progressBar.value / 100) * audioPlayer.duration);
        }
    }

    function setTrackProgress() {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }


    function setVolume() {
        const volumeValue = document.getElementById('volumeValue');
        audioPlayer.volume = volumeSlider.value / 100;
        volumeValue.textContent = volumeSlider.value + '%';
    }

    function formatTime(time) {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    buildPlaylist();
    audioPlayer.volume = 0.7;
    loadTrack(currentTrackIndex);

    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrackHandler);
    nextBtn.addEventListener('click', nextTrackHandler);
    progressBar.addEventListener('change', setTrackProgress);
    progressBar.addEventListener('input', updateProgressOnDrag);
    volumeSlider.addEventListener('input', setVolume);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextTrackHandler);

    const playlistItems = document.querySelectorAll('.track-item');
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
    });

    audioPlayer.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        document.getElementById('trackTitle').textContent = 'Error loading track';
        document.getElementById('artistName').textContent = 'Check file path';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    
    setTimeout(initPlayer, 100);
}
    playTrack();


function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percentage;
        
       
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        

        if (durationEl.textContent === '0:00') {
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    }
}

function updateProgressOnDrag() {
    if (audioPlayer.duration) {
        currentTimeEl.textContent = formatTime((progressBar.value / 100) * audioPlayer.duration);
    }
}

function setTrackProgress() {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
}

function setVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + '%';
}

function formatTime(time) {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

audioPlayer.addEventListener('error', () => {
    trackTitle.textContent = 'Error loading track';
    artistName.textContent = 'Check file path';
});
const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const imageSources = [
    'images/f1.png',
    'images/f2.png',
    'images/f3.png',
    'images/f4.png',
    'images/f5.png',
    'images/f6.png',
    'images/f7.png',
    'images/f8.png'
];

const loadedImages = [];
let imagesLoadedCount = 0;
const flowersArray = [];
const numberOfFlowers = 100; 

imageSources.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === imageSources.length) {
            startAnimation();
        }
    };
    loadedImages.push(img);
});

class Flower {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 30 + 40 + 50 ;    
        this.speedY = Math.random() * 1.5 + 0.5; 
        this.speedX = Math.random() * 1 - 0.5;   
        this.angle = Math.random() * 360;        
        this.spin = Math.random() * 1 - 0.5;    
        
        
        this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)];
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startAnimation() {
    for (let i = 0; i < numberOfFlowers; i++) {
        flowersArray.push(new Flower());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < flowersArray.length; i++) {
        flowersArray[i].update();
        flowersArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}

const canvas = document.getElementById('flowerCanvas');
if (!canvas) {
    throw new Error('flowerCanvas element not found');
}

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
].map((src) => new URL(src, window.location.href).toString());

const loadedImages = [];
let imagesLoadedCount = 0;
const flowersArray = [];
const numberOfFlowers = 100;

function startAnimation() {
    for (let i = 0; i < numberOfFlowers; i++) {
        flowersArray.push(new Flower());
    }
    animate();
}

function handleImageLoadOrError() {
    imagesLoadedCount++;
    if (imagesLoadedCount === imageSources.length) {
        startAnimation();
    }
}

imageSources.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = handleImageLoadOrError;
    img.onerror = handleImageLoadOrError;
    loadedImages.push(img);
});

class Flower {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 30 + 90;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1 - 0.5;
        this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)] || null;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)] || null;
        }
    }

    draw() {
        if (!this.image || !this.image.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < flowersArray.length; i++) {
        flowersArray[i].update();
        flowersArray[i].draw();
    }

    requestAnimationFrame(animate);
}

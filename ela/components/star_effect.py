"""
Mouse takip eden yildiz efekti
Streamlit uygulamasina eklemek icin kullan
"""

import streamlit as st

def add_star_effect():
    """Sayfaya mouse takip eden yildiz efekti ekler"""

    star_html = """
    <style>
    .star {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        animation: sparkle 1s ease-in-out forwards;
    }

    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }

    .star::before {
        content: '✦';
        font-size: 20px;
        color: #FFD700;
        text-shadow: 0 0 10px #FFD700, 0 0 20px #FFA500;
    }

    /* Farkli yildiz tipleri */
    .star.blue::before {
        color: #00BFFF;
        text-shadow: 0 0 10px #00BFFF, 0 0 20px #1E90FF;
    }

    .star.purple::before {
        color: #9370DB;
        text-shadow: 0 0 10px #9370DB, 0 0 20px #8A2BE2;
    }

    .star.green::before {
        color: #00FF7F;
        text-shadow: 0 0 10px #00FF7F, 0 0 20px #32CD32;
    }
    </style>

    <script>
    (function() {
        const colors = ['', 'blue', 'purple', 'green'];
        const symbols = ['✦', '✧', '★', '⋆', '✶', '✷', '✸', '✹'];
        let lastTime = 0;
        const throttle = 50; // ms - yildiz olusturma hizi

        document.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastTime < throttle) return;
            lastTime = now;

            createStar(e.clientX, e.clientY);
        });

        function createStar(x, y) {
            const star = document.createElement('div');
            star.className = 'star ' + colors[Math.floor(Math.random() * colors.length)];

            // Rastgele offset
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;

            star.style.left = (x + offsetX) + 'px';
            star.style.top = (y + offsetY) + 'px';

            // Rastgele boyut
            const size = 10 + Math.random() * 20;
            star.style.fontSize = size + 'px';

            // Rastgele sembol
            star.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

            document.body.appendChild(star);

            // 1 saniye sonra kaldir
            setTimeout(() => {
                star.remove();
            }, 1000);
        }
    })();
    </script>
    """

    st.markdown(star_html, unsafe_allow_html=True)


def add_particle_trail():
    """Daha sofistike particle trail efekti"""

    particle_html = """
    <canvas id="particle-canvas" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;"></canvas>

    <script>
    (function() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        const particles = [];
        let mouseX = 0;
        let mouseY = 0;

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 5 + 2;
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3;
                this.life = 1;
                this.decay = 0.02 + Math.random() * 0.02;

                // Rastgele renk
                const colors = [
                    'rgba(255, 215, 0, ',   // Gold
                    'rgba(0, 191, 255, ',   // DeepSkyBlue
                    'rgba(147, 112, 219, ', // MediumPurple
                    'rgba(0, 255, 127, ',   // SpringGreen
                    'rgba(255, 105, 180, '  // HotPink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.size *= 0.97;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.life + ')';
                ctx.fill();

                // Parlama efekti
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.life * 0.3) + ')';
                ctx.fill();
            }
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Her harekette 3 particle olustur
            for (let i = 0; i < 3; i++) {
                particles.push(new Particle(mouseX, mouseY));
            }
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life <= 0 || particles[i].size <= 0.5) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    })();
    </script>
    """

    st.markdown(particle_html, unsafe_allow_html=True)


def add_comet_trail():
    """Kuyruklu yildiz efekti"""

    comet_html = """
    <style>
    #comet-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    }

    .comet {
        position: absolute;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        box-shadow:
            0 0 10px #fff,
            0 0 20px #fff,
            0 0 30px #FFD700,
            0 0 40px #FFD700;
        animation: comet-fade 0.5s ease-out forwards;
    }

    .comet::after {
        content: '';
        position: absolute;
        width: 50px;
        height: 2px;
        background: linear-gradient(to left, transparent, rgba(255, 215, 0, 0.8));
        transform-origin: right center;
        right: 4px;
        top: 1px;
    }

    @keyframes comet-fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }
    </style>

    <div id="comet-container"></div>

    <script>
    (function() {
        const container = document.getElementById('comet-container');
        let lastX = 0, lastY = 0;
        let lastTime = 0;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < 30) return;
            lastTime = now;

            const comet = document.createElement('div');
            comet.className = 'comet';
            comet.style.left = e.clientX + 'px';
            comet.style.top = e.clientY + 'px';

            // Hareket yonune gore kuyruk aci
            const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX) * 180 / Math.PI;
            comet.style.transform = `rotate(${angle}deg)`;

            container.appendChild(comet);

            lastX = e.clientX;
            lastY = e.clientY;

            setTimeout(() => comet.remove(), 500);
        });
    })();
    </script>
    """

    st.markdown(comet_html, unsafe_allow_html=True)

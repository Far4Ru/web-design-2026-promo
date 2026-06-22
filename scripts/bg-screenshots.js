function initBgScreenshots() {
    const downloadScreen = document.getElementById('screen-download');
    if (!downloadScreen) return;

    const container = document.createElement('div');
    container.id = 'bg-screenshots';
    container.style.cssText = [
        'position:absolute',
        'inset:0',
        'z-index:0',
        'overflow:hidden',
        'pointer-events:none',
        'opacity:0',
        'transition:opacity 1.8s ease'
    ].join(';');
    downloadScreen.insertBefore(container, downloadScreen.firstChild);

    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = [
        '@keyframes bg-scr-pulse{',
        '0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5}',
        '50%{transform:translate(-50%,-50%) scale(1.2);opacity:.8}',
        '}'
    ].join('');
    document.head.appendChild(pulseStyle);

    const pulseEl = document.createElement('div');
    pulseEl.style.cssText = [
        'position:absolute',
        'top:50%',
        'left:50%',
        'width:600px',
        'height:600px',
        'background:radial-gradient(circle,rgba(124,92,255,.04) 0%,transparent 70%)',
        'border-radius:50%',
        'pointer-events:none',
        'animation:bg-scr-pulse 4s ease-in-out infinite'
    ].join(';');
    container.appendChild(pulseEl);

    const GRADIENTS = [
        'linear-gradient(135deg,#667eea,#764ba2)',
        'linear-gradient(135deg,#4facfe,#00f2fe)',
        'linear-gradient(135deg,#f093fb,#f5576c)',
        'linear-gradient(135deg,#43e97b,#38f9d7)',
        'linear-gradient(135deg,#fa709a,#fee140)',
        'linear-gradient(135deg,#a18cd1,#fbc2eb)',
        'linear-gradient(135deg,#667eea,#00f2fe)',
        'linear-gradient(135deg,#43e97b,#764ba2)'
    ];

    const MAX_TILES = 6;
    const CYCLE_MS = 10000;
    const FADE_MS = 2000;

    function probeImages(callback) {
        const found = [];
        function probe(n) {
            const img = new Image();
            img.onload = () => { found.push(n); probe(n + 1); };
            img.onerror = () => callback(found);
            img.src = `images/screen${n}.png`;
        }
        probe(1);
    }

    const W = 280, H = 180;
    const COAST_LERP = 0.025;
    const MAX_DRAG_SPEED = 12;

    function createTile(index, total, imageNums) {
        const el = document.createElement('div');
        const x = Math.random() * (window.innerWidth - W);
        const y = Math.random() * (window.innerHeight - H);
        const rot = (Math.random() - 0.5) * 20;
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;
        const sr = (Math.random() - 0.5) * 0.06;

        el.style.cssText = [
            'position:absolute',
            `width:${W}px`,
            `height:${H}px`,
            'border-radius:20px',
            `background:${GRADIENTS[index % GRADIENTS.length]}`,
            'filter:brightness(.35) blur(2px)',
            'box-shadow:0 8px 32px rgba(0,0,0,.4)',
            'transition:filter .5s cubic-bezier(.4,0,.2,1),transform .5s cubic-bezier(.4,0,.2,1),box-shadow .5s ease',
            'pointer-events:none',
            'cursor:grab',
            'will-change:transform',
            'overflow:hidden',
            `left:${x}px`,
            `top:${y}px`,
            `transform:rotate(${rot}deg)`
        ].join(';');

        el.dataset.x = x;
        el.dataset.y = y;
        el.dataset.rot = rot;
        el.dataset.vx = vx;
        el.dataset.vy = vy;
        el.dataset.sr = sr;
        el.dataset.ovx = vx;
        el.dataset.ovy = vy;
        el.dataset.paused = 'false';
        el.dataset.dragging = 'false';
        el.dataset.coasting = 'false';

        const layerA = document.createElement('div');
        layerA.style.cssText = [
            'position:absolute',
            'inset:0',
            'background-size:cover',
            'background-position:center',
            `transition:opacity ${FADE_MS}ms ease`,
            'opacity:1'
        ].join(';');

        const layerB = document.createElement('div');
        layerB.style.cssText = [
            'position:absolute',
            'inset:0',
            'background-size:cover',
            'background-position:center',
            `transition:opacity ${FADE_MS}ms ease`,
            'opacity:0'
        ].join(';');

        el.appendChild(layerA);
        el.appendChild(layerB);

        if (imageNums.length > 0) {
            let imgIdx = index % imageNums.length;
            layerA.style.backgroundImage = `url('images/screen${imageNums[imgIdx]}.png')`;

            let front = layerA;
            let back = layerB;

            function cycleImage() {
                imgIdx = (imgIdx + 1) % imageNums.length;
                back.style.backgroundImage = `url('images/screen${imageNums[imgIdx]}.png')`;
                setTimeout(() => {
                    back.style.opacity = '1';
                    front.style.opacity = '0';
                    [front, back] = [back, front];
                }, 50);
            }

            const stagger = total > 1 ? (CYCLE_MS / total) * index : 0;
            setTimeout(() => setInterval(cycleImage, CYCLE_MS), stagger);
        }

        el.addEventListener('mouseenter', function () {
            if (this.dataset.dragging === 'true') return;
            this.dataset.paused = 'true';
            const r = parseFloat(this.dataset.rot);
            this.style.zIndex = '10';
            this.style.filter = 'brightness(1) blur(0px)';
            this.style.transform = `rotate(${r}deg) scale(1.35)`;
            this.style.boxShadow = '0 16px 48px rgba(255,255,255,.2)';
        });

        el.addEventListener('mouseleave', function () {
            if (this.dataset.dragging === 'true') return;
            this.dataset.paused = 'false';
            const r = parseFloat(this.dataset.rot);
            this.style.zIndex = '';
            this.style.filter = 'brightness(.35) blur(2px)';
            this.style.transform = `rotate(${r}deg)`;
            this.style.boxShadow = '0 8px 32px rgba(0,0,0,.4)';
        });

        el.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            e.preventDefault();

            const self = this;
            const startX = parseFloat(self.dataset.x);
            const startY = parseFloat(self.dataset.y);
            let offX = e.clientX - startX;
            let offY = e.clientY - startY;
            let prevX = e.clientX;
            let prevY = e.clientY;
            let dragVx = 0;
            let dragVy = 0;

            self.dataset.dragging = 'true';
            self.dataset.coasting = 'false';
            self.dataset.paused = 'true';

            const r = parseFloat(self.dataset.rot);
            self.style.zIndex = '20';
            self.style.cursor = 'grabbing';
            self.style.filter = 'brightness(1.1) blur(0px)';
            self.style.transform = `rotate(${r}deg) scale(1.4)`;
            self.style.boxShadow = '0 24px 64px rgba(255,255,255,.25)';
            self.style.transition = 'filter .2s ease,transform .2s ease,box-shadow .2s ease';

            function onMove(e) {
                dragVx = e.clientX - prevX;
                dragVy = e.clientY - prevY;
                prevX = e.clientX;
                prevY = e.clientY;

                const nx = Math.max(0, Math.min(window.innerWidth - W, e.clientX - offX));
                const ny = Math.max(0, Math.min(window.innerHeight - H, e.clientY - offY));
                self.dataset.x = nx;
                self.dataset.y = ny;
                self.style.left = nx + 'px';
                self.style.top = ny + 'px';
            }

            function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);

                const clampedVx = Math.max(-MAX_DRAG_SPEED, Math.min(MAX_DRAG_SPEED, dragVx));
                const clampedVy = Math.max(-MAX_DRAG_SPEED, Math.min(MAX_DRAG_SPEED, dragVy));
                self.dataset.vx = clampedVx;
                self.dataset.vy = clampedVy;

                self.dataset.dragging = 'false';
                self.dataset.coasting = 'true';
                self.dataset.paused = 'false';

                const r = parseFloat(self.dataset.rot);
                self.style.zIndex = '';
                self.style.cursor = 'grab';
                self.style.filter = 'brightness(.35) blur(2px)';
                self.style.transform = `rotate(${r}deg)`;
                self.style.boxShadow = '0 8px 32px rgba(0,0,0,.4)';
                self.style.transition = 'filter .5s cubic-bezier(.4,0,.2,1),transform .5s cubic-bezier(.4,0,.2,1),box-shadow .5s ease';
            }

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        container.appendChild(el);
        return el;
    }

    probeImages(function (imageNums) {
        const COUNT = imageNums.length > 0 ? Math.min(imageNums.length, MAX_TILES) : MAX_TILES;
        const elements = [];

        for (let i = 0; i < COUNT; i++) {
            elements.push(createTile(i, COUNT, imageNums));
        }

        function tick() {
            elements.forEach(el => {
                if (el.dataset.dragging === 'true') return;
                if (el.dataset.paused === 'true') return;

                let x = parseFloat(el.dataset.x);
                let y = parseFloat(el.dataset.y);
                let rot = parseFloat(el.dataset.rot);
                let vx = parseFloat(el.dataset.vx);
                let vy = parseFloat(el.dataset.vy);
                let sr = parseFloat(el.dataset.sr);

                if (el.dataset.coasting === 'true') {
                    const ovx = parseFloat(el.dataset.ovx);
                    const ovy = parseFloat(el.dataset.ovy);
                    vx += (ovx - vx) * COAST_LERP;
                    vy += (ovy - vy) * COAST_LERP;
                    if (Math.abs(vx - ovx) < 0.005 && Math.abs(vy - ovy) < 0.005) {
                        vx = ovx;
                        vy = ovy;
                        el.dataset.coasting = 'false';
                    }
                    el.dataset.vx = vx;
                    el.dataset.vy = vy;
                }

                x += vx; y += vy; rot += sr;

                if (x < 0 || x > window.innerWidth - W) { vx *= -1; el.dataset.vx = vx; }
                if (y < 0 || y > window.innerHeight - H) { vy *= -1; el.dataset.vy = vy; }
                if (Math.abs(rot) > 12) { sr *= -1; el.dataset.sr = sr; }

                x = Math.max(0, Math.min(window.innerWidth - W, x));
                y = Math.max(0, Math.min(window.innerHeight - H, y));

                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.transform = `rotate(${rot}deg)`;
                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.rot = rot;
            });
            requestAnimationFrame(tick);
        }

        new IntersectionObserver(entries => {
            const visible = entries[0].isIntersecting;
            container.style.opacity = visible ? '1' : '0';
            elements.forEach(el => { el.style.pointerEvents = visible ? 'auto' : 'none'; });
        }, { threshold: 0.4 }).observe(downloadScreen);

        tick();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBgScreenshots);
} else {
    initBgScreenshots();
}

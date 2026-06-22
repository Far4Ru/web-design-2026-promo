function initBgNodes() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-nodes-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:0;pointer-events:none;transition:opacity 1.8s ease;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 150 };

    let NODE_COUNT, CONNECT_DIST, mobile;
    const nodes = [];

    function computeParams() {
        mobile = window.innerWidth < 768;
        NODE_COUNT = mobile ? 14 : 30;
        CONNECT_DIST = mobile ? 120 : 200;
    }

    function buildNodes() {
        nodes.length = 0;
        for (let i = 0; i < NODE_COUNT; i++) {
            const r = mobile ? Math.random() * 2 + 2 : Math.random() * 4 + 3;
            nodes.push({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                baseRadius: r,
                radius: r,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    computeParams();
    resize();
    buildNodes();

    let resizeTimer;
    window.addEventListener('resize', () => {
        resize();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            computeParams();
            buildNodes();
        }, 300);
    });

    function updateNode(n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.x = Math.max(0, Math.min(canvas.width, n.x));
        n.y = Math.max(0, Math.min(canvas.height, n.y));

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            n.radius = n.baseRadius + force * 5;
            n.x += dx * force * 0.02;
            n.y += dy * force * 0.02;
        } else {
            n.radius += (n.baseRadius - n.radius) * 0.1;
        }
        n.pulsePhase += 0.02;
    }

    function drawNode(n) {
        const hue = (n.id / NODE_COUNT) * 20 + 205;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3);
        glow.addColorStop(0, `hsla(${hue},90%,55%,1)`);
        glow.addColorStop(0.5, `hsla(${hue},75%,45%,0.5)`);
        glow.addColorStop(1, `hsla(${hue},60%,35%,0)`);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},90%,55%,0.9)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > CONNECT_DIST) continue;

                const mx = (nodes[i].x + nodes[j].x) / 2;
                const my = (nodes[i].y + nodes[j].y) / 2;
                const mdx = mouse.x - mx;
                const mdy = mouse.y - my;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                const boost = mdist < mouse.radius ? (mouse.radius - mdist) / mouse.radius : 0;
                const strength = (CONNECT_DIST - dist) / CONNECT_DIST;
                const alpha = strength * 0.5 + boost * 0.5;

                const hi = (nodes[i].id / NODE_COUNT) * 20 + 205;
                const hj = (nodes[j].id / NODE_COUNT) * 20 + 205;
                const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                grad.addColorStop(0, `hsla(${hi},90%,55%,${alpha})`);
                grad.addColorStop(1, `hsla(${hj},90%,55%,${alpha})`);

                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = strength * 2 + boost * 3;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(10,10,10,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        nodes.forEach(n => { updateNode(n); drawNode(n); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const downloadScreen = document.getElementById('screen-download');
    if (downloadScreen) {
        new IntersectionObserver(entries => {
            canvas.style.opacity = entries[0].isIntersecting ? '0' : '1';
        }, { threshold: 0.4 }).observe(downloadScreen);
    }

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBgNodes);
} else {
    initBgNodes();
}

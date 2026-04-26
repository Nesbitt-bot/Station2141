// Station 2141 — UI behaviors

(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function getLifeSeed() {
        var config = window.Station2141 || {};
        return String(config.lifeSeed || 'station2141');
    }

    function hashToState(seed) {
        var text = String(seed || 'station2141');
        var chunks = text.match(/[a-f0-9]{8}/gi);
        if (chunks && chunks.length >= 4) {
            return chunks.slice(0, 4).map(function (chunk) {
                return parseInt(chunk, 16) >>> 0;
            });
        }

        var h = 2166136261 >>> 0;
        for (var i = 0; i < text.length; i++) {
            h ^= text.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return [h, h ^ 0x9e3779b9, h ^ 0x243f6a88, h ^ 0xb7e15162].map(function (value) {
            return value >>> 0;
        });
    }

    function createPrng(seed) {
        var state = hashToState(seed);
        var a = state[0];
        var b = state[1];
        var c = state[2];
        var d = state[3];

        return function () {
            var t = (a + b) | 0;
            a = b ^ (b >>> 9);
            b = (c + (c << 3)) | 0;
            c = (c << 21) | (c >>> 11);
            d = (d + 1) | 0;
            t = (t + d) | 0;
            c = (c + t) | 0;
            return (t >>> 0) / 4294967296;
        };
    }

    function initLifeBackground() {
        var size = 128;
        var cellSize = 20;
        var frameMs = 100;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.className = 'station-life-background';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);

        var current = new Uint8Array(size * size);
        var next = new Uint8Array(size * size);
        var prng = createPrng(getLifeSeed());
        var viewportWidth = 0;
        var viewportHeight = 0;
        var pixelRatio = 1;
        var resizePending = false;
        var boardSize = size * cellSize;

        for (var i = 0; i < current.length; i++) {
            current[i] = prng() < 0.22 ? 1 : 0;
        }

        function isDark() {
            return document.documentElement.dataset.scheme === 'dark';
        }

        function wrapIndex(value) {
            var wrapped = value % size;
            return wrapped < 0 ? wrapped + size : wrapped;
        }

        function positiveMod(value, divisor) {
            var remainder = value % divisor;
            return remainder < 0 ? remainder + divisor : remainder;
        }

        function resizeCanvas() {
            var width = window.innerWidth || document.documentElement.clientWidth || 1;
            var height = window.innerHeight || document.documentElement.clientHeight || 1;
            var ratio = Math.min(window.devicePixelRatio || 1, 2);

            if (width === viewportWidth && height === viewportHeight && ratio === pixelRatio) {
                return;
            }

            viewportWidth = width;
            viewportHeight = height;
            pixelRatio = ratio;
            canvas.width = Math.ceil(viewportWidth * pixelRatio);
            canvas.height = Math.ceil(viewportHeight * pixelRatio);
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingEnabled = false;
        }

        function render() {
            var dark = isDark();
            var bg = dark ? '#303030' : '#f5f5fa';
            var cell = dark ? '#454545' : '#cacaca';
            var cropX = Math.floor((boardSize - viewportWidth) / 2);
            var cropY = Math.floor((boardSize - viewportHeight) / 2);
            var startX = -positiveMod(cropX, cellSize);
            var startY = -positiveMod(cropY, cellSize);

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, viewportWidth, viewportHeight);
            ctx.fillStyle = cell;

            for (var y = startY; y < viewportHeight; y += cellSize) {
                var cellY = wrapIndex(Math.floor((y + cropY) / cellSize));
                for (var x = startX; x < viewportWidth; x += cellSize) {
                    var cellX = wrapIndex(Math.floor((x + cropX) / cellSize));
                    if (current[cellY * size + cellX]) {
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                }
            }
        }

        function countNeighbors(x, y) {
            var left = x === 0 ? size - 1 : x - 1;
            var right = x === size - 1 ? 0 : x + 1;
            var up = y === 0 ? size - 1 : y - 1;
            var down = y === size - 1 ? 0 : y + 1;

            return current[up * size + left] +
                current[up * size + x] +
                current[up * size + right] +
                current[y * size + left] +
                current[y * size + right] +
                current[down * size + left] +
                current[down * size + x] +
                current[down * size + right];
        }

        function step() {
            for (var y = 0; y < size; y++) {
                for (var x = 0; x < size; x++) {
                    var idx = y * size + x;
                    var neighbors = countNeighbors(x, y);
                    next[idx] = current[idx]
                        ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
                        : (neighbors === 3 ? 1 : 0);
                }
            }

            var swap = current;
            current = next;
            next = swap;
        }

        resizeCanvas();
        render();
        window.setInterval(function () {
            step();
            render();
        }, frameMs);

        var observer = new MutationObserver(render);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-scheme']
        });

        window.addEventListener('resize', function () {
            if (resizePending) return;
            resizePending = true;
            window.requestAnimationFrame(function () {
                resizePending = false;
                resizeCanvas();
                render();
            });
        }, { passive: true });
    }

    // Custom language switcher dropdown
    function initLanguageSwitcher() {
        var wrapper = document.querySelector('.i18n-switch-custom');
        if (!wrapper) return;
        var trigger = wrapper.querySelector('.i18n-switch-trigger');
        if (!trigger) return;

        function close() {
            wrapper.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
        function open() {
            wrapper.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) close();
            else open();
        });

        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
    }

    // Homepage card search filter
    function initSiteSearch() {
        var box = document.querySelector('.site-search');
        if (!box) return;
        var input = box.querySelector('.site-search__input');
        var clear = box.querySelector('.site-search__clear');
        var articleList = document.querySelector('.article-list');
        if (!input || !articleList) return;

        var cards = Array.prototype.slice.call(articleList.querySelectorAll('article, .article-list--compact > *'));
        if (cards.length === 0) {
            // Fallback: treat direct children as cards
            cards = Array.prototype.slice.call(articleList.children);
        }

        function norm(s) { return (s || '').toLowerCase(); }

        var index = cards.map(function (el) {
            var title = el.querySelector('.article-title, h2, h3');
            var desc = el.querySelector('.article-subtitle, .article-description, p');
            var tags = el.querySelectorAll('.article-tags a, .tag, [rel="tag"]');
            var parts = [];
            if (title) parts.push(title.textContent);
            if (desc) parts.push(desc.textContent);
            tags.forEach(function (t) { parts.push(t.textContent); });
            return { el: el, haystack: norm(parts.join(' ')) };
        });

        function applyFilter(q) {
            q = norm(q).trim();
            box.classList.toggle('has-query', q.length > 0);
            var shown = 0;
            index.forEach(function (entry) {
                var match = q === '' || entry.haystack.indexOf(q) !== -1;
                entry.el.style.display = match ? '' : 'none';
                if (match) shown++;
            });
            box.classList.toggle('is-empty', q.length > 0 && shown === 0);
        }

        input.addEventListener('input', function () { applyFilter(input.value); });
        if (clear) {
            clear.addEventListener('click', function () {
                input.value = '';
                applyFilter('');
                input.focus();
            });
        }

        // Pre-fill from ?q=
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q');
        if (initial) {
            input.value = initial;
            applyFilter(initial);
        }
    }

    // Back-to-top button
    function initBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;
        var threshold = 400;
        var ticking = false;

        function update() {
            if (window.pageYOffset > threshold) btn.classList.add('visible');
            else btn.classList.remove('visible');
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        update();
    }

    ready(function () {
        initLifeBackground();
        initLanguageSwitcher();
        initSiteSearch();
        initBackToTop();
    });
})();

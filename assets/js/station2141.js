// Station 2141 — UI behaviors

(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
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
        initLanguageSwitcher();
        initSiteSearch();
        initBackToTop();
    });
})();

/**
 * Testimonial Wall of Love Embed Widget Script
 *
 * Usage:
 * <div id="testimonials-wall" data-space="YOUR_SPACE_PUBLIC_ID"></div>
 * <script src="https://yourdomain.com/embed.js" async></script>
 */
(function () {
    'use strict';

    function initEmbeds() {
        var containers = document.querySelectorAll('[data-space]');
        if (!containers.length) {
            var single = document.getElementById('testimonials-wall');
            if (single && single.getAttribute('data-space')) {
                containers = [single];
            }
        }

        var scriptTag = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        var baseUrl = '';
        if (scriptTag && scriptTag.src) {
            var url = new URL(scriptTag.src);
            baseUrl = url.origin;
        }

        for (var i = 0; i < containers.length; i++) {
            var el = containers[i];
            if (el.getAttribute('data-testimonials-initialized')) {
                continue;
            }

            var spaceId = el.getAttribute('data-space');
            if (!spaceId) {
                continue;
            }

            el.setAttribute('data-testimonials-initialized', 'true');

            var iframe = document.createElement('iframe');
            iframe.src = (baseUrl || '') + '/embed/' + encodeURIComponent(spaceId);
            iframe.width = '100%';
            iframe.height = el.getAttribute('data-height') || '650';
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.minHeight = '400px';
            iframe.style.overflow = 'hidden';
            iframe.loading = 'lazy';
            iframe.title = 'Customer Testimonials';

            el.innerHTML = '';
            el.appendChild(iframe);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmbeds);
    } else {
        initEmbeds();
    }
})();

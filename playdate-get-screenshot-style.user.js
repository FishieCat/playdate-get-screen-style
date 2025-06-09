// ==UserScript==
// @name         Playdate get screenshot style
// @namespace    http://tampermonkey.net/
// @version      2025-06-09
// @description  try to take over the world!
// @author       Whalie McWhalington
// @match        https://play.date/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.date
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


(function() {
  const processedAttr = 'data-processed-for-canvas';

  function processImages() {
    const imgs = document.querySelectorAll('div.screenshot > img:not([' + processedAttr + '])');
    imgs.forEach(img => {
      img.setAttribute(processedAttr, 'true');

      const parent = img.parentElement;
      parent.style.position = 'relative'; // ensure relative positioning for absolute children

      // 1) Add "get" link bottom-left corner
      const getLink = document.createElement('a');
      getLink.textContent = 'get';
      getLink.href = img.src;
      getLink.target = '_blank';
      Object.assign(getLink.style, {
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        'zIndex': '1000',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: '2px 6px',
        fontSize: '12px',
        textDecoration: 'none',
        borderRadius: '3px',
        fontFamily: 'sans-serif',
        userSelect: 'none',
      });
      parent.appendChild(getLink);

      // 2) Add canvas bottom-right corner
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 480;
      Object.assign(canvas.style, {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        width: '400px',
        height: '240px',
        'zIndex': '1000',
        border: '1px solid #000',
        backgroundColor: '#fff',
        userSelect: 'none',
      });
      parent.appendChild(canvas);

      const ctx = canvas.getContext('2d');

      // Disable smoothing
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      // Draw scaled image 200% (so 400x240 displayed canvas shows 800x480 real res)
      // We assume the img naturalWidth and naturalHeight exist
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image scaled 2x at top-left corner
      ctx.drawImage(img, 0, 0, iw, ih, 0, 0, iw * 2, ih * 2);

      // Draw overlay on top with 34% opacity
      ctx.fillStyle = 'rgba(148, 138, 120, 0.34)'; // #948a78 at 34% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }

  // Run every 1 second
  setInterval(processImages, 1000);
})();



})();

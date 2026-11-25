document.querySelectorAll('.television-cover[data-video-id]').forEach(cover => {
  cover.addEventListener('click', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    const { videoId, videoTitle } = cover.dataset;
    if (!/^[\w-]{11}$/.test(videoId)) return;
    event.preventDefault();
    const frame = document.createElement('iframe');
    frame.title = `Reproductor de ${videoTitle}`;
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&autoplay=0`;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'fullscreen; picture-in-picture; encrypted-media';
    frame.allowFullscreen = true;
    const link = cover.parentElement.querySelector('.television-external');
    cover.replaceWith(frame);
    link.hidden = false;
    frame.focus();
  });
});

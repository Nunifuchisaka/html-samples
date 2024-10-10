export default function() {
  console.log('modal.js');
  
  $('a[data-popup="iframe"]').magnificPopup({
    type: 'iframe',
    closeBtnInside: false,
    iframe: {
      markup: '<div class="mfp-iframe-scaler">' +
                //'<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allow="autoplay"></iframe>' +
              '</div>',
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=',
          src: 'https://www.youtube.com/embed/%id%?rel=0'//autoplay=1&
        }
      }
    }
  });
  
}

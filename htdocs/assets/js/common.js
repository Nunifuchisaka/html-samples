;(function($, window, document, undefined){
'use strict';

window.COMMON = new Object();

COMMON.device = (function(u){
  return {
    Tablet:(u.indexOf('windows') != -1 && u.indexOf('touch') != -1 && u.indexOf('tablet pc') == -1) 
      || u.indexOf('ipad') != -1
      || (u.indexOf('android') != -1 && u.indexOf('mobile') == -1)
      || (u.indexOf('firefox') != -1 && u.indexOf('tablet') != -1)
      || u.indexOf('kindle') != -1
      || u.indexOf('silk') != -1
      || u.indexOf('playbook') != -1,
    Mobile:(u.indexOf('windows') != -1 && u.indexOf('phone') != -1)
      || u.indexOf('iphone') != -1
      || u.indexOf('ipod') != -1
      || (u.indexOf('android') != -1 && u.indexOf('mobile') != -1)
      || (u.indexOf('firefox') != -1 && u.indexOf('mobile') != -1)
      || u.indexOf('blackberry') != -1
  }
})(window.navigator.userAgent.toLowerCase());


$(function(){
  
  COMMON.$window = $(window);
  COMMON.$document = $(document);
  COMMON.$html_body = $('html, body');
  COMMON.$html = $('html');
  COMMON.$body = $('body');
  
  //console.log(navigator.userAgent);
  
  //
  $('.carousel_1__1').slick({
    arrows: true,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 2,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
  
  //
  $('a[data-popup="inline"]').magnificPopup({
    type: 'inline',
  });
  
});


})(jQuery, this, this.document);
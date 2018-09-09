$( document ).ready(function() {

  var app = new RetuneFestival();


  // OVERLAYS

  // overlay toggling
  $overlayStackCount = 0;


  $('.overlay-toggle').on('click',function(){

    $(this).closest('.overlay').toggleClass('active');

    // if($(this).closest('.overlay').hasClass('active')) {
    //   $overlayStackCount++;
    // } else {
    //   $overlayStackCount--;
    // }

    // if($overlayStackCount == 0) {
    //   $('body').toggleClass('overlay-active');
    // }

    // no work like this
    if($('.overlay').filter('.active').length > 0) {
      $('body').addClass('overlay-active');
    } else {
      $('body').removeClass('overlay-active');
    }

    console.log($('.overlay').filter('.active').length);



  });


  // the tito form fiddle
  var titoData = {
    rt_titorelease : "",
    rt_titoevent: "",
    rt_ticketcode: Cookies.get('titoData.rt_ticketcode')
  };

  // console.log('ticketcode cookie read',titoData.rt_ticketcode);

  if(typeof titoData.rt_ticketcode !== 'undefined') {
    $(".ticket-code-form #ticket-code").val(titoData.rt_ticketcode);
    $(".ticket-code-form button").text('update code');
  }

  $('.button-signup').on('click',function(e){
    signupButtonClickHandler(e,titoData);
  });

  // ticket code input
  $('.ticket-code-form button').on('click',function(e){

    if($(".ticket-code-form #ticket-code")[0].checkValidity()) {

      e.preventDefault();
      titoData.rt_ticketcode = $(".ticket-code-form #ticket-code").val();
      Cookies.set('titoData.rt_ticketcode', titoData.rt_ticketcode );
      console.log('ticketcode cookie set:',titoData.rt_ticketcode);
      buildWidget(titoData);

    }
  });

  // cleanup on close
  $('.overlay-signup .overlay-toggle').on('click',function(){
    $('#rt-tito-widget').empty();
  });

  // LOADINGing events/pages to overlay-content ... or desktop content area
  $("a.ajax-to-overlay").on( 'click', function( e ) {
      e.preventDefault();

      var ajaxUrl = $(this).attr('href');

      //figure out where to load the content to..
      if(getViewport().screensize == "mobile") {
        var ajaxTarget = '.overlay-content';
      } else {
        var ajaxTarget = '.body-content';
      }

      $( ajaxTarget ).load( ajaxUrl + " #ajax-content" , function( response, status, xhr ) {

        if(getViewport().screensize == "mobile") {

          $('.overlay-content').addClass('active');

          if($('.overlay').filter('.active').length > 0) {
             $('body').addClass('overlay-active');
           } else {
             $('body').removeClass('overlay-active');
           }

        }

         $('#ajax-content .overlay-toggle').on('click',function(){
           $(this).closest('.overlay').toggleClass('active');
           $('body').toggleClass('overlay-active');
         });

         $('#ajax-content .button-signup').on('click',function(e){
           signupButtonClickHandler(e,titoData);
         });

         initVideoPlayers();

      });

  });

  // the event map
  // var map = new mapController('event-map',eventsGeoJson);


});

function signupButtonClickHandler(e,titoData){

    e.preventDefault();
    $('.overlay-signup').addClass('active');

    if($('.overlay').filter('.active').length >= 1) {
      $('body').addClass('overlay-active');
    } else {
      $('body').removeClass('overlay-active');
    }

    $('#rt-tito-widget').empty();

    titoData.rt_titorelease = $(e.target).data('release');
    titoData.rt_titoevent = $(e.target).data('event');

    console.log('release set:',titoData.rt_titorelease);
    console.log('event set:',titoData.rt_titoevent);

    if(typeof titoData.rt_ticketcode !== 'undefined') {
      buildWidget(titoData);
    };

}


function buildWidget(titoData) {

  new TitoWidget.Widget({
    event_path:   titoData.rt_titoevent,
    container_id: "rt-tito-widget",
    releases: titoData.rt_titorelease,
    discount_code: titoData.rt_ticketcode
  }).build();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getViewport ()
{
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    var screensize = "mobile";
    if(e[ a+'Width' ] >= 1030) screensize = "desktop";

    return { width : e[ a+'Width' ] , height : e[ a+'Height' ], screensize : screensize };
};


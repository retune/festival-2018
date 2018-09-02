$( document ).ready(function() {  

  // the event map
  // var map = new mapController('event-map',eventsGeoJson);

  // the hero carousel
  $(".hero-carousel").flickity({
    autoPlay: 2000,
    // initialIndex: 0,
    draggable: false,
    wrapAround: true,
    prevNextButtons: false,
    pageDots: false,
    pauseAutoPlayOnHover: false,
    imagesLoaded: true
  });
  

  // the events carousel on home
  $(".event-carousel-wrap").each(function(idx,el) {
    
    // carousel and nav will be set to this initially
    var startIndex = 0;

    var $carousel = $('.event-carousel', this).flickity({
      // autoPlay: 2000,
      initialIndex: startIndex,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      pauseAutoPlayOnHover: false
   });

    // pause now in order to start randomly delayed, something between 0 - 2 sec
    // $carousel.flickity('pausePlayer');
    // setTimeout(function(){
    //   $carousel.flickity('unpausePlayer');
    // },getRandomInt(0,20) * 100);

    // flickity instance
    var flkty = $carousel.data('flickity');
    
    // elements
    var $cellNavGroup = $('.event-carousel-nav',this);
    var $cellNavItems = $cellNavGroup.find('.event-carousel-nav-item');
    
    $cellNavItems.eq( startIndex ).addClass('is-selected');

    // update selected cellNavItems
    $carousel.on( 'select.flickity', function() {
      $cellNavItems.filter('.is-selected').removeClass('is-selected');
      $cellNavItems.eq( flkty.selectedIndex ).addClass('is-selected');
    });

    // select cell on button click
    $cellNavItems.on( 'click', '.event-carousel-nav-item', function() {
      var index = $(this).index();
      $carousel.flickity( 'select', index );
    });

  });


  // OVERLAYS
  // overlay toggling
  $('.overlay-toggle').on('click',function(){
    
    $(this).closest('.overlay').toggleClass('active');
    $('body').toggleClass('overlay-active');

  });


  // the tito form fiddle
  var titoData = {
    rt_titorelease : "",
    rt_titoevent: "",
    rt_ticketcode: Cookies.get('titoData.rt_ticketcode')
  };

  console.log('ticketcode cookie read',titoData.rt_ticketcode);
  
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

  // AJAXing events/pages to overlay-content
  $("a.ajax-to-overlay").on( 'click', function( event ) {
      event.preventDefault();

      // $('.ajax-loading').addClass('active');

      var ajaxUrl = $(this).attr('href');
      $( ".overlay-content" ).load( ajaxUrl + " #ajax-content" , function( response, status, xhr ) {
    
       //$('.ajax-loading').removeClass('active');
       $('.overlay-content').addClass('active');

       $('#ajax-content .overlay-toggle').on('click',function(){
         $(this).closest('.overlay').toggleClass('active');
       });

       $('#ajax-content .button-signup').on('click',function(e){
         signupButtonClickHandler(e,titoData);
       });

      });

  });

});

function signupButtonClickHandler(e,titoData){

    e.preventDefault();
    $('.overlay-signup').addClass('active');

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


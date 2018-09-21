(function(window){

    RetuneFestival.prototype.constructor = RetuneFestival;

    RetuneFestival.prototype = {
        viewport : '',
        titoData : {
          titoRelease : '',
          titoEvent: '',
          titoTicketCode: '',
          titoPublicEvent: false
        },
        overlayStack : [],
    };

    function RetuneFestival(){

        console.log('~~~ Retune Festival 2018 ~~~');

        ref = this;
        this.viewport = this.getViewport();
        $(window).resize(this.resizeHandler);
        window.onpopstate = this.popstateHandler;

        // this.router = new Navigo();
        // this.initRoutes();

        // Background Zuffi hero image
        // $('.section-header').addClass('section-header__bg' + this.getRandomInt(0,12) );

        this.initMenu();
        this.initCarousels();
        this.initVideoPlayers();
        this.initTicketCode();
        this.initOverlays();
        this.initAJAXing();

        // the event map
        // var map = new mapController('event-map',eventsGeoJson);

    }

    RetuneFestival.prototype.resizeHandler = function() {

        ref.viewport = ref.getViewport();

    };


    RetuneFestival.prototype.initMenu = function () {

      if(ref.viewport.screensize == "desktop") {

        // program day switching in menu
        $('.overlay-menu').on('mouseover',function(){
            $('body').addClass('scroll-lock');
        });

        $('.overlay-menu').on('mouseout',function(){
            $('body').removeClass('scroll-lock');
        });

      }

    };


    RetuneFestival.prototype.initVideoPlayers = function () {
      Plyr.setup('.plyr',{
        controls : ['play-large']
      });
    };

    RetuneFestival.prototype.initCarousels = function () {

      // the home hero carousel
      $('.hero-carousel').flickity({
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
      $('.event-carousel-wrap').each(function(idx,el) {

        // carousel and nav will be set to this initially
        var startIndex = 0;

        var $carousel = $('.event-carousel', this).flickity({
          // autoPlay: 2000,
          initialIndex: startIndex,
          wrapAround: true,
          prevNextButtons: false,
          pageDots: false,
          pauseAutoPlayOnHover: false,
          imagesLoaded: true

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

        // select nav on mouseover
        $cellNavItems.on( 'mouseover', function() {
          var index = $(this).index();
          $carousel.flickity( 'select', index );
        });

      });

    };

    RetuneFestival.prototype.initOverlays = function() {

        // extra programm click party, home and mobile only
        $('.section-program-button-hit-me-one-more-time').on('click',function(e){
          e.preventDefault();
          $('.overlay-menu .overlay-head').trigger('click');
        });

        // the menu ? where else ... the signup overlay
        $('.overlay-head').on('click',function(){

            if($(this).closest('.overlay').hasClass('active'))
              {
                ref.overlayStack.pop();
                $(this).closest('.overlay').removeClass('active');
              } else {
                ref.overlayStack.push( $(this).closest('.overlay') );
                $(this).closest('.overlay').addClass('active');
              }
              ref.overlayBodyClassManager();

        });

        // extra treat for directly acessed event pages close button
        $('.event-single .overlay-head .overlay-toggle').on('click',function(){
          window.location = '/2018/';
        });

        $('.button-signup').on('click',function(e){
          ref.signupButtonClickHandler(e);
        });

        // cleanup on close
        // $('.overlay-signup .overlay-toggle').on('click',function(){
        //   $('#rt-tito-widget').empty();
        // });

    };

    RetuneFestival.prototype.initAJAXing = function (){

        // LOADINGing events/pages to overlay-content ... or desktop content area
        $("a.ajax-to-overlay").on( 'click', function( e ) {

            $('.event-list-item').removeClass('active');

            $(e.target).closest('.event-list-item').addClass('active');

            window.scrollTo(0, 0);


            e.preventDefault();
            var ajaxUrl = $(this).attr('href');
            ref.rt_ajax(ajaxUrl);

        });
    };

    RetuneFestival.prototype.popstateHandler = function(e) {

        console.log(document.location);
        // ref.rt_ajax(document.location);

    };


    RetuneFestival.prototype.rt_ajax = function (ajaxUrl){

      //figure out where to load the content to..
      if(ref.viewport.screensize == "mobile") {
        var ajaxTarget = '.overlay-content';
      } else {
        var ajaxTarget = '.body-content';
      }

      $( ajaxTarget ).load( ajaxUrl + " #ajax-content" , function( response, status, xhr ) {

        document.title = response.match(/<title[^>]*>([^<]+)<\/title>/)[1];

        window.history.replaceState(null,null,ajaxUrl);

        if(ref.viewport.screensize == "mobile") {

          if($(this).closest('.overlay').hasClass('active')) {
            ref.overlayStack.pop();
            $('.overlay-content').removeClass('active');
          } else {
            ref.overlayStack.push( $(this).closest('.overlay') );
            $('.overlay-content').addClass('active');
          }

          ref.overlayBodyClassManager();

        }

        $('#ajax-content .overlay-toggle').on('click',function(){

            if( ref.viewport.screensize == 'mobile') {

              if($(this).closest('.overlay').hasClass('active'))
              {
                // window.history.back();
                ref.overlayStack.pop();

                $(this).closest('.overlay').removeClass('active');
                $('.overlay-content').empty();
              } else {
                ref.overlayStack.push( $(this).closest('.overlay') );
                $(this).closest('.overlay').addClass('active');

              }
              ref.overlayBodyClassManager();

            } else {
              window.location = '/2018/';
            }

         });

         $('#ajax-content .button-signup').on('click',function(e){
           ref.signupButtonClickHandler(e);
         });

         ref.initVideoPlayers();

      });
    };



    RetuneFestival.prototype.initTicketCode = function (){

        ref.titoData.titoTicketCode = Cookies.get('userTicketCode');
        // console.log('ticketcode found:',ref.titoData.titoTicketCode);

        // if there is already a ticket code - put it in the field and change button text
        if( ref.titoData.titoTicketCode ) {
          $(".ticket-code-form #ticket-code").val(ref.titoData.titoTicketCode);
          $(".ticket-code-form button").text('update code');
        }

        // ticket code form
        $('.ticket-code-form .ticketCode-button').on('click',function(e){

          // it's a HTML5 required input
          if($('.ticket-code-form #ticket-code')[0].checkValidity()) {

            e.preventDefault();

            ref.titoData.titoTicketCode = $('.ticket-code-form #ticket-code').val();
            Cookies.set('userTicketCode',  ref.titoData.titoTicketCode );

            // console.log('ticketcode updated:',ref.titoData.titoTicketCode);
            // console.log('new titoData',ref.titoData);

            ref.createTitoWidget(ref.titoData);

          }
        });
    };


    RetuneFestival.prototype.signupButtonClickHandler = function (e){

            e.preventDefault();

            if($('.overlay-signup').hasClass('active'))
            {
              // it's not a toggle
            } else {
              ref.overlayStack.push( $(this).closest('.overlay') );
              $('.overlay-signup').addClass('active');
            }
            // console.log( ref.overlayStack );
            ref.overlayBodyClassManager();

            ref.titoData.titoRelease = $(e.target).data('release');
            ref.titoData.titoEvent = $(e.target).data('event');

            if( $(e.target).data('type') == 'public') {
              // console.log('hide ticketcode');
              ref.titoData.titoPublicEvent = 'true';
              $('.ticket-code-form #ticket-code, .ticket-code-form .ticketCode-button').css('display','none');
              $('#ticket-codeHelp-public').css('display','block');
              $('#ticket-codeHelp').css('display','none');

            } else {
              // console.log('hide showticketcode');
              ref.titoData.titoPublicEvent = 'false';
              $('.ticket-code-form #ticket-code, .ticket-code-form .ticketCode-button').css('display','block');
              $('#ticket-codeHelp-public').css('display','none');
              $('#ticket-codeHelp').css('display','block');
            }

            ref.createTitoWidget(ref.titoData);

    };



    RetuneFestival.prototype.overlayBodyClassManager = function() {

        if(ref.overlayStack.length > 0) {

            if(!$('body').hasClass('overlay-active')) {
                $('body').addClass('overlay-active');
                // console.log('overlay bodyclass added');
            }

        } else {

            $('body').removeClass('overlay-active');
            // console.log('overlay bodyclass removed');
        }

    };



    RetuneFestival.prototype.createTitoWidget = function(titoData) {

      $('#rt-tito-widget').empty();

      // build the form if theres is all we need
      if( ref.titoData.titoRelease && ref.titoData.titoEvent ) {

          var conf = {
            event_path:   titoData.titoEvent,
            container_id: "rt-tito-widget",
            releases: titoData.titoRelease,
            discount_code: ""
          };

          console.log("public? " + ref.titoData.titoPublicEvent);

          if(ref.titoData.titoPublicEvent == "false") {
            console.log("yo, got code" + titoData.titoTicketCode);
            conf.discount_code = titoData.titoTicketCode;
          }

          console.log('widget build with',ref.titoData);
          new TitoWidget.Widget(conf).build();
      }
    };

    RetuneFestival.prototype.getViewport = function ()
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

    RetuneFestival.prototype.getRandomInt = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    };

    window.RetuneFestival = RetuneFestival;

}(window));

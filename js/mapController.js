(function(window){

  mapController.prototype.constructor = mapController;

  var map,events;

  function mapController(sel,events){
    
    this.events = events;

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RyZWl0ZW5vcmciLCJhIjoiY2l5enZoOWcxMDAwazMza2FhNDEya256ZSJ9.O_ikSSrFzwLnOzB860SQpg';

    this.map = new mapboxgl.Map({
        container: sel,
        style: 'mapbox://styles/mapbox/light-v9',
        center: [ 13.405, 52.52 ],
        zoom: 12
    });


    this.map.addControl(new mapboxgl.NavigationControl());

    this.update(this.events);

    // this.map.on('moveend', function(e){

    //   if(this.flying) {
    //     this.map.fire('flyend');
    //     this.flyToNextEvent();
    //   }
    // }.bind(this));
    
    // this.map.on('flystart', function(){
    //   this.flying = true;
    //   //console.log('flystart');

    // }.bind(this));

    // this.map.on('flyend', function(){
    //   this.flying = false;
    //   console.log('flyend');

    // }.bind(this));

    // // zoomlevel logging
    // this.map.on('zoomend',function (){
    //   //console.log('zoom level',this.map.getZoom());
    // }.bind(this));

    // for debugging ?? 
    window.themap = this.map; 

  }

  mapController.prototype.update = function(events){

    // add markers to map
    var map = this.map; 

    events.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('a');
        el.className = 'event-map-marker ajax-to-overlay';
        el.href =  marker.properties.url;
        el.setAttribute('data-id', marker.properties.id );
      
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
    
    });

    // marker hovering
    $('.mapboxgl-marker').on('mouseover',function(){
        var id = $(this).data('id');

        // update markers highlights
        $('.mapboxgl-marker').removeClass('event-map-marker__highlight');
        $(this).addClass('event-map-marker__highlight'); 

        // update list highlights
        $('.event-list-satellites .event-list-item').removeClass('event-list-item__highlight');
        var c = $('.event-list-satellites .event-list-item')
          .filter("[data-id='" + id + "']")
          .addClass('event-list-item__highlight'); 
    });

    // list hovering
    $('.event-list-satellites .event-list-item').on('mouseover',function(){
        var id = $(this).data('id');

        // update list highlights
        $('.event-list-satellites .event-list-item').removeClass('event-list-item__highlight');
        $(this).addClass('event-list-item__highlight'); 

        // update markers highlights
        $('.mapboxgl-marker').removeClass('event-map-marker__highlight');
        $('.mapboxgl-marker')
          .filter("[data-id='" + id + "']")
          .addClass('event-map-marker__highlight'); 
 
    });

  };

  mapController.prototype.flyToNextEvent = function(){

    this.map.fire('flystart');

    this.currentCenter.coordinates = this.map.getSource('events')._data.features[this.currentCenter.index].geometry.coordinates;
    
    console.log('flynow to index',this.currentCenter.index);
    console.log('flynow to',this.currentCenter.coordinates);
    
    // this.map.setZoom(13);
    
    this.map.flyTo({
          center: this.currentCenter.coordinates,
          speed: 0.1, // make the flying slow
          minZoom: 13, 
          zoom: 13,
          easing: function (t) {
            return t;
          }
      });

    // this.map.panTo(this.currentCenter.coordinates,{
    //   duration: 2000
    // });

    this.currentCenter.index++;

  };

  mapController.prototype.flyStop = function(){
    
    console.log('flyStop called');

    this.map.fire('flyend');
  
  };

  window.mapController = mapController;

}(window));










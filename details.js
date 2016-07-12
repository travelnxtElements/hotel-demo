(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;
  let genUrl = HotelDemo.genUrl;

  let sid = HotelDemo.getItem('sid');
  let itinerary = HotelDemo.getItem('itinerary');
  let token = HotelDemo.getItem('token');

  app.addEventListener('dom-change', function() {
    app.carouselData = itinerary.photoUrls;
    app.itinerary = itinerary;
    app.activeTab = 0;
    app.apiBaseUrl = baseApiEndpoint;
    app.authToken = token;
    app.searchId = sid;
    app.inventoryId = itinerary.id;
    app.apiSingleUrl = 'api/hotel/results/single';
    app.apiPoliciesUrl = 'api/hotel/results/single/policies';

    let roomList = document.querySelector('t-hotel-room-list');

    roomList.addEventListener('room-select', function(ev) {
      HotelDemo.setItem('room', ev.detail);
      HotelDemo.redirectToConfirmation();
    });

    roomList.showRooms();

    //FIXME: iron-list won't render the whole list
    let roomProvider = Polymer.dom(roomList).querySelector('#roomProvider');
    let singleAvail = Polymer.dom(roomProvider.root).querySelector('iron-ajax');
    singleAvail.addEventListener('response', function(ev) {
      let list = Polymer.dom(roomList.root).querySelector('iron-list');
      list.fire('iron-resize');
    });
  });
})(window, document);

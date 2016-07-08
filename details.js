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

    let roomList = document.querySelector('t-hotel-room-list');
    let roomProvider = Polymer.dom(roomList).querySelector('#roomProvider');

    roomProvider.apiBaseUrl = baseApiEndpoint;
    roomProvider.apiRelativeUrl = 'api/hotel/results/single';
    roomProvider.authToken = token;
    roomProvider.searchId = sid;
    roomProvider.inventoryId = itinerary.id;

    let policyProvider = Polymer.dom(roomList).querySelector('#policyProvider');

    policyProvider.apiBaseUrl = baseApiEndpoint;
    policyProvider.apiRelativeUrl = 'api/hotel/results/single/policies';
    policyProvider.authToken = token;
    policyProvider.searchId = sid;
    policyProvider.inventoryId = itinerary.id;

    roomList.addEventListener('room-select', function(ev) {
      try {
        HotelDemo.setItem('room', ev.detail);
        HotelDemo.redirectToConfirmation();
      } catch(e) {
        toast.text = 'Bad response from api';
        toast.open();
      }
    });

    roomList.showRooms();
  });
})(window, document);

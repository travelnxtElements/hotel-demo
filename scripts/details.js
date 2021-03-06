(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);

  let baseApiEndpoint = HotelDemo.baseApiEndpoint;
  let genUrl = HotelDemo.genUrl.bind(null, baseApiEndpoint);

  let sid = HotelDemo.getItem('sid');
  let itinerary = HotelDemo.getItem('itinerary');
  let token = HotelDemo.getItem('token');

  HotelDemo.mixinSearchRecap(app);
  app.resultsPageUrl = HotelDemo.getPageUrl('results');

  app.addEventListener('dom-change', function() {
    let toast = document.querySelector('#toast');

    app.loading = false;
    app.carouselData = itinerary.photoUrls;
    app.itinerary = itinerary;
    app.activeTab = 0;
    app.apiBaseUrl = HotelDemo.baseApiEndpoint;
    app.authToken = token;
    app.searchId = sid;
    app.inventoryId = itinerary.id;
    app.apiSingleUrl = 'api/hotel/results/single';
    app.apiPoliciesUrl = 'api/hotel/results/single/policies';

    let apiEndpoint = 'api/shoppingcart/remove/all';
    app.apiDeleteCartUrl = genUrl(apiEndpoint, { token: token });

    apiEndpoint = 'api/shoppingcart/add';
    app.apiPricingUrl = genUrl(apiEndpoint, { token: token });

    let roomList = app.$.roomList;

    roomList.addEventListener('room-select', function(ev) {
      HotelDemo.setItem('room', ev.detail);

      let rid = ev.detail.id;
      app.pricingCallBody = JSON.stringify({
        itemInfos: [{
          searchId: sid,
          inventoryId: rid
        }]
      });

      app.loading = true;
      app.$.apiDeleteCart.generateRequest();
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

  app.deleteCartComplete = function(ev) {
    try {
      if (event.detail.response.status.isSuccessful) {
        app.$.apiPricing.generateRequest();
      }
    } catch (e) {
      toast.text = 'Bad response from delete cart api';
      toast.open();
    }
  };

  app.pricingComplete = function(ev) {
    try {
      let cartItem = event.detail.response.addToCartItemResult[0];
      HotelDemo.setItem('cart-item', cartItem);

      HotelDemo.redirectToGuestInfo();
    } catch (e) {
      toast.text = 'Bad response from pricing api';
      toast.open();
    } finally {
      app.loading = false;
    }
  };

  function errorHandler(ev) {
    app.loading = false;
    HotelDemo.errorHandler.call(app, ev);
  }

  app.deleteCartError = app.pricingError = errorHandler;
})(window, document);

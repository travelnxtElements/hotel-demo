(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  function getBookingRequest(inventory, glist, cinfo, address) {
    let request = {
      inventoriesInfo: [{
        id: 0,
        passengerIds: [],
        paymentIds: [],
        leadPassengerId: 0,
        paymentBreakups: []
      }],
      passengers: [],
      payments: [],
      insuranceInfo: []
    }

    request.passengers = glist;
    request.inventoriesInfo[0].passengerIds = [...glist.keys()];

    let payment = cinfo;
    payment.billingAddress = address;

    var totalFare = inventory.rooms[0].fare.components.find(component => {
      return component.type.toLowerCase() === 'totalfare';
    });

    if (totalFare) {
      request.inventoriesInfo[0].paymentBreakups.push({
        amount: totalFare.money,
        paymentId: 0,
        paymentType: 'creditCard',
        passengerId: null
      });

      request.inventoriesInfo[0].paymentIds.push(0);
      request.payments.push(payment);
    }

    return request;
  }

  function getGlist() {
    let guestinfo = HotelDemo.getItem('guestinfo');

    return guestinfo.guests.map(guest => {
      delete guest.id;
      delete guest.header;
      guest.displayId--;
      guest.emailAddress = guestinfo.email;
      guest.phoneNumber = guestinfo.phoneNo;

      guest.dateOfBirth = {
        date: guest.dateOfBirth
      };

      return guest;
    });
  }

  let app = document.getElementById('app');
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;
  let genUrl = HotelDemo.genUrl.bind(null, baseApiEndpoint);

  let sid = HotelDemo.getItem('sid');
  let itinerary = HotelDemo.getItem('itinerary');
  let token = HotelDemo.getItem('token');
  let criteria = HotelDemo.getItem('criteria');
  let cartItem = HotelDemo.getItem('cart-item');

  // NOTE: Adds the itinerary description properties on `app`
  HotelDemo.mixinTripSummary(app);

  app.loading = false;
  app.apiBookingUrl = genUrl('api/ShoppingCart/book', { token: token });
  app.apiCountryUrl = genUrl('api/content/countries');
  app.apiBaseGeoUrl = genUrl('api/content');
  app.queryParamsString = `?token=${token}`;

  app.addEventListener('dom-change', function() {
    app.$.address.pullCountryList();
  });

  app.book = function(ev) {
    if (!app.$.terms.checked ||
        !app.$.address.validate() ||
        !app.$.creditCard.validate()) {

      return;
    }

    app.loading = true;

    let address = app.$.address.getAddress();
    let cinfo = app.$.creditCard.getInfo();
    let inventory = cartItem.inventory;
    let glist = getGlist();
    let req = getBookingRequest(inventory, glist, cinfo, address);
    app.bookingRequest = JSON.stringify(req);

    app.$.apiBooking.generateRequest();
  };

  app.bookingComplete = function(ev) {
    let toast = document.querySelector('#toast');
    app.loading = false;

    try {
      let bs = event.detail.response.bookingStatus.toLowerCase();

      if (bs !== 'purchased') {
        throw new Error('Booking failed for some reason');
      }

      HotelDemo.setItem('booking', ev.detail.response);
      HotelDemo.redirectToConfirmation();
    } catch (e) {
      toast.text = 'Bad response from booking api';
      toast.open();
    }
  };

  app.bookingFailed = function (ev) {
    app.loading = false;
    HotelDemo.errorHandler.call(app, ev);
  };
})(window, document);

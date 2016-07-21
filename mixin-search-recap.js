(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  HotelDemo.mixinSearchRecap = function(app) {
    let criteria = HotelDemo.getItem('criteria');

    // FIXME: this has to be in some translator component
    app.location = criteria.destination.name;
    app.checkInDate = new Date(criteria.checkInDate.date);
    app.checkOutDate = new Date(criteria.checkOutDate.date);
    app.adultCount = criteria.rooms[0].adults.quantity;
    app.childCount = criteria.rooms[0].children.quantity;
    app.searchPageUrl = HotelDemo.getPageUrl('/');
  };
})(window, document);

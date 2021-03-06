(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);
  let booking = HotelDemo.getItem('booking');

  // NOTE: Adds the itinerary description properties on `app`
  HotelDemo.mixinTripSummary(app);

  let cnum = booking.confirmationNumber;
  let email = booking.passengers[0].emailAddress;

  app.searchPageUrl = HotelDemo.getPageUrl('/');
  app.hCnum = booking.inventoriesInfo[0].passengerSegments[0].confirmationNumber;
  app.guests = booking.passengers;
  app.successMessage = `Your booking is complete. Your trip id is ${cnum}. `;
  app.successMessage += `A confirmation email has been sent to ${email}`;
})(window, document);

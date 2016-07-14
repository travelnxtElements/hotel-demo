(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  let booking = HotelDemo.getItem('booking');

  // NOTE: Adds the itinerary description properties on `app`
  HotelDemo.mixinTripSummary(app);

  let cnum = booking.confirmationNumber;
  let email = booking.passengers[0].emailAddress;
  app.successMessage = `Your booking is complete. Your trip id is ${cnum}. `;
  app.successMessage += `A confirmation email has been sent to ${email}`;
})(window, document);

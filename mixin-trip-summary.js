(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  function getDisplayDate(dateVal) {
    if (!dateVal) {
      return dateVal;
    }

    if (typeof dateVal == 'string') {
      dateVal = new Date(dateVal);
    }

    let monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = dateVal.getDate() < 10 ? '0' + dateVal.getDate() : dateVal.getDate();
    let month = monthNames[dateVal.getMonth()];

    return (`${date} ${month} ${dateVal.getFullYear()}, ${dayNames[dateVal.getDay()]}`).trim();
  }

  function dateDiff(fromDate, toDate) {
    let diff = toDate - fromDate;
    let divideBy = (24 * 60 * 60 * 1000);

    return Math.floor(diff / divideBy);
  }

  HotelDemo.mixinTripSummary = function(app) {
    let criteria = HotelDemo.getItem('criteria');
    let cartItem = HotelDemo.getItem('cart-item');

    app.cartItem = cartItem;
    app.criteria = criteria;
    app.fareComponents = cartItem.inventory.rooms[0].fare.components
    app.stayStartDate = getDisplayDate(cartItem.inventory.stayDuration.start.date);
    app.stayEndDate = getDisplayDate(cartItem.inventory.stayDuration.end.date);
    app.starRating = [...Array(cartItem.inventory.rating || 0).keys()];

    let aCount = criteria.rooms[0].adults.quantity;
    app.adultCountText = `${aCount} ${aCount === 1 ? 'Adult' : 'Adults'}`;
    app.passengerDetails = [{ type: 'Adult', quantity: aCount }];

    let cCount = criteria.rooms[0].children.quantity;
    app.childrenCountText = `${cCount} ${cCount === 1 ? 'Child' : 'Children'}`;
    cCount > 0 && app.passengerDetails.push({ type: 'Child', quantity: cCount });

    let fromDate = criteria.checkInDate.date;
    let toDate = criteria.checkOutDate.date;
    let nights = dateDiff(new Date(fromDate), new Date(toDate));
    app.itineraryFareLabel = nights + (nights > 1 ? ' Nights Fare' : ' Night Fare');
    app.baseFareLabel = 'Avg. per night fare x ' + nights;


    app.toggle = function(ev) {
      let isMore = app.$.toggle.hidden = !app.$.toggle.hidden;

      app.$.more.innerText = isMore ? 'more' : 'less';
    };

    app.showPolicies = function(ev) {
      app.$.overlay.active = true;

      if (!app.displayPolicies) {
        let policies = cartItem.inventory.rooms[0].policies;
        app.displayPolicies = app.$.policyProvider._getUIPolicies(policies);
      }
    };
  };
})(window, document);

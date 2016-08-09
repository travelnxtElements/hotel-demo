(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  function validateInput() {
    let paxSegments = document.querySelectorAll('t-passenger-segment');
    let communication = document.querySelector('t-communication');

    let paxValid = Array.from(paxSegments).reduce((paxValid, segment) => {
      return paxValid && segment.validate();
    });

    return communication.validate() && paxValid;
  }

  // FIXME: this should be in api response decorator component
  function getHeader(type, displayId, age) {
    if (displayId === 0) {
      return 'Primary Guest';
    }
    else if (type.toLowerCase() === 'adult') {
      return `${type} ${displayId}`;
    }
    else if (type.toLowerCase() === 'child') {
      let dispAge = age < 1 ? '<1' : age + '';
      dispAge += age === 1 ? ' year' : ' years';

      return `${type} ${displayId} (${dispAge})`;
    }
  }

  // translator to add properties on api response
  // FIXME: this should be in api response decorator component
  function generateGeusts(ages, idOffset, type) {
    idOffset = idOffset || 0;
    type = type || 'Adult';

    return ages.map((age, i) => {
      let dob = new Date();
      dob.setFullYear(dob.getFullYear() - age);

      return {
        type: type,
        gender: 'Male',
        header: getHeader(type, i + 1, age),
        id: idOffset + i,
        displayId: i + 1,
        dateOfBirth: dob.toLocaleDateString()
      };
    });
  }

  function getGuestsData(rooms, showAllGuests) {
    if (showAllGuests) { 
      let adults = generateGeusts(room.adults.ages);

      let aCount = adults.length;
      let children = generateChildren(room.children.quantity, aCount, 'Child');

      return adults.concat(children);
    }

    return generateGeusts([25]);
  }

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);
  let criteria = HotelDemo.getItem('criteria');
  let cartItem = HotelDemo.getItem('cart-item');

  app.phoneNumber = '';
  app.email = '';
  app.detailsPageUrl = HotelDemo.getPageUrl('details');

  let showAllGuests = cartItem.inventory.allPassengersInfoRequired;
  app.guests = getGuestsData(criteria.rooms, showAllGuests);

  app.onContinue = function(ev) {
    if (!validateInput()) {
      return;
    }

    HotelDemo.setItem('guestinfo', {
      guests: app.guests,
      phoneNumber: app.phoneNumber,
      email: app.email
    });

    HotelDemo.redirectToPayment();
  };
})(window, document);

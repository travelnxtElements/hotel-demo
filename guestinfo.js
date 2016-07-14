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
  let criteria = HotelDemo.getItem('criteria');
  let cartItem = HotelDemo.getItem('cart-item');

  app.phoneNo = '';
  app.email = '';

  let showAllGuests = cartItem.inventory.allPassengersInfoRequired;
  app.guests = getGuestsData(criteria.rooms, showAllGuests);

  app.onContinue = function(ev) {
    HotelDemo.setItem('guestinfo', {
      guests: app.guests,
      phoneNo: app.phoneNo,
      email: app.email
    });

    HotelDemo.redirectToPayment();
  };
})(window, document);

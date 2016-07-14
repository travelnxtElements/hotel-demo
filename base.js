(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  HotelDemo.baseApiEndpoint = 'http://demo.travelnxt.com/';

  HotelDemo.getItem = function(key) {
    let search = window.location.search;
    let params = search.split('&');

    if (params && params.length > 0) {
      let value = params.find(item => item.indexOf(key) > 0);

      if (value) {
        return value.split('=')[1];
      }
    }

    let value = window.sessionStorage.getItem(`hd-${key}`);
    value = value && JSON.parse(value);

    return value;
  };

  HotelDemo.setItem = function(key, value) {
    value = JSON.stringify(value);
    window.sessionStorage.setItem(`hd-${key}`, value);
  };

  HotelDemo.genUrl = function(baseUrl, path, params) {
    params = Object.keys(params || {})
      .map(key => `${key}=${params[key]}`)
      .join('&');

    params = params ? '?' + params : params;

    return baseUrl + path + params;
  };

  function redirect(page, params) {
    let url = window.location.href.replace(/\/\w+\.html.*/, `/`);

    window.location = HotelDemo.genUrl(url, `${page}.html`, params);
  };

  HotelDemo.redirectToResults = function() {
    redirect('results', { sid: HotelDemo.getItem('sid') });
  };

  HotelDemo.redirectToDetails = function() {
    let itinerary = HotelDemo.getItem('itinerary');
    let sid = HotelDemo.getItem('sid');

    redirect('details', { sid: sid, hid: itinerary.id });
  };

  HotelDemo.redirectToGuestInfo = function() {
    redirect('guestinfo');
  };

  HotelDemo.redirectToPayment = function() {
    redirect('payment');
  };

  HotelDemo.redirectToConfirmation = function() {
    redirect('confirmation');
  };

  HotelDemo.errorHandler = function(ev) {
    let toast = document.querySelector('#toast');
    let message;

    try {
      message = ev.detail.response.status.message;
    } catch (e) {
      message = 'Something broke while handling the request';
    } finally {
      toast.text = message;
      toast.open();
    }
  };
})(window, document);

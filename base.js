(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  HotelDemo.baseApiEndpoint = 'http://qa-mystiquecode.tavisca.com/';

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

  HotelDemo.redirectToResults = function() {
    let sid = HotelDemo.getItem('sid');
    let url = window.location.href;

    window.location.href = `${url}results.html?sid=${sid}`;
  };

  HotelDemo.redirectToDetails = function() {
    let itinerary = HotelDemo.getItem('itinerary');
    let sid = HotelDemo.getItem('sid');
    let url = window.location.href.replace(/results\.html.*/, '');

    window.location.href = `${url}details.html?sid=${sid}&hid=${itinerary.id}`;
  };

  HotelDemo.redirectToConfirmation = function() {
    let rid = HotelDemo.getItem('room').id;
    let url = window.location.href.replace(/details\.html.*/, '');

    window.location.href = `${url}confirmation.html?rid=${rid}`;
  };

  HotelDemo.genUrl = function(baseUrl, path, params) {
    params = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    params = params ? '?' + params : params;

    return baseUrl + path + params;
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

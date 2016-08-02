(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let proto = window.location.protocol;
  HotelDemo.baseApiEndpoint = `${proto}//demo.travelnxt.com/`;

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

  HotelDemo.getPageUrl = function(page, params) {
    let url = window.location.href.replace(/\/\w+\.html.*/, `/`);
    page = page === '/' ? '' : `${page}.html`;

    return HotelDemo.genUrl(url, page, params);
  }

  function redirect(page, params) {
    window.location = HotelDemo.getPageUrl(page, params);
  };

  HotelDemo.redirectToResults = redirect.bind(null, 'results');
  HotelDemo.redirectToDetails = redirect.bind(null, 'details');
  HotelDemo.redirectToGuestInfo = redirect.bind(null, 'guestinfo');
  HotelDemo.redirectToPayment = redirect.bind(null, 'payment');
  HotelDemo.redirectToConfirmation = redirect.bind(null, 'confirmation');

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

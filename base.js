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
    let token = HotelDemo.getItem('token');
    let sid = HotelDemo.getItem('sid');
    let url = window.location.href;

    window.location.href = `${url}results.html?sid=${sid}&token=${token}`;
  };

  HotelDemo.genUrl = function(baseUrl, path, params) {
    params = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    params = params ? '?' + params : params;

    return baseUrl + path + params;
  };
})(window, document);

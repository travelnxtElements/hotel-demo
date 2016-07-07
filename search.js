(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;

  app.authApiEndpoint = `${baseApiEndpoint}api/Authentication/Authenticate/context`;

  app.addEventListener('dom-change', function() {
    let mysAuth = document.querySelector('t-mystique-auth');
    let search = document.querySelector('t-hotel-search');
    let provider = Polymer.dom(search).querySelector('#searchProvider');
    let toast = document.getElementById('toast');

    mysAuth.addEventListener('token-response-changed', function(ev) {
      let token;

      try {
        token = ev.detail.value.authenticationToken
      } catch (e) {
        toast.text = e.toString();
        toast.open();
      }

      HotelDemo.setItem('token', token);
      app.token = token;

      search.$.location.dataUrl = `${baseApiEndpoint}api/content/autosuggest/`;
      search.$.location.queryParams = `token=${token}`;

      provider.apiBaseUrl = baseApiEndpoint;
      provider.apiRelativeUrl = 'api/hotel/search';
      provider.authToken = token;
    });

    search.addEventListener('t-hotel-search', function(ev) {
      provider.search(ev.detail);
    });

    provider._successHandler = function(ev) {
      try {
        HotelDemo.setItem('sid', ev.detail.response.searchId);
        HotelDemo.redirectToResults();
      } catch (e) {
        toast.text = 'Bad response from api';
        toast.open();
      }
    };

    provider._errorHandler = function(ev) {
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
  });
})(window, document);

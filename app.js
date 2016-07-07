(function(window, document) {
  let app = document.getElementById('app');
  let _baseApiEndpoint = 'http://qa-mystiquecode.tavisca.com/';

  app.apiEndpoints = {
    auth: `${_baseApiEndpoint}api/Authentication/Authenticate/context`
  };

  app.addEventListener('dom-change', function() {
    let mysAuth = document.querySelector('t-mystique-auth');
    let search = document.querySelector('t-hotel-search');
    let provider = Polymer.dom(search).querySelector('#searchProvider');
    let toast = document.getElementById('toast');

    search.addEventListener('t-hotel-search', function(ev) {
      provider.search(ev.detail);
    });

    provider._successHandler = function(ev) {
      try {
        window.sessionStorage.setItem('hd-sid', ev.detail.response.searchId);
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

    mysAuth.addEventListener('token-response-changed', function(ev) {
      let token;

      try {
        token = ev.detail.value.authenticationToken
      } catch (e) {
        toast.text = e.toString();
        toast.open();
      }

      app.token = token;

      search.$.location.dataUrl = `${_baseApiEndpoint}api/content/autosuggest/`;
      search.$.location.queryParams = `token=${token}`;

      provider.apiBaseUrl = _baseApiEndpoint;
      provider.apiRelativeUrl = 'api/hotel/search';
      provider.authToken = token;
    });
  });
})(window, document);

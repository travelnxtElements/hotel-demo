(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;

  app.apiBaseUrl = baseApiEndpoint;
  app.authApiEndpoint = `${baseApiEndpoint}api/Authentication/Authenticate/context`;

  app.addEventListener('dom-change', function() {
    let search = app.$.searchComponent;
    let toast = app.$.toast;

    search.addEventListener('t-hotel-search-validate', function(ev) {
      app.searchedData = ev.detail;
      search.showProgress(true);
    });
  });

  app._successHandler = function(ev) {
    try {
      HotelDemo.setItem('sid', ev.detail.searchId);
      HotelDemo.setItem('token', app.tokenResponse.authenticationToken);
      HotelDemo.setItem('criteria', app.searchRequest);
      HotelDemo.redirectToResults();
    } catch (e) {
      toast.text = 'Bad response from search api';
      toast.open();
    }
  };

  app._errorHandler = function(ev) {
    search.showProgress(true);
    HotelDemo.errorHandler.call(app, ev);
  };
})(window, document);

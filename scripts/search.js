(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;

  app.authApiEndpoint = `${baseApiEndpoint}api/Authentication/Authenticate/context`;

  app.addEventListener('dom-change', function() {
    let mysAuth = app.$.mysAuth;
    let search = app.$.searchComponent;
    let provider = app.$.searchProvider;
    let toast = app.$.toast;

    app.apiBaseUrl = baseApiEndpoint;
    app.apiSearchUrl = 'api/hotel/search';

    // FIXME: t-mystique-auth should extract the token from response
    mysAuth.addEventListener('token-response-changed', function(ev) {
      let token;

      try {
        token = ev.detail.value.authenticationToken
      } catch (e) {
        toast.text = e.toString();
        toast.open();
      }

      HotelDemo.setItem('token', token);
      app.authToken = token;

      // FIXME: `location` is the autosuggest component
      // hotel search should expose api for this
      search.$.location.dataUrl = `${baseApiEndpoint}api/content/autosuggest/`;
      search.$.location.queryParams = `token=${token}`;
    });

    // FIXME: the event name `t-hotel-search` doesn't make any sense
    // TODO: should you have to do this wiring manually?
    search.addEventListener('t-hotel-search', function(ev) {
      provider.search(ev.detail);

      // FIXME: why was this removed from code in `t-hotel-search`
      // look at the commit `52ee94d1`
      search.$.search.label = 'SEARCHING HOTELS...';
      search.$.search.disabled = true;
    });

    provider.addEventListener('request', function(ev) {
      if (!ev.detail.body) {
        return;
      }

      HotelDemo.setItem('criteria', JSON.parse(ev.detail.body));
    });

    // FIXME: the provider expects a function by following name
    // it should fire an event which can be set up declaratively through markup
    provider._successHandler = function(ev) {
      try {
        HotelDemo.setItem('sid', ev.detail.response.searchId);
        HotelDemo.redirectToResults();
      } catch (e) {
        toast.text = 'Bad response from search api';
        toast.open();
      }
    };

    provider._errorHandler = function(ev) {
      search.$.search.label = 'SEARCH HOTELS';
      search.$.search.disabled = false;

      HotelDemo.errorHandler.call(app, ev);
    };
  });
})(window, document);
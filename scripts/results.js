(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;
  let genUrl = HotelDemo.genUrl.bind(null, baseApiEndpoint);
  let criteria = HotelDemo.getItem('criteria');

  app.loading = false;
  HotelDemo.mixinSearchRecap(app);

  app.addEventListener('dom-change', function() {
    let token = HotelDemo.getItem('token');
    let sid = HotelDemo.getItem('sid');
    let results = app.$.results;
    let selections = [
      'Name', 'Rating', 'Address', 'HeroImageUrl', 'StayDuration',
      'IsPostPaid', 'Source', 'Id', 'Deal', 'Fare'
    ];

    // FIXME: there should be a component that takes base endpoint,
    // api endpoint and query params object to generate a complete url
    // or there should be a mystique specific url generator that takes
    // product name and end point type to generate the url. This fix
    // might apply at all the places where `genUrl` is used.
    let apiEndpoint = `api/hotel/results/${sid}/rates`;
    results.dataApi = genUrl(apiEndpoint, {
      "$top": 20, token: token, "$select": selections.join(',')
    });

    apiEndpoint = `api/hotel/filter/${sid}/rates`;
    results.filterApi = genUrl(apiEndpoint, {
      token: token
    });

    apiEndpoint = `api/hotel/results/filter/${sid}/rates`;
    results.filterResultsApi = genUrl(apiEndpoint, {
      "$top": 20, token: token, "$select": selections.join(',')
    });

    // TODO: are this parameters common to any hotel results call (mystique)
    results.sortParams = [
      { "key": "Name", "value": "$orderby=Name" },
      { "key": "Rating", "value": "$orderby=Rating" , "default": true },
      { "key": "Price", "value": "$orderby=MinFare/Fare/Amount" }
    ];

    results.includeFilters = [ "Price", "Rating", "Brand", "Hotel Name" ];
    results.redirectLink = './index.html';

    results.generateList();

    // FIXME: you shouldn't have to run `generateFilter` this way
    // you should be able to pass and configure your own set of filters
    results.addEventListener('list-population', function(ev) {
      let filter = Polymer.dom(results.root);
      filter.querySelector('t-filter').generateFilter();
    });

    let singleItineraryCall = app.$.singleItineraryCall;

    results.addEventListener('item-selected', function(ev) {
      app.loading = true;

      let apiEndpoint = `api/hotel/results/${sid}/rates`;
      singleItineraryCall.url = genUrl(apiEndpoint, {
        token: token, "$filter": `Id eq '${event.detail.id}'`
      });

      singleItineraryCall.generateRequest();
    });
  });

  app.singleItinerarySuccess = function(ev) {
    let toast = app.$.toast;

    try {
      HotelDemo.setItem('itinerary', event.detail.response.inventories[0]);

      app.loading = false;
      HotelDemo.redirectToDetails();
    } catch (e) {
      toast.text = 'Bad response from itinerary api';
      toast.open();
    }
  };

  app.singleItineraryError = function(ev) {
    app.loading = false;
    HotelDemo.errorHandler.call(app);
  };
})(window, document);

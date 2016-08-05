(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);

  let criteria = HotelDemo.getItem('criteria');
  let selections = [
    'Name', 'Rating', 'Address', 'HeroImageUrl', 'StayDuration',
    'IsPostPaid', 'Source', 'Id', 'Deal', 'Fare'
  ];

  app.token = HotelDemo.getItem('token');
  app.sid = HotelDemo.getItem('sid');
  app.selections = selections.join(',');
  app.apiBaseUrl = HotelDemo.baseApiEndpoint;
  app.loading = false;
  HotelDemo.mixinSearchRecap(app);

  app.addEventListener('dom-change', function() {
    let results = app.$.results;

    // TODO: are this ,parameters common to any hotel results call (mystique)
    results.sortParams = [
      { "key": "Name", "value": "$orderby=Name" },
      { "key": "Rating", "value": "$orderby=Rating" , "default": true },
      { "key": "Price", "value": "$orderby=MinFare/Fare/Amount" }
    ];

    results.includeFilters = [ "Price", "Rating", "Brand", "Hotel Name" ];
    results.redirectLink = './index.html';

    results.generateList();

    results.addEventListener('list-population', function(ev) {
      results.generateFilter();
    });

    let singleItineraryCall = app.$.singleItineraryCall;

    results.addEventListener('item-selected', function(ev) {
      app.loading = true;
      app.selectedHotelId = event.detail.id;
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

(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  let baseApiEndpoint = HotelDemo.baseApiEndpoint;
  let genUrl = HotelDemo.genUrl;

  app.addEventListener('dom-change', function() {
    let token = HotelDemo.getItem('token');
    let sid = HotelDemo.getItem('sid');
    let results = document.querySelector('t-list');
    let selections = [
      'Name', 'Rating', 'Address', 'HeroImageUrl', 'StayDuration', 
      'IsPostPaid', 'Source', 'Id', 'Deal', 'Fare'
    ];

    let apiEndpoint = `api/hotel/results/${sid}/rates`;
    results.dataApi = genUrl(baseApiEndpoint, apiEndpoint, {
      top: 20, token: token, "$select": selections.join(',')
    });

    apiEndpoint = `api/hotel/filter/${sid}/rates`;
    results.filterApi = genUrl(baseApiEndpoint, apiEndpoint, {
      token: token
    });

    apiEndpoint = `api/hotel/results/filter/${sid}/rates`;
    results.filterResultsApi = genUrl(baseApiEndpoint, apiEndpoint, {
      top: 20, token: token, "$select": selections.join(',')
    });

    results.sortParams = [
      { "key": "Name", "value": "$orderby=Name" },
      { "key": "Rating", "value": "$orderby=Rating" , "default": true },
      { "key": "Price", "value": "$orderby=MinFare/Fare/Amount" }
    ];

    results.includeFilters = [ "Price", "Rating", "Brand", "Hotel Name" ];
    results.redirectLink = './index.html';

    results.generateList();

    results.addEventListener('list-population', function(ev) {
      let filter = Polymer.dom(document.querySelector('t-list').root);
      filter.querySelector('t-filter').generateFilter();
    });

    results.addEventListener('', function(ev) {
      let filter = Polymer.dom(document.querySelector('t-list').root);
      filter.querySelector('t-filter').generateFilter();
    });

    let toast = document.querySelector('#toast');
    let singleItineraryCall = document.querySelector('#singleItineraryCall');

    results.addEventListener('item-selected', function(ev) {
      let apiEndpoint = `api/hotel/results/${sid}/rates`;
      singleItineraryCall.url = genUrl(baseApiEndpoint, apiEndpoint, {
        token: token, "$filter": `Id eq '${event.detail.id}'`
      });

      singleItineraryCall.generateRequest();
    });
  });

  app.singleItinerarySuccess = function(ev) {
    let toast = document.querySelector('#toast');

    try {
      HotelDemo.setItem('itinerary', event.detail.response.inventories[0]);
      HotelDemo.redirectToDetails();
    } catch (e) {
      toast.text = 'Bad response from api';
      toast.open();
    }
  };

  app.singleItineraryError = HotelDemo.errorHandler.bind(app);
})(window, document);

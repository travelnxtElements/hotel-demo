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

    // results.addEventListener('item-selected', _resultSelected);
  });
})(window, document);

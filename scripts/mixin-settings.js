(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
  }

  function getThemeUrl(themeOptions) {
    let qs = themeOptions
      .map(opt => {
        let value = encodeURIComponent(opt.value + (opt.unit || ''));
        let key = encodeURIComponent(opt.name);

        return `${key}=${value}`;
      });

    qs = qs.join('&');

    let proto = window.location.protocol;
    return `${proto}://theme-atomproject.rhcloud.com/theme.html?` + qs;
  }

  HotelDemo.mixinSettings = function(app) {
    app.redirectToCustomize = function() {
      HotelDemo.redirectToCustomize();
    };

    app.logoUrl = HotelDemo.getItem('logo-url') || 'https://s3.amazonaws.com/tavisca.samplebucket/124850/Images/c9154425-43be-4a7a-9d44-463c97a58040';
    app.supportEmail = HotelDemo.getItem('support-email') || 'swat@tavisca.com';
    app.supportPhone = HotelDemo.getItem('support-phone') || '800-459-1597';
    app.tosUrl = HotelDemo.getItem('tos-url') || 'http://www.bluegreenvacations.com/terms-of-use';
    app.policyUrl = HotelDemo.getItem('policy-url') || 'http://www.bluegreenvacations.com/privacy-policy';
    app.theme = HotelDemo.getItem('theme') || 0;
    app.themeOptions = HotelDemo.getItem('theme-options');

    app.themes = [{
      label: 'Default',
      url: 'components/theme-default.html'
    }, {
      label: 'Red',
      url: 'components/theme-red.html'
    }, {
      label: 'Purple',
      url: 'components/theme-purple.html'
    }, {
      label: 'Custom',
      url: function() { return getThemeUrl(app.themeOptions); }
    }];

    app.switchTheme = (function() {
      let _count = 0;

      function appendCount(url) {
        let c = url.indexOf('?') === -1 ? '?' : '&';
        return `${url}${c}v=${_count++}`;
      }

      return function(idx) {
        if (idx < 0 || idx > app.themes.length) {
          return;
        }

        let themeUrl = app.themes[idx].url;
        themeUrl = !isString(themeUrl) ? themeUrl() : themeUrl;

        Polymer.Base.importHref(appendCount(themeUrl));
      };
    })();

    app.switchTheme(app.theme);
  };
})(window, document);

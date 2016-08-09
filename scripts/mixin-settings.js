(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

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

    let _themes = [
      'components/theme-default.html',
      'components/theme-red.html',
      'components/theme-purple.html'
    ];

    app.themeUrl = function(idx) {
      return _themes[idx];
    };

    app.getThemeUrl = (function() {
      let _count = 0;

      return function(themeOptions) {
        let qs = themeOptions
          .map(opt => {
            let value = encodeURIComponent(opt.value + (opt.unit || ''));
            let key = encodeURIComponent(opt.name);

            return `${key}=${value}`;
          });
        
        qs.push(`v=${_count++}`);
        qs = qs.join('&');

        let proto = window.location.protocol;
        return `${proto}//theme-atomproject.rhcloud.com/theme.html?` + qs;
      };
    })();

    app.switchTheme = (function() {
      let _count = 0;

      return function(idx) {
        let themes = _themes.map(theme => `${theme}?v=${_count}`);
        _count++;
        Polymer.Base.importHref(themes[idx]);
      };
    })();

    if (!app.themeOptions) {
      app.switchTheme(app.theme);
    } else {
      Polymer.Base.importHref(app.getThemeUrl(app.themeOptions));
    }
  };
})(window, document);

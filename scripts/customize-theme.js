(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  function toThemeOptions(themeFile) {
    return themeFile.split('\n')
      .filter(line => /--[\w\-]+/.test(line))
      .map(line => {
        let [, name, value] = line.match(/(--[\w\-]+)\s*:\s*([^;]+);/);

        let label = name.replace(/-+(\w)/g, (m, l) => ' ' + l.toUpperCase());
        label = label.trim();
        name = name.trim();
        value = value.trim();

        let isColor = /#|rgb|hsl/.test(value);
        let numMatch = value.match(/([0-9]+)(px|em|rem|vw|vh|vmin|vmax|%)/);
        let unit, isNumber = numMatch !== null;

        if (isNumber) {
          value = numMatch[1];
          unit = numMatch[2];
        }

        return {
          name: name,
          label: label,
          value: value,
          unit: unit,
          isColor: isColor,
          isNumber: isNumber,
          isString: !(isColor || isNumber)
        };
      });
  }

  function getPrevUrl() {
    let url = document.referrer;

    if (url === window.location.href) {
      return HotelDemo.getPageUrl('/');
    }

    return url;
  }

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);

  let themeOptions = HotelDemo.getItem('theme-options');

  app.defaultThemeUrl = app.themes[0].url;
  app.searchPageUrl = getPrevUrl();

  app.changeTheme = function(ev) {
    let theme = ev.detail.value;
    app.switchTheme(theme);
  };

  app.hideCustom = function(theme) {
    return theme !== 3;
  };

  app.parseTheme = function(ev) {
    let themeFile = ev.detail.response;
    app.themeOptions = toThemeOptions(themeFile);
  };

  app.applyTheme = function() {
    let brandingInputs = document.querySelectorAll('#branding > t-input');

    brandingInputs = Array.from(brandingInputs);
    brandingInputs.forEach(el => {
      let key = el.getAttribute('data-key');
      let value = el.value;

      HotelDemo.setItem(key, value);
    });

    HotelDemo.setItem('theme', app.theme);
    HotelDemo.setItem('theme-options', app.themeOptions);

    app.switchTheme(app.theme);
  };

  app.downloadTheme = function(ev) {
    let optionsStr = app.themeOptions
      .map(opt => `    ${opt.name}: ${opt.value}${opt.unit || ''};`)
      .join('\n');

    let theme = `<style is="custom-style">
  :root {
${optionsStr}
  }
</style>
`;
    theme = new Blob([theme], {type: 'text/plain;charset=utf-8'});
    saveAs(theme, 'theme-default.html');
  };
})(window, document);

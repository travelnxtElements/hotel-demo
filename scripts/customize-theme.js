(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  let app = document.getElementById('app');
  HotelDemo.mixinSettings(app);

  let themeOptions = HotelDemo.getItem('theme-options');

  app.searchPageUrl = document.referrer;

  app.changeTheme = function(ev) {
    let theme = ev.detail.value;
    app.switchTheme(theme);
    HotelDemo.setItem('theme', theme);
  };

  app.parseTheme = function(ev) {
    let resp = ev.detail.response;

    app.themeOptions = resp.split('\n')
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
  };

  app.applyTheme = function() {
    HotelDemo.setItem('theme-options', app.themeOptions);
    Polymer.Base.importHref(app.getThemeUrl(app.themeOptions));
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

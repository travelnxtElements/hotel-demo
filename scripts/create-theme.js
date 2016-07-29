(function(window, document) {
  window.HotelDemo = window.HotelDemo || {};
  let HotelDemo = window.HotelDemo;

  app.searchPageUrl = HotelDemo.getPageUrl('/');

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

        let isColor = /#|(rgb)|(hsl)/.test(value);
        let isNumber = /[0-9]+px/.test(value);

        if (isNumber) {
          value = value.match(/[0-9]+/)[0];
        }

        return {
          name: name,
          label: label,
          value: value,
          isColor: isColor,
          isNumber: isNumber,
          isString: !(isColor || isNumber)
        }
      });
  };

  app.downloadTheme = function(ev) {
    let $ = document.querySelectorAll.bind(document);
    let colors = Array.from($('#themeOptions t-colorpicker'));
    let inputs = Array.from($('#themeOptions t-input'));

    colors = colors.map(node => {
      return {
        name: node.getAttribute('data-name'),
        value: node.color
      };
    });

    inputs = inputs.map(node => {
      return {
        name: node.getAttribute('data-name'),
        value: node.value
      };
    });

    let optionsStr = colors.concat(inputs)
      .map(opt => `    ${opt.name}: ${opt.value};`)
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

var getByCategory = (cat = []) => {
  var parents = $('.content_template');
  var files = [];
  parents.find('h3').each((i, e) => {
    if (cat.indexOf($(e).text()) !== -1) {
      const divs = $(e).next().find('li > div:last-child').toArray();
      divs.forEach(el => {
        const a = $(el).find('a');
        var path = a.attr('href');
        if (path) {
          const name = a.text().trim().split('/').join('_').split("'").join('');
          files.push({
            folder: $(e).text(),
            name: name + '.pdf',
            url: path[0] === '/' ? window.location.origin + path : path,
          });
        }
      });
    }
  });
  copy(files);
};

getByCategory(["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"]);
// getByCategory(["2020", "2019", "2018", "2017"]);

var getAllSetTitle = (title) => {
  var files = [];
  const divs = $('ul.invlist_file > li > div:last-child').toArray();
  divs.forEach(el => {
    const a = $(el).find('a');
    var path = a.attr('href');
    if (path) {
      const name = a.text().trim().split('/').join('_').split("'").join('');
      files.push({
        folder: title,
        name: name + '.pdf',
        url: path[0] === '/' ? window.location.origin + path : path,
      });
    }
  });
  copy(files);
};

getAllSetTitle('finance');
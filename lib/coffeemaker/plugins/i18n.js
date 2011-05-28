var $cm = require('../core.js');

var check = function (model) {
  var index, primaryLang;
  for ( var lang in model) {
    if (!primaryLang) {
      $cm.info(lang, "\t[i18n]");
      primaryLang = lang;
      continue;
    }
    $cm.info(lang, "\t\t[checking]");
    var translations = model[primaryLang];
    for ( var translation in translations) {
      if (model[lang][translation] === undefined) {
        $cm.warning(lang + " => " + translation, "\t\t\t(missing) ");
      }
    }
  }
};

exports.check = check;
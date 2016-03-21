(function(){

  var options = INSTALL_OPTIONS;

  if (!options.token) {
    return;
  }

  function getDefault(label) {
    // Fail fast simple debug
    return "[ch-error: missing label "+label+" ]";
  }

  function getText(preview, token, label, lang, element) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        element.innerHTML = xhttp.responseText;
      } else if (xhttp.readyState == 4 && xhttp.status == 404) {
        element.innerHTML = getDefault(label);
      }
    }

    var url = "//app.copyhawk.co/api/";
    if (preview)
      url += 'p/staging.';
    url += token + "/" + label + "?lang=" + lang + "&cache=" + Math.random().toString(36);

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.send();
  }

  function loadTags() {
    var tags = document.querySelectorAll('c-hawk');

    var preview = options.advancedOptions.environment === 'staging';

    if (tags) {
      for (var i=tags.length; i--;){
        getText(preview, options.token, tags[i].dataset.label, options.advancedOptions.defaultLanguage, tags[i]);
      }
    }
  }

  var regionEls = [];
  function writeTags() {
    for (var i=options.regions.length; i--;){
      var region = options.regions[i];

      regionEls[i] = Eager.createElement(region.location, regionEls[i]);

      var child = document.createElement('c-hawk');
      child.dataset.label = region.label;
      regionEls[i].appendChild(child);
    }
  }

  function render() {
    writeTags();
    loadTags();
  }

  document.addEventListener('DOMContentLoaded', render);

})();

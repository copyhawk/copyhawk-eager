(function(){

  var options = INSTALL_OPTIONS;

  if (!options.token) {
    return;
  }

  function getDefault(label) {
    // Fail fast simple debug
    return "[ch-error: missing label "+label+" ]";
  }

  function getText(label, element) {
    if (!label || !element)
      return;

    var staging = options.advancedOptions.environment === 'staging';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        element.innerHTML = xhttp.responseText;
      } else if (xhttp.readyState == 4 && xhttp.status == 404) {
        element.innerHTML = getDefault(label);
      }
    }

    var url = "//app.copyhawk.co/api/";
    if (staging)
      url += 'p/staging.';
    url += options.token + "/" + label + "?lang=" + (options.advancedOptions.defaultLanguage || 'en') + "&cache=" + Math.random().toString(36);

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.send();
  }

  var regionEls = [];
  function writeTag(i){
    var region = options.regions[i];
    regionEls[i] = Eager.createElement(region.location, regionEls[i]);

    var child = document.createElement('c-hawk');
    child.setAttribute('data-label', region.label);
    regionEls[i].appendChild(child);

    return child;
  }

  var writeAttempts = 0;
  function writeTags() {
    var allWritten = true;
    writeAttempts++;

    for (var i=options.regions.length; i--;){
      var region = options.regions[i];

      if (region.written)
        continue;

      if (document.querySelector(region.location.selector)){
        tag = writeTag(i);
        getText(tag.getAttribute('data-label'), tag);

        region.written = true;
      } else {
        allWritten = false;
      }
    }

    if (!allWritten && writeAttempts < 10){
      setTimeout(writeTags, 50 * writeAttempts);
    }
  }

  function render() {
    writeTags();
  }

  document.addEventListener('DOMContentLoaded', render);

  if (document.registerElement){
    var cHawkProto = Object.create(HTMLElement.prototype);
    cHawkProto.createdCallback = function() {
      getText(this.dataset.label, this);
    }
    document.registerElement("c-hawk", {prototype: cHawkProto});
  }

})();

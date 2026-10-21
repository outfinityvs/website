(function () {
  var websiteId = "116422cd-b0f4-49b9-8836-1350fbda0faf";
  var source = "https://cloud.umami.is/script.js";

  if (document.querySelector('script[data-website-id="' + websiteId + '"]')) return;

  var script = document.createElement("script");
  script.defer = true;
  script.src = source;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
})();

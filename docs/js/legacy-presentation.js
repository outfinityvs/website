(function () {
  var original = document.querySelector('main.page-main');
  if (!original || document.body.classList.contains('presentation-page') || document.querySelector('outfinity-presentation')) return;

  var title = (document.querySelector('title') || {}).textContent || 'Outfinity';
  title = title.replace(/\s*\|\s*Outfinity\s*$/i, '').trim();
  var source = original.cloneNode(true);
  var candidates = Array.from(source.querySelectorAll('section')).map(function (section) {
    var heading = section.querySelector('h1,h2,h3');
    var copy = Array.from(section.querySelectorAll('p')).map(function (p) { return p.textContent.trim(); }).filter(Boolean).join(' ');
    return { heading: heading ? heading.textContent.trim() : '', copy: copy };
  }).filter(function (item) { return item.heading || item.copy; });
  var intro = candidates[0] || { heading: title, copy: 'Explore the essential ideas, then open the full article when you need the detail.' };
  var articleLead = intro.copy || 'Explore the essential ideas, then open the full article when you need the detail.';
  var related = Array.from(source.querySelectorAll('.continue-exploring a, .related-card[href]')).filter(function (link) { return link.getAttribute('href') && !/^https?:\/\//.test(link.getAttribute('href')); }).slice(0, 3);
  var contactUrl = 'https://docs.google.com/forms/d/16HH8lep0hXj5cGq91cereklkb5CxkK5x3soTXcdAp5A/';
  var escape = function (value) { var element = document.createElement('div'); element.textContent = value || ''; return element.innerHTML; };
  var card = function (item, index) {
    var detail = item.copy || item.heading || articleLead;
    return '<button class="visual-node node-box auto-standard-node' + (detail.length > 190 ? ' auto-standard-node--long' : '') + (index % 2 ? ' visual-node--gold' : '') + '" data-title="' + escape(item.heading || ('Key idea ' + (index + 1))) + '" data-detail="' + escape(detail) + '"><span class="visual-node__tag">Essential ' + String(index + 1).padStart(2, '0') + '</span><span class="visual-node__title">' + escape(item.heading || 'Key idea') + '</span><span class="visual-node__text">' + escape(detail.slice(0, 230)) + '</span></button>';
  };
  var connector = function (count) {
    if (count === 3) return '<svg class="diagram-lines" viewBox="0 0 1420 600" aria-hidden="true"><path class="diagram-line" d="M360 300 L530 300 M890 300 L1060 300"/></svg>';
    if (count === 2) return '<svg class="diagram-lines" viewBox="0 0 1420 600" aria-hidden="true"><path class="diagram-line" d="M580 300 L840 300"/></svg>';
    return '';
  };
  var chapterItems = candidates.slice(0, 9);
  while (chapterItems.length < 3) chapterItems.push(intro);
  var groupCount = Math.min(3, Math.max(2, Math.ceil(chapterItems.length / 3)));
  var groupSize = Math.ceil(chapterItems.length / groupCount);
  var essenceSlides = Array.from({ length: groupCount }, function (_, index) {
    var group = chapterItems.slice(index * groupSize, (index + 1) * groupSize);
    var lead = group[0] || intro;
    var cards = group.map(function (item, cardIndex) { return card(item, index * groupSize + cardIndex); }).join('');
    return '<section class="deck-slide" id="chapter-' + (index + 1) + '"><header class="slide-header auto-standard-header"><div class="slide-title"><p class="auto-kicker">Essentials ' + String(index + 1).padStart(2, '0') + '</p><h2>' + escape(lead.heading || 'Essential ideas') + '</h2><p>' + escape((lead.copy || articleLead).slice(0, 310)) + '</p></div></header><div class="diagram auto-standard-diagram auto-standard-diagram--' + group.length + '">' + connector(group.length) + cards + '</div></section>';
  }).join('');
  var exploreCards = related.length ? related.map(function (link, index) {
    var heading = (link.querySelector('h3') || link).textContent.trim();
    var copy = (link.querySelector('p') || {}).textContent || 'Open the related presentation.';
    return '<a class="visual-node node-box auto-standard-node' + (index % 2 ? ' visual-node--gold' : '') + '" href="' + escape(link.getAttribute('href')) + '"><span class="visual-node__tag">Related ' + String(index + 1).padStart(2, '0') + '</span><span class="visual-node__title">' + escape(heading) + '</span><span class="visual-node__text">' + escape(copy) + '</span></a>';
  }).join('') : '<button class="visual-node node-box auto-standard-node" data-title="Full article" data-detail="Open View Article for the complete source material and supporting detail."><span class="visual-node__tag">Detail</span><span class="visual-node__title">Read the article</span><span class="visual-node__text">The full editorial content remains available in this presentation.</span></button>';
  var exploreCount = related.length || 1;

  document.body.className = 'presentation-page presentation-page--auto';
  var legacyFooter = document.querySelector('footer');
  if (legacyFooter) legacyFooter.remove();
  original.remove();
  var viewport = document.createElement('main');
  viewport.className = 'deck-viewport';
  viewport.innerHTML = '<outfinity-presentation class="deck-canvas" id="auto-presentation" data-deck-width="1600" data-deck-height="900" data-animation="capital-orbits" data-article-template="auto-presentation-article">' +
    '<section class="deck-slide cover auto-cover is-active" id="start"><header class="auto-slide-header"><p class="auto-kicker">Outfinity presentation</p><h1>' + escape(title) + '</h1><p>' + escape(articleLead.slice(0, 310)) + '</p></header><div class="cover__visual" aria-hidden="true"><outfinity-cover></outfinity-cover></div></section>' +
    essenceSlides +
    '<section class="deck-slide auto-explore" id="continue-exploring"><header class="slide-header auto-standard-header"><div class="slide-title"><p class="auto-kicker">Continue exploring</p><h2>Related presentations</h2><p>Move directly to another concise topic presentation.</p></div></header><div class="diagram auto-standard-diagram auto-standard-diagram--' + exploreCount + '">' + connector(exploreCount) + exploreCards + '</div></section>' +
    '<section class="deck-slide auto-contact" id="contact"><header class="auto-slide-header"><p class="auto-kicker">Contact</p><h2>Start with a focused conversation</h2><p>Bring your capability, research base, investment interest or venture question. Outfinity routes the conversation toward the most useful next step.</p><a class="auto-contact-link" href="' + contactUrl + '" target="_blank" rel="noreferrer">Open contact form</a></header></section>' +
    '<button class="edge-nav edge-nav--back" data-presentation-edge-back type="button" aria-label="Previous slide"><svg viewBox="0 0 58 58"><path d="M31 17 19 29l12 12M20 29h21"/></svg></button><button class="edge-nav edge-nav--next" data-presentation-edge-next type="button" aria-label="Next slide"><svg viewBox="0 0 58 58"><path d="M27 17 39 29 27 41M38 29H17"/></svg></button><div class="presentation-footer"><a class="deck-credit" href="https://www.outfinity.ch" target="_blank" rel="noopener">Outfinity Venture Studio <span>(www.outfinity.ch)</span></a></div><template id="auto-presentation-article"></template></outfinity-presentation>';
  var siteNav = document.querySelector('nav.nav');
  if (!siteNav) return;
  siteNav.insertAdjacentElement('afterend', document.createElement('nav'));
  var controls = siteNav.nextElementSibling;
  controls.className = 'contents'; controls.setAttribute('data-presentation-controls', 'auto-presentation'); controls.setAttribute('aria-label', 'Presentation controls');
  controls.innerHTML = '<div class="contents__inner"><div class="deck-nav__left"><button class="deck-nav__button" data-presentation-home type="button" aria-label="First slide">⌂</button><button class="deck-nav__button" data-presentation-back type="button" aria-label="Previous slide">‹</button></div><div class="deck-nav__status"><span class="deck-nav__count" data-presentation-count>01 / 05</span><div class="deck-nav__progress" data-presentation-progress></div></div><div class="deck-nav__right"><button class="deck-nav__button" data-presentation-next type="button" aria-label="Next slide">›</button></div></div>';
  viewport.querySelector('#auto-presentation-article').content.appendChild(source);
  document.body.appendChild(viewport);
  if (window.customElements && customElements.get('outfinity-presentation')) customElements.upgrade(viewport);
}());

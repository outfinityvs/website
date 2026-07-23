(function () {
  /* All presentation pages share this stylesheet.  Refresh its explicit version
     when the component changes so an older green/article-popup shell cannot
     survive a deploy through the browser cache. */
  document.querySelectorAll('link[href*="css/presentation.css"]').forEach(function (link) {
    var href = new URL(link.getAttribute('href'), document.baseURI);
    href.searchParams.set('v', '20260723-controls-books');
    link.href = href.href;
  });

  var COVER_SVG = '<svg viewBox="0 0 560 560" role="img" aria-label="Outfinity research, venture and capital system"><defs><radialGradient id="oc-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#00cfc8" stop-opacity=".13"/><stop offset=".58" stop-color="#00cfc8" stop-opacity=".035"/><stop offset="1" stop-color="#00cfc8" stop-opacity="0"/></radialGradient><radialGradient id="oc-core" cx="42%" cy="36%" r="70%"><stop stop-color="#15302f"/><stop offset=".52" stop-color="#0a1a1a"/><stop offset="1" stop-color="#061111"/></radialGradient><linearGradient id="oc-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00cfc8"/><stop offset=".5" stop-color="#16a6a1"/><stop offset="1" stop-color="#ffc928"/></linearGradient><filter id="oc-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="280" cy="280" r="238" fill="url(#oc-halo)"/><g class="cover-orbit" fill="none"><ellipse cx="280" cy="280" rx="224" ry="154" stroke="#00cfc8" stroke-opacity=".13" stroke-width="1" stroke-dasharray="3 15" transform="rotate(-17 280 280)"/><circle cx="280" cy="56" r="4" fill="#ffc928" filter="url(#oc-glow)"/></g><g class="cover-orbit cover-orbit--reverse" fill="none"><ellipse cx="280" cy="280" rx="172" ry="231" stroke="#ffc928" stroke-opacity=".095" stroke-width="1" stroke-dasharray="17 21" transform="rotate(29 280 280)"/></g><g fill="none" stroke-width="1.5" stroke-linecap="round"><path class="cover-flow" d="M202 254 C176 241 153 221 136 197" stroke="#00cfc8"/><path class="cover-flow" d="M358 254 C385 238 410 216 424 197" stroke="#00cfc8"/><path class="cover-flow" d="M280 356 C280 380 280 405 280 423" stroke="#ffc928"/></g><g class="cover-planet"><ellipse cx="116" cy="178" rx="57" ry="16" fill="none" stroke="#00cfc8" stroke-opacity=".32" transform="rotate(-18 116 178)"/><circle cx="116" cy="178" r="43" fill="#0b2221" stroke="#00cfc8" stroke-opacity=".62"/><text x="116" y="182" fill="#d9fffd" font-size="10" text-anchor="middle">RESEARCH</text></g><g class="cover-planet cover-planet--2"><ellipse cx="444" cy="178" rx="52" ry="15" fill="none" stroke="#00cfc8" stroke-opacity=".32" transform="rotate(25 444 178)"/><circle cx="444" cy="178" r="40" fill="#0b2221" stroke="#00cfc8" stroke-opacity=".62"/><text x="444" y="182" fill="#d9fffd" font-size="10" text-anchor="middle">VENTURE</text></g><g class="cover-planet cover-planet--3"><ellipse cx="280" cy="450" rx="70" ry="19" fill="none" stroke="#ffc928" stroke-opacity=".38" transform="rotate(16 280 450)"/><circle cx="280" cy="450" r="49" fill="#201d10" stroke="#ffc928" stroke-opacity=".68"/><text x="280" y="454" fill="#fff1ba" font-size="10" text-anchor="middle">CAPITAL</text></g><g class="cover-core"><circle cx="280" cy="280" r="96" fill="url(#oc-core)" stroke="url(#oc-gradient)" stroke-width="1.6"/><g class="cover-core__hexagon"><path d="M280 236 L318 258 L318 302 L280 324 L242 302 L242 258 Z" fill="none" stroke="#f7f9f9" stroke-opacity=".22" stroke-width="1.2"/><path d="M280 280 L280 236 M280 280 L318 302 M280 280 L242 302" fill="none" stroke="#f7f9f9" stroke-opacity=".14"/><circle cx="280" cy="236" r="4" fill="#00cfc8"/><circle cx="318" cy="302" r="4" fill="#ffc928"/><circle cx="242" cy="302" r="4" fill="#00cfc8"/></g></g></svg>';
  var coverSourcePromise;
  var CONTROL_ICONS = {
    home: '<svg class="deck-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 10.5 12 3.8l8.5 6.7V21h-6v-6h-5v6h-6Z"/></svg>',
    back: '<svg class="deck-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg class="deck-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7"/></svg>',
    fullscreen: '<svg class="deck-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5"/></svg>'
  };

  function normalizeControlIcon(button, icon) {
    if (!button || !CONTROL_ICONS[icon]) return;
    button.innerHTML = CONTROL_ICONS[icon];
    button.dataset.presentationIcon = icon;
  }

  function pageLabelFromFilename() {
    var pathname = decodeURIComponent(window.location.pathname || '');
    var filename = pathname.split('/').pop() || '';
    return filename
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase() || 'PRESENTATION';
  }

  function exactCoverSvg() {
    if (coverSourcePromise) return coverSourcePromise;
    var script = Array.from(document.scripts).find(function (item) { return /(?:^|\/)js\/presentation\.js/.test(item.src || ''); });
    var sourceUrl = script ? new URL('../assets/outfinity-cover.svg', script.src) : new URL('assets/outfinity-cover.svg', document.baseURI);
    coverSourcePromise = window.fetch(sourceUrl).then(function (response) {
      if (!response.ok) throw new Error('Cover unavailable');
      return response.text();
    }).then(function (source) {
      var svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
      return svg && svg.nodeName.toLowerCase() === 'svg' ? svg.outerHTML : COVER_SVG;
    }).catch(function () { return COVER_SVG; });
    return coverSourcePromise;
  }

  class OutfinityCover extends HTMLElement {
    connectedCallback() {
      if (!this.dataset.ready) {
        this.dataset.ready = 'true';
        this.innerHTML = COVER_SVG;
        var self = this;
        exactCoverSvg().then(function (svg) { if (self.isConnected) self.innerHTML = svg; });
      }
    }
  }

  customElements.define('outfinity-cover', OutfinityCover);

  class OutfinityPresentation extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready === 'true') return;
      this.dataset.ready = 'true';
      this.slides = Array.from(this.children).filter(function (node) {
        return node.classList && node.classList.contains('deck-slide') && !node.hasAttribute('data-presentation-hidden');
      });
      if (!this.slides.length) return;

      this.viewport = this.closest('.deck-viewport');
      this.current = 0;
      this.detailTrigger = null;
      this.upgradeCovers();
      this.bindControls();
      this.ensureDetailOverlay();
      this.ensureArticleOverlay();
      this.ensureSiteFooter();
      this.normalizeDeckCredit();
      this.ensureViewMore();
      this.bindDetails();
      this.bindKeyboard();
      this.bindTouchNavigation();
      this.bindResize();

      var initial = this.slides.findIndex(function (slide) {
        return slide.id && ('#' + slide.id) === location.hash;
      });
      this.show(initial >= 0 ? initial : 0, false);
      if (initial >= 0) {
        var resetInitialHashScroll = function () { window.scrollTo(0, 0); };
        window.requestAnimationFrame(resetInitialHashScroll);
        window.setTimeout(resetInitialHashScroll, 0);
        window.setTimeout(resetInitialHashScroll, 250);
        if (document.readyState !== 'complete') window.addEventListener('load', resetInitialHashScroll, { once: true });
      }
    }

    bindControls() {
      var id = this.id;
      var controls = document.querySelector('[data-presentation-controls="' + id + '"]') || document;
      this.home = controls.querySelector('[data-presentation-home]');
      this.back = controls.querySelector('[data-presentation-back]');
      this.next = controls.querySelector('[data-presentation-next]');
      this.fullscreen = controls.querySelector('[data-presentation-fullscreen]');
      this.count = controls.querySelector('[data-presentation-count]');
      this.progress = controls.querySelector('[data-presentation-progress]');
      this.edgeBack = this.querySelector('[data-presentation-edge-back]');
      this.edgeNext = this.querySelector('[data-presentation-edge-next]');

      normalizeControlIcon(this.home, 'home');
      normalizeControlIcon(this.back, 'back');
      normalizeControlIcon(this.next, 'next');
      normalizeControlIcon(this.fullscreen, 'fullscreen');

      if (this.home && this.home.parentElement) {
        var pageTitle = controls.querySelector('[data-presentation-page-title]');
        if (!pageTitle) {
          pageTitle = document.createElement('span');
          pageTitle.className = 'deck-nav__page-title';
          pageTitle.setAttribute('data-presentation-page-title', '');
          this.home.insertAdjacentElement('afterend', pageTitle);
        }
        pageTitle.textContent = pageLabelFromFilename();
      }

      if (this.progress) {
        var self = this;
        this.progress.innerHTML = this.slides.map(function (slide, index) {
          var label = slide.dataset.navLabel || slide.getAttribute('aria-label') || slide.id || ('slide ' + String(index + 1));
          return '<button class="deck-nav__dot" type="button" data-presentation-index="' + index + '" aria-label="Go to ' + label + '"></button>';
        }).join('');
        this.progress.querySelectorAll('[data-presentation-index]').forEach(function (button) {
          button.addEventListener('click', function () { self.show(Number(button.dataset.presentationIndex)); });
        });
      }

      var self = this;
      if (this.home) this.home.addEventListener('click', function () { self.show(0); });
      if (this.back) this.back.addEventListener('click', function () { self.show(self.current - 1); });
      if (this.next) this.next.addEventListener('click', function () { self.show(self.current + 1); });
      if (this.edgeBack) this.edgeBack.addEventListener('click', function () { self.show(self.current - 1); });
      if (this.edgeNext) this.edgeNext.addEventListener('click', function () { self.show(self.current + 1); });
      if (this.fullscreen) this.fullscreen.addEventListener('click', function () {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        else document.exitFullscreen && document.exitFullscreen();
      });
    }

    upgradeCovers() {
      this.querySelectorAll('.cover__visual').forEach(function (visual) {
        if (visual.querySelector('outfinity-cover')) return;
        visual.replaceChildren(document.createElement('outfinity-cover'));
      });
    }

    ensureSiteFooter() {
      var script = Array.from(document.scripts).find(function (item) { return /(?:^|\/)js\/presentation\.js/.test(item.src || ''); });
      var base = script ? new URL(script.src, document.baseURI) : new URL('js/presentation.js', document.baseURI);
      base.pathname = base.pathname.replace(/js\/presentation\.js$/, '');
      var href = function (file) { return new URL(file, base).href; };
      var footer = document.querySelector('.presentation-site-footer');
      if (!footer && document.querySelector('body.presentation-page > footer.footer')) return;
      var isNew = !footer;
      if (!footer) footer = document.createElement('footer');
      footer.className = 'presentation-site-footer';
      footer.innerHTML = '<div><p>Outfinity Venture Validation Studio - Research-backed AI venture formation.</p><nav aria-label="Footer navigation"><a href="' + href('legal-disclaimer.html') + '">Legal Disclaimer</a><a href="' + href('privacy-policy.html') + '">Privacy Policy</a><a href="' + href('imprint.html') + '">Imprint</a><a href="' + href('terms.html') + '">Terms</a><a href="' + href('cookies.html') + '">Cookies</a><a href="https://quiz.outfinity.ch" target="_blank" rel="noreferrer">Quizzes</a></nav></div>';
      if (isNew) (this.viewport || this).insertAdjacentElement('afterend', footer);
    }

    normalizeDeckCredit() {
      this.querySelectorAll('.presentation-footer .deck-credit[href*="outfinity.ch"]').forEach(function (credit) {
        credit.innerHTML = 'Outfinity Venture Studio&nbsp;<span>[www.outfinity.ch]</span>';
      });
    }

    ensureViewMore() {
      var footer = this.querySelector('.presentation-footer');
      if (!footer) return;
      if (this.querySelector('[data-title][data-detail]') && !footer.querySelector('.presentation-detail-hint')) {
        var hint = document.createElement('p');
        hint.className = 'presentation-detail-hint';
        hint.textContent = this.dataset.detailHint || 'Click any element for details';
        footer.appendChild(hint);
      }
      if (this.querySelector('.presentation-view-more')) return;
      var articleTemplate = this.getArticleTemplate();
      var articleUrl = this.dataset.articleUrl;
      var href = this.dataset.viewMoreHref;
      if (!articleTemplate && !articleUrl && !href) return;
      var link = document.createElement(articleTemplate || articleUrl ? 'button' : 'a');
      link.className = 'presentation-view-more';
      if (articleTemplate) {
        link.type = 'button';
        link.addEventListener('click', this.openArticle.bind(this, articleTemplate, link));
      } else if (articleUrl) {
        link.type = 'button';
        link.addEventListener('click', this.openArticleUrl.bind(this, articleUrl, link));
      } else {
        link.href = href;
      }
      link.textContent = this.dataset.viewMoreLabel || 'View Article …';
      link.setAttribute('data-presentation-view-more', '');
      footer.appendChild(link);
    }

    ensureDetailOverlay() {
      this.overlay = this.querySelector('.detail-overlay');
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'detail-overlay';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');
        this.overlay.setAttribute('aria-hidden', 'true');
        this.overlay.innerHTML = '<div class="detail-panel"><button class="detail-close" type="button" aria-label="Close detail">×</button><p class="detail-panel__eyebrow">Context</p><h3></h3><p></p></div>';
        this.appendChild(this.overlay);
      }
      this.detailTitle = this.overlay.querySelector('h3, #detail-title');
      this.detailCopy = this.overlay.querySelector('p:not(.detail-panel__eyebrow), #detail-copy');
      this.detailPanel = this.overlay.querySelector('.detail-panel');
      this.detailClose = this.overlay.querySelector('.detail-close');
      var self = this;
      if (this.detailClose) this.detailClose.addEventListener('click', function () { self.closeDetail(); });
      this.overlay.addEventListener('click', function (event) { if (event.target === self.overlay) self.closeDetail(); });
    }

    ensureArticleOverlay() {
      this.articleOverlay = this.querySelector('.article-overlay');
      if (!this.articleOverlay) {
        this.articleOverlay = document.createElement('div');
        this.articleOverlay.className = 'article-overlay';
        this.articleOverlay.setAttribute('role', 'dialog');
        this.articleOverlay.setAttribute('aria-modal', 'true');
        this.articleOverlay.setAttribute('aria-hidden', 'true');
        this.articleOverlay.innerHTML = '<article class="article-panel"><button class="article-close" type="button" aria-label="Close article">×</button><h1 class="article-panel__title"></h1><div class="article-panel__content"></div></article>';
        this.appendChild(this.articleOverlay);
      }
      this.articleContent = this.articleOverlay.querySelector('.article-panel__content');
      this.articleTitleElement = this.articleOverlay.querySelector('.article-panel__title');
      this.articleClose = this.articleOverlay.querySelector('.article-close');
      var self = this;
      if (this.articleClose) this.articleClose.addEventListener('click', function () { self.closeArticle(); });
      this.articleOverlay.addEventListener('click', function (event) { if (event.target === self.articleOverlay) self.closeArticle(); });
    }

    getArticleTemplate() {
      if (this.dataset.articleTemplate) return this.dataset.articleTemplate;
      var source = this.querySelector('template.presentation-article-source, template.presentation-article, article.presentation-article-source, article.presentation-article');
      if (!source) return '';
      if (!source.id) source.id = (this.id || 'outfinity-presentation') + '-article';
      return source.id;
    }

    bindDetails() {
      var self = this;
      this.querySelectorAll('[data-title][data-detail]').forEach(function (node) {
        node.addEventListener('click', function () { self.openDetail(node); });
      });
    }

    openDetail(node) {
      this.detailTrigger = node;
      if (this.detailTitle) this.detailTitle.textContent = node.dataset.title;
      if (this.detailCopy) this.detailCopy.textContent = node.dataset.detail;
      var href = node.dataset.viewMore;
      var articleTemplate = node.dataset.articleTemplate;
      var existing = this.detailPanel && this.detailPanel.querySelector('.detail-view-more');
      if (existing) existing.remove();
      if ((href || articleTemplate) && this.detailPanel) {
        var link = document.createElement('button');
        link.className = 'detail-view-more';
        link.type = 'button';
        if (articleTemplate) {
          link.addEventListener('click', this.openArticle.bind(this, articleTemplate, link));
        } else if (href) {
          link.addEventListener('click', this.openRemoteArticle.bind(this, href, link));
        }
        link.textContent = node.dataset.viewMoreLabel || this.dataset.detailViewMoreLabel || 'View Article …';
        this.detailPanel.appendChild(link);
      }
      this.overlay.classList.add('is-open');
      this.overlay.setAttribute('aria-hidden', 'false');
      if (this.detailClose) this.detailClose.focus({ preventScroll: true });
    }

    closeDetail() {
      if (!this.overlay || !this.overlay.classList.contains('is-open')) return;
      this.overlay.classList.remove('is-open');
      this.overlay.setAttribute('aria-hidden', 'true');
      if (this.detailTrigger) this.detailTrigger.focus({ preventScroll: true });
      this.detailTrigger = null;
    }

    openArticle(templateId, trigger) {
      var source = document.getElementById(templateId);
      if (!source || !this.articleContent) return;
      var frame = source.tagName === 'TEMPLATE' ? source.content.querySelector('iframe[src]') : source.querySelector('iframe[src]');
      if (frame) {
        this.openRemoteArticle(new URL(frame.getAttribute('src'), document.baseURI).href, trigger);
        return;
      }
      this.closeDetail();
      this.articleTrigger = trigger || document.activeElement;
      this.renderArticle(source.tagName === 'TEMPLATE' ? source.content : source, this.articleTitle());
      this.articleOverlay.classList.add('is-open');
      this.articleOverlay.setAttribute('aria-hidden', 'false');
      if (this.articleClose) this.articleClose.focus({ preventScroll: true });
    }

    closeArticle() {
      if (!this.articleOverlay || !this.articleOverlay.classList.contains('is-open')) return;
      this.articleOverlay.classList.remove('is-open');
      this.articleOverlay.setAttribute('aria-hidden', 'true');
      this.articleContent.replaceChildren();
      if (this.articleTrigger && this.articleTrigger.focus) this.articleTrigger.focus({ preventScroll: true });
      this.articleTrigger = null;
    }

    openArticleUrl(url, trigger) {
      this.openRemoteArticle(url, trigger);
    }

    articleTitle(title) {
      return (title || this.dataset.articleTitle || document.title || 'Article')
        .replace(/\s*\|\s*Outfinity\s*$/i, '')
        .replace(/\s*[—-]\s*Article\s*$/i, '')
        .trim() || 'Article';
    }

    showArticleLoading() {
      this.articleContent.replaceChildren();
      var loading = document.createElement('p');
      loading.className = 'article-panel__loading';
      loading.textContent = 'Loading article …';
      this.articleContent.appendChild(loading);
    }

    renderArticle(source, articleTitle, fallbackCopy) {
      if (!this.articleContent) return;
      var title = this.articleTitle(articleTitle);
      var output = document.createDocumentFragment();
      if (this.articleTitleElement) this.articleTitleElement.textContent = title;

      var holder = document.createElement('div');
      if (source && source.nodeType) holder.appendChild(source.cloneNode(true));
      holder.querySelectorAll('nav, footer, form, script, style, noscript, iframe, outfinity-presentation, outfinity-cover, .deck-viewport, .deck-canvas, .deck-controls, .detail-overlay, .article-overlay, .presentation-site-footer, .presentation-footer, .page-cta, .continue-exploring, .contents, .site-header, .edge-nav, .presentation-view-more, .detail-view-more, [data-presentation-exclude-article], [data-presentation-view-more]').forEach(function (node) { node.remove(); });
      var allowed = Array.from(holder.querySelectorAll('h2, h3, h4, p, ul, ol, blockquote, table, figure, pre'));
      allowed.filter(function (node) {
        if (node.closest('li') && node.tagName === 'P') return false;
        if (node.closest('figure') && node !== node.closest('figure')) return false;
        return node.textContent.trim() || node.querySelector('img, video');
      }).forEach(function (node) {
        var copy = node.cloneNode(true);
        [copy].concat(Array.from(copy.querySelectorAll('*'))).forEach(function (element) {
          element.removeAttribute('class');
          element.removeAttribute('id');
          element.removeAttribute('style');
          Array.from(element.attributes).forEach(function (attribute) {
            if (/^data-|^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
          });
        });
        output.appendChild(copy);
      });
      if (!output.childNodes.length) {
        var message = document.createElement('p');
        message.textContent = fallbackCopy || 'The editorial article could not be loaded in this presentation.';
        output.appendChild(message);
      }
      this.articleContent.replaceChildren(output);
    }

    openRemoteArticle(url, trigger) {
      if (!url || !this.articleContent) return;
      this.closeDetail();
      var remoteUrl = new URL(url, document.baseURI).href;
      this.articleTrigger = trigger || document.activeElement;
      this.showArticleLoading();
      this.articleOverlay.classList.add('is-open');
      this.articleOverlay.setAttribute('aria-hidden', 'false');
      if (this.articleClose) this.articleClose.focus({ preventScroll: true });
      var self = this;
      var getDocument = function (address) {
        return window.fetch(address).then(function (response) {
          if (!response.ok) throw new Error('Article unavailable');
          return response.text();
        }).then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
      };
      var extract = function (documentSource, sourceUrl) {
        var alternate = documentSource.querySelector('link[rel="alternate"][type="text/html"]');
        if (alternate) return { alternate: new URL(alternate.getAttribute('href'), sourceUrl).href };
        var source = documentSource.querySelector('article.presentation-seo-source, article.presentation-article-source, article.presentation-article, template.presentation-article-source, template.presentation-article');
        if (source) return source.tagName === 'TEMPLATE' ? source.content.cloneNode(true) : source.cloneNode(true);
        return documentSource.querySelector('main, article') || documentSource.body;
      };
      getDocument(remoteUrl).then(function (documentSource) {
        var source = extract(documentSource, remoteUrl);
        if (source && source.alternate) return getDocument(source.alternate).then(function (articleDocument) { return { source: extract(articleDocument, source.alternate), title: articleDocument.title }; });
        return { source: source, title: documentSource.title };
      }).then(function (result) {
        if (result.source && result.source.alternate) throw new Error('Article unavailable');
        self.renderArticle(result.source, self.articleTitle(result.title));
      }).catch(function () {
        self.renderArticle(null, 'Article unavailable');
      });
    }

    show(index, updateHash) {
      this.closeDetail();
      this.current = Math.max(0, Math.min(index, this.slides.length - 1));
      var self = this;
      this.slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === self.current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        if (active) slide.scrollTop = 0;
      });
      if (this.progress) this.progress.querySelectorAll('[data-presentation-index]').forEach(function (button, buttonIndex) {
        var active = buttonIndex === self.current;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-current', active ? 'step' : 'false');
      });
      if (this.home) this.home.disabled = this.current === 0;
      if (this.back) this.back.disabled = this.current === 0;
      if (this.next) this.next.disabled = this.current === this.slides.length - 1;
      if (this.edgeBack) this.edgeBack.disabled = this.current === 0;
      if (this.edgeNext) this.edgeNext.disabled = this.current === this.slides.length - 1;
      if (this.count) this.count.textContent = String(this.current + 1).padStart(2, '0') + '/' + String(this.slides.length).padStart(2, '0');
      if (updateHash !== false && this.slides[this.current].id) history.replaceState(null, '', '#' + this.slides[this.current].id);
    }

    bindKeyboard() {
      var self = this;
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && self.articleOverlay && self.articleOverlay.classList.contains('is-open')) { self.closeArticle(); return; }
        if (event.key === 'Escape' && self.overlay && self.overlay.classList.contains('is-open')) { self.closeDetail(); return; }
        if ((self.overlay && self.overlay.classList.contains('is-open')) || (self.articleOverlay && self.articleOverlay.classList.contains('is-open'))) return;
        if (event.target.closest('a, button, input, textarea, select')) return;
        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); self.show(self.current + 1); }
        if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); self.show(self.current - 1); }
        if (event.key === 'Home') self.show(0);
        if (event.key === 'End') self.show(self.slides.length - 1);
      });
    }

    bindTouchNavigation() {
      if (this.dataset.mobileAxis !== 'vertical') return;
      var self = this;
      var gesture = null;
      this.addEventListener('touchstart', function (event) {
        if (event.touches.length !== 1 || (self.overlay && self.overlay.classList.contains('is-open')) || (self.articleOverlay && self.articleOverlay.classList.contains('is-open'))) return;
        var touch = event.touches[0];
        gesture = {
          x: touch.clientX,
          y: touch.clientY,
          scroller: event.target.closest('.book-grid')
        };
      }, { passive: true });
      this.addEventListener('touchmove', function (event) {
        if (!gesture || gesture.scroller || event.touches.length !== 1) return;
        var touch = event.touches[0];
        var dx = touch.clientX - gesture.x;
        var dy = touch.clientY - gesture.y;
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) * 1.1 && event.cancelable) event.preventDefault();
      }, { passive: false });
      this.addEventListener('touchend', function (event) {
        if (!gesture || !event.changedTouches.length) return;
        var touch = event.changedTouches[0];
        var dx = touch.clientX - gesture.x;
        var dy = touch.clientY - gesture.y;
        var scroller = gesture.scroller;
        gesture = null;
        if (Math.abs(dy) < 55 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
        if (scroller) {
          var atTop = scroller.scrollTop <= 2;
          var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
          if ((dy > 0 && !atTop) || (dy < 0 && !atBottom)) return;
        }
        self.show(self.current + (dy < 0 ? 1 : -1));
      }, { passive: true });
      this.addEventListener('touchcancel', function () { gesture = null; }, { passive: true });
    }

    bindResize() {
      var self = this;
      this.scale = function () {
        if (!self.viewport || window.innerWidth <= Number(self.dataset.mobileBreakpoint || 900)) {
          self.style.removeProperty('--deck-scale');
          return;
        }
        var width = Number(self.dataset.deckWidth || 1600);
        var height = Number(self.dataset.deckHeight || 900);
        var scale = Math.min(self.viewport.clientWidth / width, self.viewport.clientHeight / height);
        self.style.setProperty('--deck-scale', Math.max(.01, scale));
      };
      new ResizeObserver(this.scale).observe(this.viewport || this);
      window.addEventListener('resize', this.scale);
      this.scale();
    }
  }

  customElements.define('outfinity-presentation', OutfinityPresentation);
}());

(function () {
  var userAgent = navigator.userAgent || "";
  var isAppleWebKit = /AppleWebKit/i.test(userAgent);
  var isSafari = isAppleWebKit && /Safari/i.test(userAgent) && !/(?:Chrome|Chromium|CriOS|Edg|EdgiOS|FxiOS|OPiOS|Android)/i.test(userAgent);
  var isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  var isMobileSafari = isSafari && (/(?:iPhone|iPad|iPod)/i.test(userAgent) || isIPadOS);
  document.documentElement.classList.toggle("is-safari", isSafari);
  document.documentElement.classList.toggle("is-mobile-safari", isMobileSafari);

  var path = window.location.pathname;
  var basePath = "";
  
  function detectBasePath() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src") || scripts[i].src;
      if (src && src.indexOf("nav.js") !== -1) {
        var match = src.match(/^(.*?)js\/nav\.js/);
        if (match) {
          basePath = match[1];
          return;
        }
      }
    }
    basePath = "";
  }
  detectBasePath();

  function getPagePath() {
    var cleanPath = path.split("?")[0].replace(/\/+$/, "");
    var docsMarker = "/docs/";
    var docsIndex = cleanPath.lastIndexOf(docsMarker);
    if (docsIndex !== -1) return cleanPath.slice(docsIndex + docsMarker.length);
    return cleanPath.replace(/^\//, "");
  }

  function isCurrent(href) {
    var hrefPath = href.replace(/^\//, "");
    var currentPath = getPagePath();
    return currentPath === hrefPath ? " current" : "";
  }

  function inGroup(groups) {
    var currentPath = getPagePath();
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i].replace(/^\//, "").replace(/\.html$/, "");
      if (currentPath === group + ".html" || currentPath.indexOf(group + "/") === 0) return " is-current";
    }
    return "";
  }

  var links = {
    services: [
      { href: "services.html", label: "Services Overview" },
      { href: "services/technical-advisory.html", label: "Technical Advisory" },
      { href: "services/venture-exploration-memo.html", label: "Venture Exploration Memo" },
      { href: "services/validation-sprint.html", label: "Validation Sprint" },
      { href: "services/private-venture-intelligence-retainer.html", label: "Private Venture Intelligence Retainer" },
      { href: "services/technical-due-diligence.html", label: "Technical Due Diligence" },
      { href: "services/prototype-and-feasibility.html", label: "Prototype & Feasibility Package" },
      { href: "services/research-project-writing.html", label: "Research Project Writing Consulting" },
      { href: "services/technical-ip-consulting.html", label: "Technical IP Consulting" },
      { href: "services/private-equity-services.html", label: "Private Equity Oriented Services" },
      { href: "services/regulated-industry-rd.html", label: "Regulated Industry R&D" },
      { href: "services/blockchain-privacy-consulting.html", label: "Blockchain & Privacy Technologies" },
      { href: "services/ai-consultancy.html", label: "AI Consultancy" }
    ],
    studio: [
      { href: "studio.html", label: "Studio Model" },
      { href: "studio/why-outfinity-is-different.html", label: "Why Outfinity Is Different" },
      { href: "studio/how-ventures-are-built.html", label: "How Ventures Are Built" },
      { href: "studio/explorer-circle.html", label: "Explorer Circle" }
    ],
    investors: [
      { href: "investors.html", label: "Investor Participation" },
      { href: "investors/studio-level-participation.html", label: "Ecosystem Partnership" },
      { href: "investors/venture-specific-participation.html", label: "Venture Participation" }
    ],
    operating: [
      { href: "operating-model.html", label: "Operating Model" },
      { href: "operating-model/collaboration-process.html", label: "Collaboration Process" },
      { href: "operating-model/venture-formation-and-newco-creation.html", label: "Venture Formation and NewCo Creation" },
      { href: "operating-model/legal-ip.html", label: "Legal and IP Principles" }
    ],
    ventures: [
      { href: "ventures.html", label: "Ventures Overview" },
      { href: "ventures/assistos-enterprise.html", label: "AssistOS Enterprise" },
      { href: "ventures/scientific-workbench.html", label: "Scientific Workbench" },
      { href: "ventures/webassist-cloud.html", label: "WebAssist Cloud" },
      { href: "ventures/webmeet-ai-collaboration-cloud.html", label: "WebMeet AI Collaboration Cloud" },
      { href: "ventures/elastic-agentic-cloud.html", label: "Elastic Agentic Cloud" },
      { href: "ventures/soptrace-gxp.html", label: "SOPTrace GxP" },
      { href: "ventures/outfinity-works.html", label: "Outfinity Works Marketplace" },
      { href: "ventures/scripta.html", label: "SCRIPTA" }
    ],
    research: [
      { href: "ai-thesis.html", label: "AI Thesis" },
      { href: "research.html", label: "Research Base" },
      { href: "ventures/neuro-symbolic-systems-lab.html", label: "Neuro-Symbolic Systems Lab" },
      { href: "ventures/executable-science-ai-lab.html", label: "Executable Science AI Lab" },
      { href: "ventures/cryptography-and-privacy-lab.html", label: "Cryptography and Privacy Lab" },
      { href: "ventures/genetic-data-ai-lab.html", label: "Genomics Data AI Lab" },
      { href: "ventures/ploinky-wormhole-network.html", label: "Ploinky Wormhole Network" },
      { href: "ventures/social-technologies-research.html", label: "Social Technologies Research" }
    ],
    partners: [
      { href: "partners.html", label: "Partners Overview" },
      { href: "partners/work-with-outfinity.html", label: "Work With Outfinity" },
      { href: "outfinity-capital.html", label: "Outfinity Capital" },
      { href: "partners/ai-labs.html", label: "AI Labs" },
      { href: "partners/founder-operators.html", label: "Founder-Operators" },
      { href: "partners/strategic-enterprises.html", label: "Strategic Enterprises" },
      { href: "partners/research-partners.html", label: "Research Partners" },
      { href: "partners/recruitment-partners.html", label: "Recruitment Partners" }
    ],
    resources: [
      { href: "https://www.axiologic.net", label: "Axiologic Research" },
      { href: "https://www.assistos.org/", label: "AssistOS" },
      { href: "https://agisystem2.com/", label: "Our Neuro-symbolic Scientific Blog" },
      { href: "https://quiz.outfinity.ch", label: "Entrepreneur Quiz" }
    ],
    books: [
      { href: "cultural-artefacts.html", label: "Explore Our Books" }
    ],
    contact: [
      { href: "contact.html", label: "Contact Form" }
    ]
  };

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }
  function normalize(p) {
    return p.replace(/\/$/, "");
  }
  function getRelativePath(href) {
    if (isExternal(href)) return href;
    var cleanHref = href.replace(/^\//, "");
    if (!cleanHref) return basePath + "index.html";
    return basePath + cleanHref;
  }
  function renderLinks(arr) {
    var html = "";
    var p = normalize(getPagePath());
    for (var i = 0; i < arr.length; i++) {
      var ext = isExternal(arr[i].href);
      var itemPath = normalize(arr[i].href.replace(/^\//, ""));
      var active = !ext && p === itemPath ? " current" : "";
      var target = ext ? ' target="_blank" rel="noreferrer"' : "";
      var linkHref = ext ? arr[i].href : getRelativePath(arr[i].href);
      html += '<a class="submenu-link' + active + '" href="' + linkHref + '"' + target + '>' + arr[i].label + "</a>";
    }
    return html;
  }

  var s = inGroup(["/studio", "/investors", "/operating-model", "/services"]);
  var v = inGroup(["/ventures", "/ai-thesis", "/research"]);
  var p = inGroup(["/partners", "/contact"]);

  var brandHref = getRelativePath("/");
  var logoSrc = getRelativePath("assets/outfinity.svg");
  var currentPath = getPagePath();
  var homeCurrent = currentPath === "" || currentPath === "index.html" ? " current" : "";
  var presentationCurrent = currentPath === "presentation.html" ? " current" : "";

  var navHtml =
    '<nav class="nav" aria-label="Primary navigation">' +
    '<div class="nav-inner">' +
    '<a class="brand" href="' + brandHref + '">' +
    '<img src="' + logoSrc + '" alt="Outfinity logo">' +
    '<span class="brand__name">Outfinity</span>' +
    "</a>" +
    '<ul class="menu-groups">' +
    '<li class="menu-direct-item"><a class="menu-direct' + homeCurrent + '" href="' + getRelativePath("/") + '">Home</a></li>' +
    '<li class="menu-direct-item"><a class="menu-direct' + presentationCurrent + '" href="' + getRelativePath("presentation.html") + '">Presentation</a></li>' +
    '<li class="menu-group menu-group--studio' + s + '">' +
    '<button class="menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-panel-studio">Studio</button>' +
    '<div class="menu-layer"><div class="menu-panel" id="menu-panel-studio" aria-label="Studio submenu">' +
    '<div class="menu-section"><p class="menu-section-title">Services</p>' +
    renderLinks(links.services) +
    '</div><div class="menu-section"><p class="menu-section-title">Studio</p>' +
    renderLinks(links.studio) +
    '</div><div class="menu-section"><p class="menu-section-title">Investors</p>' +
    renderLinks(links.investors) +
    '</div><div class="menu-section"><p class="menu-section-title">Operating Model</p>' +
    renderLinks(links.operating) +
    "</div></div></div>" +
    "</li>" +
    '<li class="menu-group' + v + '">' +
    '<button class="menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-panel-ventures">Ventures</button>' +
    '<div class="menu-layer"><div class="menu-panel" id="menu-panel-ventures" aria-label="Ventures submenu">' +
    '<div class="menu-section"><p class="menu-section-title">Public Research Ventures</p>' +
    renderLinks(links.ventures) +
    '</div><div class="menu-section"><p class="menu-section-title">Research-Originated Directions</p>' +
    renderLinks(links.research) +
    "</div></div></div>" +
    "</li>" +
    '<li class="menu-group menu-group--partners' + p + '">' +
    '<button class="menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-panel-partners">Partners</button>' +
    '<div class="menu-layer"><div class="menu-panel" id="menu-panel-partners" aria-label="Partners submenu">' +
    '<div class="menu-section"><p class="menu-section-title">Partners</p>' +
    renderLinks(links.partners) +
    '</div><div class="menu-section-group">' +
    '<div class="menu-section"><p class="menu-section-title">External Links</p>' +
    renderLinks(links.resources) +
    '</div><div class="menu-section menu-section--books"><p class="menu-section-title">Our Books</p>' +
    renderLinks(links.books) +
    '</div><div class="menu-section"><p class="menu-section-title">Contact</p>' +
    renderLinks(links.contact) +
    '</div></div>' +
    "</div></div></div>" +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</nav>";

  // Inject nav at the top of body
  var existing = document.getElementById("nav");
  if (existing) {
    existing.outerHTML = navHtml;
  } else {
    document.body.insertAdjacentHTML("afterbegin", navHtml);
  }

  // --- Menu event binding ---
  var nav = document.querySelector(".nav");
  if (!nav) return;

  var groups = Array.from(nav.querySelectorAll(".menu-group"));
  if (!groups.length) return;

  var closeTimer = null;
  var lockedGroup = null;

  function clearCloseTimer() {
    if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }
  }

  function setOpenGroup(nextGroup) {
    groups.forEach(function (group) {
      var isOpen = group === nextGroup;
      group.classList.toggle("is-open", isOpen);
      var trigger = group.querySelector(".menu-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer = window.setTimeout(function () {
      if (!lockedGroup) setOpenGroup(null);
    }, 280);
  }

  groups.forEach(function (group) {
    var trigger = group.querySelector(".menu-trigger");

    group.addEventListener("pointerenter", function () {
      clearCloseTimer();
      if (lockedGroup && lockedGroup !== group) lockedGroup = null;
      setOpenGroup(group);
    });

    group.addEventListener("pointerleave", function () {
      if (lockedGroup !== group) scheduleClose();
    });

    group.addEventListener("focusin", function () {
      clearCloseTimer();
      setOpenGroup(group);
    });

    group.addEventListener("focusout", function () {
      window.requestAnimationFrame(function () {
        if (!group.contains(document.activeElement) && !lockedGroup) scheduleClose();
      });
    });

    if (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        clearCloseTimer();
        if (lockedGroup === group) {
          lockedGroup = null;
          setOpenGroup(null);
          return;
        }
        lockedGroup = group;
        setOpenGroup(group);
      });
    }
  });

  nav.addEventListener("pointerenter", clearCloseTimer);
  nav.addEventListener("pointerleave", function () {
    if (!lockedGroup) scheduleClose();
  });

  document.addEventListener("click", function (event) {
    if (nav.contains(event.target)) return;
    lockedGroup = null;
    clearCloseTimer();
    setOpenGroup(null);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      lockedGroup = null;
      clearCloseTimer();
      setOpenGroup(null);
    }
  });

  var conventionalExceptions = ["legal-disclaimer.html", "privacy-policy.html", "imprint.html"];
  var isEmbeddedArticleSource = currentPath.indexOf("/articles/") !== -1;
  if (document.querySelector("main.page-main") && !document.body.classList.contains("presentation-page") && conventionalExceptions.indexOf(currentPath) === -1 && !isEmbeddedArticleSource) {
    var presentationCss = document.createElement("link");
    presentationCss.rel = "stylesheet";
    presentationCss.href = getRelativePath("css/presentation.css?v=20260721-navigation-scale");
    document.head.appendChild(presentationCss);
    var componentScript = document.createElement("script");
    componentScript.src = getRelativePath("js/presentation.js?v=20260721-navigation-scale");
    componentScript.onload = function () {
      var adapterScript = document.createElement("script");
      adapterScript.src = getRelativePath("js/legacy-presentation.js?v=20260721-navigation-scale");
      document.body.appendChild(adapterScript);
    };
    document.body.appendChild(componentScript);
  }
})();

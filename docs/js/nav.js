(function () {
  var path = window.location.pathname;

  function isCurrent(prefix) {
    return path === prefix || path.indexOf(prefix + "/") === 0 ? " current" : "";
  }

  function inGroup(prefixes) {
    for (var i = 0; i < prefixes.length; i++) {
      if (path === prefixes[i] || path.indexOf(prefixes[i] + "/") === 0) return " is-current";
    }
    return "";
  }

  var links = {
    studio: [
      { href: "/studio/", label: "Studio Model" },
      { href: "/studio/why-outfinity-is-different/", label: "Why Outfinity Is Different" },
      { href: "/studio/how-ventures-are-built/", label: "How Ventures Are Built" },
      { href: "/studio/explorer-circle/", label: "Explorer Circle" }
    ],
    investors: [
      { href: "/investors/", label: "Investor Participation" },
      { href: "/investors/studio-level-participation/", label: "Studio-Level Participation" },
      { href: "/investors/venture-specific-participation/", label: "Venture-Specific Participation" }
    ],
    operating: [
      { href: "/operating-model/", label: "Operating Model" },
      { href: "/operating-model/collaboration-process/", label: "Collaboration Process" },
      { href: "/operating-model/venture-formation-and-newco-creation/", label: "Venture Formation and NewCo Creation" },
      { href: "/operating-model/legal-ip/", label: "Legal and IP Principles" }
    ],
    ventures: [
      { href: "/ventures/", label: "Ventures Overview" },
      { href: "/ventures/assistos-enterprise/", label: "AssistOS Enterprise" },
      { href: "/ventures/webassist-cloud/", label: "WebAssist Cloud" },
      { href: "/ventures/webmeet-ai-collaboration-cloud/", label: "WebMeet AI Collaboration Cloud" },
      { href: "/ventures/elastic-agentic-cloud/", label: "Elastic Agentic Cloud" },
      { href: "/ventures/soptrace-gxp/", label: "SOPTrace GxP" },
      { href: "/ventures/outfinity-works/", label: "Outfinity Works" },
      { href: "/ventures/scripta/", label: "SCRIPTA" }
    ],
    research: [
      { href: "/ventures/ploinky-wormhole-network/", label: "Ploinky Wormhole Network" },
      { href: "/ventures/neuro-symbolic-systems-lab/", label: "Neuro-Symbolic Systems Lab" },
      { href: "/ventures/executable-science-ai-lab/", label: "Executable Science AI Lab" },
      { href: "/ventures/agentic-federated-learning-lab/", label: "Agentic Federated Learning Lab" },
      { href: "/ai-thesis/", label: "AI Thesis" },
      { href: "/research/", label: "Research Base" }
    ],
    partners: [
      { href: "/partners/", label: "Partners Overview" },
      { href: "/partners/work-with-outfinity/", label: "Work With Outfinity" },
      { href: "/partners/ai-labs/", label: "AI Labs" },
      { href: "/partners/founder-operators/", label: "Founder-Operators" },
      { href: "/partners/strategic-enterprises/", label: "Strategic Enterprises" },
      { href: "/partners/research-partners/", label: "Research Partners" },
      { href: "/partners/recruitment-partners/", label: "Recruitment Partners" }
    ],
    contact: [
      { href: "/contact/", label: "Contact Form" }
    ]
  };

  function renderLinks(arr) {
    var html = "";
    for (var i = 0; i < arr.length; i++) {
      var active = path === arr[i].href || path.indexOf(arr[i].href.replace(/\/$/, "") + "/") === 0 ? " current" : "";
      html += '<a class="submenu-link' + active + '" href="' + arr[i].href + '">' + arr[i].label + "</a>";
    }
    return html;
  }

  var s = inGroup(["/studio", "/investors", "/operating-model"]);
  var v = inGroup(["/ventures", "/ai-thesis", "/research"]);
  var p = inGroup(["/partners", "/contact"]);

  var navHtml =
    '<nav class="nav" aria-label="Primary navigation">' +
    '<div class="nav-inner">' +
    '<a class="brand" href="/">' +
    '<img src="/assets/outfinity.svg" alt="Outfinity logo">' +
    "<span>Outfinity</span>" +
    "</a>" +
    '<ul class="menu-groups">' +
    '<li class="menu-group' + s + '">' +
    '<button class="menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-panel-studio">Studio</button>' +
    '<div class="menu-layer"><div class="menu-panel" id="menu-panel-studio" aria-label="Studio submenu">' +
    '<div class="menu-section"><p class="menu-section-title">Studio</p>' +
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
    '<div class="menu-section"><p class="menu-section-title">Current Ventures</p>' +
    renderLinks(links.ventures) +
    '</div><div class="menu-section"><p class="menu-section-title">Research-Originated Directions</p>' +
    renderLinks(links.research) +
    "</div></div></div>" +
    "</li>" +
    '<li class="menu-group' + p + '">' +
    '<button class="menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-panel-partners">Partners</button>' +
    '<div class="menu-layer"><div class="menu-panel" id="menu-panel-partners" aria-label="Partners submenu">' +
    '<div class="menu-section"><p class="menu-section-title">Partners</p>' +
    renderLinks(links.partners) +
    '</div><div class="menu-section"><p class="menu-section-title">Contact</p>' +
    renderLinks(links.contact) +
    "</div></div></div>" +
    "</li>" +
    "</ul>" +
    '<a class="nav-cta" href="https://docs.google.com/forms/d/16HH8lep0hXj5cGq91cereklkb5CxkK5x3soTXcdAp5A/" target="_blank" rel="noreferrer">Request a briefing</a>' +
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
})();

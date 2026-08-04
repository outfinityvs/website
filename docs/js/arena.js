(function () {
  var app = document.getElementById("arena-app");
  var host = document.getElementById("arena-view");
  var videoModal = document.querySelector("[data-video-modal]");
  var videoFrame = document.querySelector("[data-video-frame]");
  var videoConfirm = document.querySelector("[data-video-confirm]");
  var articleModal = null;
  var articleTrigger = null;
  var articleRequestId = 0;
  if (!app || !host) return;

  var storageKey = "outfinity.quickPresentation.state.v1";
  var legacyStorageKey = "outfinity.navigator.state.v1";
  var autoPlayDuration = 6500;
  var autoPlayTimer = null;
  var autoPlayLoopStart = "V1";

  var state = {
    role: "",
    branchChoice: "",
    currentView: "V0",
    soundEnabled: false,
    soundPreference: "",
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    completedViews: new Set(),
    history: [],
    started: false,
    autoPlayEnabled: false
  };

  var views = {
    V0: {
      tone: "neutral",
      headline: ["AI Builds Fast"],
      subtitle: [
        "Social legitimacy and early validation are now the scarce assets. Start the Quick Presentation for a concise Outfinity overview, watch the Video Pitch, then view the Full Presentation and all other article presentations."
      ],
      slideLink: { label: "View Full presentation", href: "presentation.html" },
      graphic: {
        type: "gate",
        items: [
          { label: "Studio", href: "studio.html" },
          { label: "Research", href: "research.html" },
          { label: "Ventures", href: "ventures.html" },
          { label: "Investors", href: "investors.html" },
          { label: "Process", href: "operating-model.html" }
        ]
      },
      actions: [
        { label: "Start Quick Presentation", next: "V1", primary: true, start: true }
      ]
    },
    V1: {
      tone: "neutral",
      headline: ["Research Before Startups"],
      subtitle: [
        "There is no future for startups without research. Outfinity connects research, venture formation, and capital before the story gets expensive."
      ],
      slideLink: { label: "Research and Technical Base", href: "research.html" },
      graphic: {
        type: "scanner",
        items: [
          { label: "Research", href: "research.html" },
          { label: "Thesis", href: "ai-thesis.html" },
          { label: "Ventures", href: "ventures.html" },
          { label: "Validation", href: "services/validation-sprint.html" },
          { label: "Diligence", href: "services/technical-due-diligence.html" },
          { label: "Prototype", href: "services/prototype-and-feasibility.html" }
        ]
      },
      actions: []
    },
    V2: {
      tone: "neutral",
      headline: ["Visitor Perspectives"],
      subtitle: ["Choose the lens that fits you: entrepreneur, investor, researcher, or future partner."],
      choices: [
        {
          role: "builder",
          next: "B1",
          title: "Entrepreneur",
          buttonLabel: "Entrepreneur"
        },
        {
          role: "investor",
          next: "I1",
          title: "Investor",
          buttonLabel: "Investor"
        },
        {
          role: "researcher",
          next: "R1",
          title: "Researcher",
          buttonLabel: "Researcher"
        },
        {
          role: "partner",
          next: "P1",
          title: "Future Partner",
          buttonLabel: "Future Partner"
        }
      ],
      graphic: {
        type: "choice-ring",
        items: [
          { label: "Entrepreneur", href: "partners/founder-operators.html" },
          { label: "Investor", href: "investors.html" },
          { label: "Researcher", href: "partners/research-partners.html" },
          { label: "Partner", href: "outfinity-capital.html" }
        ]
      }
    },
    B1: {
      tone: "builder",
      headline: ["For Entrepreneurs"],
      subtitle: ["Outfinity turns a thesis, capability, or market access into venture material by clarifying PMF, rights, evidence, team gaps, and capital readiness early."],
      slideLink: { label: "How Outfinity Builds Ventures", href: "studio/how-ventures-are-built.html" },
      graphic: {
        type: "graph",
        items: [
          { label: "Thesis", href: "studio/how-ventures-are-built.html" },
          { label: "Validation", href: "services/validation-sprint.html" },
          { label: "Prototype", href: "services/prototype-and-feasibility.html" },
          { label: "Rights", href: "operating-model/legal-ip.html" },
          { label: "Team", href: "partners/founder-operators.html" },
          { label: "Capital", href: "investors/venture-specific-participation.html" }
        ]
      },
      actions: []
    },
    I1: {
      tone: "investor",
      headline: ["For Investors"],
      subtitle: ["Outfinity helps investors assess technical truth, market signal, defensibility, rights clarity, and a real formation path—a sharper interface with evidence before capital follows the story."],
      slideLink: { label: "Investor Participation", href: "investors.html" },
      graphic: {
        type: "scores",
        items: [
          { label: "AssistOS", href: "ventures/assistos-enterprise.html" },
          { label: "WebAssist", href: "ventures/webassist-cloud.html" },
          { label: "WebMeet", href: "ventures/webmeet-ai-collaboration-cloud.html" },
          { label: "Agentic", href: "ventures/elastic-agentic-cloud.html" },
          { label: "SOPTrace", href: "ventures/soptrace-gxp.html" },
          { label: "SCRIPTA", href: "ventures/scripta.html" },
          { label: "Works", href: "ventures/outfinity-works.html" },
          { label: "Ploinky", href: "ventures/ploinky-wormhole-network.html" }
        ]
      },
      actions: []
    },
    R1: {
      tone: "researcher",
      headline: ["For Researchers"],
      subtitle: ["Outfinity helps serious research move from papers and prototypes into systems, partners, rights clarity, ventures, or institutions by deciding what to build, who should validate it, and what structure can carry it into the world."],
      slideLink: { label: "Research and Technical Base", href: "research.html" },
      graphic: {
        type: "graph",
        items: [
          { label: "Ploinky", href: "ventures/ploinky-wormhole-network.html" },
          { label: "Neuro", href: "ventures/neuro-symbolic-systems-lab.html" },
          { label: "Science", href: "ventures/executable-science-ai-lab.html" },
          { label: "Privacy", href: "ventures/cryptography-and-privacy-lab.html" },
          { label: "Social", href: "ventures/social-technologies-research.html" },
          { label: "Genomics", href: "ventures/genetic-data-ai-lab.html" }
        ]
      },
      actions: []
    },
    P1: {
      tone: "investor",
      headline: ["For Future Partners"],
      subtitle: ["Outfinity Capital is a founding-partner route for people and firms that can develop investor relationships and help validated ventures reach credible financing."],
      slideLink: { label: "Co-Founder Opportunity", href: "outfinity-capital.html" },
      graphic: {
        type: "formation",
        items: [
          { label: "Studio", href: "studio.html" },
          { label: "Partners", href: "partners/work-with-outfinity.html" },
          { label: "Capital", href: "outfinity-capital.html" },
          { label: "Investors", href: "investors.html" }
        ]
      },
      actions: []
    },
    V6: {
      tone: "neutral",
      headline: ["Venture Validation Studio"],
      subtitle: ["We test technical truth, market signal, rights, and formation risk before capital, teams, and public narratives commit—so investors can fund, investigate, reshape, or stop before the expensive phase."],
      slideLink: { label: "View Full presentation", href: "presentation.html" },
      graphic: {
        type: "formation",
        items: [
          { label: "Studio", href: "studio.html" },
          { label: "Process", href: "operating-model.html" },
          { label: "Validation", href: "services/validation-sprint.html" },
          { label: "Diligence", href: "services/technical-due-diligence.html" },
          { label: "Prototype", href: "services/prototype-and-feasibility.html" },
          { label: "Legal", href: "operating-model/legal-ip.html" }
        ]
      },
      actions: []
    },
    C1: {
      tone: "researcher",
      headline: ["Our Books"],
      subtitle: ["Explore Outfinity's books on intelligence, power, institutions, and possible futures; selected titles are available to read free online, with published editions on Amazon."],
      slideLink: { label: "Our Books", href: "cultural-artefacts.html" },
      graphic: {
        type: "map",
        items: [
          { label: "Literature", href: "cultural-artefacts.html#philosophical-sci-fi" },
          { label: "Intelligence", href: "cultural-artefacts.html#digital-frontiers" },
          { label: "Power", href: "cultural-artefacts.html#social-technologies" },
          { label: "Orders", href: "cultural-artefacts.html#interpretation-adoption" }
        ]
      },
      actions: []
    }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function track(eventName, details) {
    var payload = {
      event: eventName,
      view: state.currentView,
      role: state.role || "",
      choice: state.branchChoice || "",
      intent: details && details.intent ? details.intent : ""
    };
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push(payload);
    }
    document.dispatchEvent(new CustomEvent("outfinity:" + eventName, { detail: payload }));
  }

  function renderLines(lines, className) {
    if (!lines || !lines.length) return "";
    var text = lines.join(" ");
    return '<p class="' + className + '"><span class="arena-line" data-full="' + escapeHtml(text) + '">' + (state.reducedMotion ? escapeHtml(text) : "") + "</span></p>";
  }

  function renderHeadline(lines) {
    if (!lines || !lines.length) return "";
    return '<h1 class="arena-headline">' + lines.map(function (line) {
      return '<span class="arena-line" data-full="' + escapeHtml(line) + '">' + (state.reducedMotion ? escapeHtml(line) : "") + "</span>";
    }).join("") + "</h1>";
  }

  function renderCopy(view) {
    var html = '<div class="arena-copy">';
    html += renderMiniDeck(view);
    html += renderActions(view);
    html += "</div>";
    return html;
  }

  function renderSlideContent(view) {
    var html = "";
    html += '<p class="arena-slide-eyebrow">Outfinity Venture Studio</p>';
    html += renderHeadline(view.headline);
    html += renderLines(view.subtitle, "arena-subtitle");
    if (view.between) html += renderLines(view.between, "arena-between");
    if (view.statement) html += '<p class="arena-statement">' + escapeHtml(view.statement) + "</p>";
    if (view.infographic) html += '<p class="arena-infographic-text">' + escapeHtml(view.infographic) + "</p>";
    if (view.punchline) html += '<p class="arena-punchline">' + escapeHtml(view.punchline) + "</p>";
    if (view.punchlines) {
      html += '<div class="arena-punchline-list">' + view.punchlines.map(function (line) {
        return '<p>' + escapeHtml(line) + "</p>";
      }).join("") + "</div>";
    }
    if (view.micro) html += '<p class="arena-micro">' + escapeHtml(view.micro).replace(/\n/g, "<br>") + "</p>";
    if (view.slideLink) html += '<a class="arena-mini-slide__link" href="' + escapeHtml(view.slideLink.href) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(view.slideLink.label) + ' <span aria-hidden="true">↗</span></a>';
    return html;
  }

  function renderMiniDeck(view) {
    var slide = miniSlideFor(view);
    var currentIndex = presentationOrder.indexOf(state.currentView);
    var previous = currentIndex > 0 ? presentationOrder[currentIndex - 1] : "";
    var next = currentIndex >= 0 && currentIndex < presentationOrder.length - 1 ? presentationOrder[currentIndex + 1] : "";
    var roleActions = view.choices ? renderMiniChoiceActions(view) : "";
    return '<section class="arena-mini-deck" aria-label="Presentation slide ' + String(currentIndex + 1) + ' of ' + String(presentationOrder.length) + '">' +
      '<div class="arena-mini-deck__header"><span>' + escapeHtml(slide.kicker) + '</span><span class="arena-mini-deck__count">' + String(currentIndex + 1).padStart(2, "0") + ' / ' + String(presentationOrder.length).padStart(2, "0") + '</span></div>' +
      '<article class="arena-mini-slide"><div class="arena-mini-slide__copy">' + renderSlideContent(view) + roleActions + '</div>' + renderMiniDiagram(slide, view) + '</article>' +
      '<button type="button" class="arena-mini-deck__arrow arena-mini-deck__arrow--back" data-slide-view="' + previous + '" aria-label="Previous presentation slide"' + (previous ? "" : " disabled") + '>‹</button>' +
      '<button type="button" class="arena-mini-deck__arrow arena-mini-deck__arrow--next" data-slide-view="' + next + '" aria-label="Next presentation slide"' + (next ? "" : " disabled") + '>›</button>' +
      '<nav class="arena-mini-deck__controls" aria-label="Presentation navigation">' +
      '<div class="arena-mini-deck__progress" role="tablist" aria-label="Presentation slides">' + presentationOrder.map(function (viewId, index) {
        var active = viewId === state.currentView;
        return '<button type="button" class="arena-mini-deck__step' + (active ? ' is-active' : '') + '" data-slide-view="' + viewId + '" role="tab" aria-label="Go to slide ' + String(index + 1) + '" aria-selected="' + (active ? 'true' : 'false') + '"></button>';
      }).join("") + '</div></nav></section>';
  }

  var presentationOrder = ["V0", "V1", "C1", "V2", "B1", "I1", "R1", "P1", "V6"];

  function miniSlideFor(view) {
    var slides = {
      V0: { kicker: "Research → venture", stages: ["Signal", "Validate", "Form"], accent: "cyan" },
      V1: { kicker: "Research → validation", stages: ["Research", "Validate", "Form"], accent: "gold" },
      C1: { kicker: "Books → public shelf", stages: ["Read", "Reflect", "Share"], accent: "violet" },
      V2: { kicker: "Choose a lens", stages: ["Build", "Invest", "Research", "Partner"], accent: "mixed" },
      B1: { kicker: "Thesis → proof", stages: ["Thesis", "Validate", "Launch"], accent: "mint" },
      I1: { kicker: "Evidence → decision", stages: ["Truth", "Signal", "Decision"], accent: "gold" },
      R1: { kicker: "Research → reality", stages: ["Paper", "Prototype", "System"], accent: "violet" },
      P1: { kicker: "Partner → capital", stages: ["Partner", "Mandate", "Capital"], accent: "warm" },
      V6: { kicker: "Signal → outcome", stages: ["Test", "Shape", "Decide"], accent: "cyan" }
    };
    return slides[state.currentView] || slides.V0;
  }

  function renderMiniChoiceActions(view) {
    return '<div class="arena-mini-role-actions">' + view.choices.map(function (choice, index) {
      return '<button type="button" class="arena-role-control" data-next="' + escapeHtml(choice.next) + '" data-role="' + escapeHtml(choice.role) + '" data-state="idle" aria-label="Choose ' + escapeHtml(choice.buttonLabel) + '"><strong class="arena-role-control__label">' + escapeHtml(choice.buttonLabel) + '</strong><span class="arena-role-control__index">0' + String(index + 1) + '</span></button>';
    }).join("") + '</div>';
  }

  function renderMiniDiagram(slide, view) {
    // On larger screens the live radar becomes the slide's visual, rather than
    // being a second, competing element beside it. The standalone version is
    // retained for the compact tablet and phone layouts.
    if (view && view.graphic) {
      return '<div class="arena-mini-diagram arena-mini-diagram--radar" aria-label="Interactive venture radar">' + renderRadar(view, view.graphic) + '</div>';
    }
    if (slide && slide.stages) {
      return '<div class="arena-mini-diagram arena-mini-diagram--progress-ladder arena-mini-diagram--progress-' + escapeHtml(slide.accent || "cyan") + '" aria-hidden="true">' + slide.stages.map(function (stage) {
        return '<span><b>' + escapeHtml(stage) + '</b><i></i></span>';
      }).join("") + '</div>';
    }
    var kind = slide && slide.diagram ? slide.diagram : slide;
    if (kind === "origin-signal") {
      return '<div class="arena-mini-diagram arena-mini-diagram--origin-signal" aria-hidden="true"><i></i><i></i><i></i><b></b><span>Signal</span></div>';
    }
    if (kind === "research-ladder") {
      return '<div class="arena-mini-diagram arena-mini-diagram--research-ladder" aria-hidden="true"><span><b>Research</b><i></i></span><span><b>Validate</b><i></i></span><span><b>Form</b><i></i></span></div>';
    }
    if (kind === "impact-grid") {
      return '<div class="arena-mini-diagram arena-mini-diagram--impact-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>';
    }
    if (kind === "book-stack") {
      return '<div class="arena-mini-diagram arena-mini-diagram--book-stack" aria-hidden="true"><i></i><i></i><i></i><i></i><span>Public shelf</span></div>';
    }
    if (kind === "perspectives") {
      return '<div class="arena-mini-diagram arena-mini-diagram--perspectives" aria-hidden="true"><span>Build</span><span>Invest</span><span>Research</span><span>Partner</span><i></i></div>';
    }
    if (kind === "venture-stages") {
      return '<div class="arena-mini-diagram arena-mini-diagram--venture-stages" aria-hidden="true"><span>Thesis</span><i></i><span>Proof</span><i></i><span>Venture</span></div>';
    }
    if (kind === "investor-score") {
      return '<div class="arena-mini-diagram arena-mini-diagram--investor-score" aria-hidden="true"><span><b>Truth</b><i></i></span><span><b>Signal</b><i></i></span><span><b>Rights</b><i></i></span><span><b>Path</b><i></i></span></div>';
    }
    if (kind === "research-translation") {
      return '<div class="arena-mini-diagram arena-mini-diagram--research-translation" aria-hidden="true"><span>Paper</span><i></i><span>Prototype</span><i></i><span>System</span></div>';
    }
    if (kind === "capital-flow") {
      return '<div class="arena-mini-diagram arena-mini-diagram--capital-flow" aria-hidden="true"><span>Partner</span><i></i><span>Mandate</span><i></i><span>Capital</span></div>';
    }
    if (kind === "decision-gate") {
      return '<div class="arena-mini-diagram arena-mini-diagram--decision-gate" aria-hidden="true"><span>Test</span><i></i><span>Shape</span><i></i><span>Decide</span></div>';
    }
    if (kind === "bars") {
      return '<div class="arena-mini-diagram arena-mini-diagram--bars" aria-hidden="true"><i></i><i></i><i></i><i></i><span></span></div>';
    }
    if (kind === "nodes") {
      return '<div class="arena-mini-diagram arena-mini-diagram--nodes" aria-hidden="true"><i></i><i></i><i></i><b></b><span></span></div>';
    }
    return '<div class="arena-mini-diagram arena-mini-diagram--trace" aria-hidden="true"><svg viewBox="0 0 136 68" focusable="false"><path d="M5 52 C22 48 25 39 38 43 S57 48 69 30 S88 21 100 28 S116 18 131 9"></path><path d="M5 58 H131"></path><circle cx="38" cy="43" r="3"></circle><circle cx="69" cy="30" r="3"></circle><circle cx="100" cy="28" r="3"></circle><circle cx="131" cy="9" r="3"></circle></svg></div>';
  }

  function renderActions(view) {
    var actions = view.actions;
    var slideIndex = presentationOrder.indexOf(state.currentView);
    var nextSlide = slideIndex >= 0 && slideIndex < presentationOrder.length - 1 ? presentationOrder[slideIndex + 1] : "";
    var isHomeView = state.currentView === "V0";
    var back = '<button class="arena-control arena-back arena-icon-only" type="button" data-back aria-label="Back" title="Back"' + (state.history.length ? "" : " disabled") + '><span class="arena-directional-arrow" aria-hidden="true">‹</span></button>';
    var forward = '<button class="arena-control arena-forward arena-icon-only" type="button" data-deck-step="' + nextSlide + '" aria-label="Next presentation slide" title="Next presentation slide"' + (nextSlide ? "" : " disabled") + '><span class="arena-directional-arrow" aria-hidden="true">›</span></button>';
    var home = '<button class="arena-control arena-home arena-icon-only" type="button" data-home aria-label="Home" title="Home"' + (state.currentView === "V0" ? " disabled" : "") + '>' + buttonIcon("home") + "</button>";
    var main = actions && actions.length ? actions.map(function (action) {
      var classes = ["arena-action"];
      if (action.primary) classes.push("arena-action-primary");
      if (action.visual) classes.push("arena-action-visual");
      if (action.href) {
        return '<a class="' + classes.join(" ") + '" href="' + escapeHtml(action.href) + '" target="_blank" rel="noopener noreferrer" data-intent="' + escapeHtml(action.intent || "") + '">' + actionContent(action) + "</a>";
      }
      return '<button class="' + classes.join(" ") + '" type="button" data-next="' + escapeHtml(action.next) + '"' + (action.start ? ' data-start="true"' : "") + ">" + actionContent(action) + "</button>";
    }).join("") : "";
    return '<div class="arena-action-zone' + (isHomeView ? ' arena-action-zone--home' : '') + '" aria-label="Quick Presentation actions">' +
      (isHomeView ? "" : '<div class="arena-presentation-controls" aria-label="Presentation navigation">' + back + forward + home + "</div>") +
      main +
      '<button class="arena-control arena-video-toggle" type="button" data-video-open aria-haspopup="dialog" title="Watch the video pitch">' + buttonIcon("video") + '<span>Video Pitch</span></button>' +
      '<a class="arena-control arena-full-presentation" href="presentation.html" aria-label="Open the full presentation" title="Open the full presentation">' + buttonIcon("presentation") + '<span>Full Presentation</span></a>' +
      '<a class="arena-control arena-full-presentation arena-books-link" href="cultural-artefacts.html" aria-label="Open our books" title="Open our books">' + buttonIcon("books") + '<span>Our Books</span></a>' +
      "</div>";
  }

  function actionContent(action) {
    return buttonIcon(action.icon || iconForAction(action)) + "<span>" + escapeHtml(action.label) + "</span>";
  }

  function iconForAction(action) {
    var label = String(action.label || "").toLowerCase();
    var intent = String(action.intent || "").toLowerCase();
    if (label.indexOf("enter") !== -1 || label.indexOf("open") !== -1) return "enter";
    if (label.indexOf("continue") !== -1 || label.indexOf("choose") !== -1) return "continue";
    if (label.indexOf("operating") !== -1) return "process";
    if (label.indexOf("studio") !== -1 || intent.indexOf("builder") !== -1) return "studio";
    if (label.indexOf("invest") !== -1 || intent.indexOf("venture") !== -1) return "capital";
    if (label.indexOf("research") !== -1) return "research";
    return "details";
  }

  function buttonIcon(name) {
    var icons = {
      back: '<path d="M15 6 9 12l6 6"></path><path d="M10 12h10"></path>',
      forward: '<path d="m9 6 6 6-6 6"></path><path d="M14 12H4"></path>',
      home: '<path d="M4 11 12 4l8 7"></path><path d="M6 10v10h12V10"></path><path d="M10 20v-6h4v6"></path>',
      enter: '<path d="M6 18 18 6M8 6h10v10"></path>',
      continue: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
      roles: '<path d="M8 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path><path d="M16 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"></path><path d="M3 20c1-3 3-4 5-4s4 1 5 4"></path><path d="M13 20c.8-2 2-3 3.5-3 1.7 0 3 1 3.5 3"></path>',
      studio: '<path d="M5 19V5h14v14"></path><path d="M8 9h8M8 13h5"></path><path d="M5 19h14"></path>',
      capital: '<path d="M4 17 9 9l4 5 3-7 4 10"></path>',
      research: '<path d="M6 4h8l4 4v12H6z"></path><path d="M14 4v5h5"></path><path d="M9 14h6M9 17h4"></path>',
      process: '<path d="M5 12a7 7 0 0 1 12-5"></path><path d="M17 4v4h-4"></path><path d="M19 12a7 7 0 0 1-12 5"></path><path d="M7 20v-4h4"></path>',
      video: '<rect x="3" y="5" width="14" height="14" rx="2"></rect><path d="m17 10 4-2v8l-4-2z"></path><path d="m9 9 4 3-4 3z"></path>',
      presentation: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M8 9h8M8 13h5"></path><path d="m14 16 3 0"></path>',
      books: '<path d="M4 5.5c2.6-.9 5.2-.5 8 1.1v12c-2.8-1.6-5.4-2-8-1.1z"></path><path d="M20 5.5c-2.6-.9-5.2-.5-8 1.1v12c2.8-1.6 5.4-2 8-1.1z"></path><path d="M12 6.6v12"></path>',
      details: '<path d="M6 7h12M6 12h12M6 17h8"></path>'
    };
    return '<svg class="arena-button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[name] || icons.details) + "</svg>";
  }

  function renderSoundToggle() {
    return '<button class="arena-sound-toggle" type="button" data-sound-toggle data-sound-state="' + (state.soundEnabled ? "on" : "off") + '" aria-pressed="' + (state.soundEnabled ? "true" : "false") + '">' + soundIcon(state.soundEnabled) + '<span>' + (state.soundEnabled ? "Sound ON" : "Sound OFF") + "</span></button>";
  }

  function renderChoiceActions(view) {
    return view.choices.map(function (choice) {
      var tone = choice.role || state.role || "neutral";
      return '<button class="arena-action arena-choice-action arena-choice-action--' + escapeHtml(tone) + '" type="button" data-next="' + escapeHtml(choice.next) + '"' +
        (choice.role ? ' data-role="' + escapeHtml(choice.role) + '"' : "") +
        (choice.key ? ' data-choice="' + escapeHtml(choice.key) + '"' : "") + ">" +
        buttonIcon(choice.role === "investor" ? "capital" : choice.role === "researcher" ? "research" : "studio") +
        "<span>" + escapeHtml(choice.buttonLabel || choice.title.replace(/\.$/, "")) + "</span>" +
        "</button>";
    }).join("");
  }

  function soundIcon(enabled) {
    if (enabled) {
      return '<svg class="arena-sound-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 10v4h4l5 4V6l-5 4H4z"></path><path d="M16 9c1 1 1 5 0 6M19 7c2.4 2.6 2.4 7.4 0 10"></path></svg>';
    }
    return '<svg class="arena-sound-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 10v4h4l5 4V6l-5 4H4z"></path><path d="M18 9l4 6M22 9l-4 6"></path></svg>';
  }

  function renderGraphic(view) {
    var graphic = view.graphic || { type: "gate" };
    var html = '<div class="arena-visual arena-visual--radar arena-visual--' + escapeHtml(graphic.type) + '">';
    html += renderRadar(view, graphic);
    html += "</div>";
    return html;
  }

  function renderRadar(view, graphic) {
    var items = collectRadarItems(view, graphic);
    var center = radarCenter(graphic);
    var count = Math.max(items.length, 1);
    return '<div class="arena-radar" style="--count:' + count + '">' +
      renderSoundToggle() +
      '<svg class="arena-radar-svg" viewBox="0 0 400 400" aria-hidden="true" focusable="false">' +
      '<circle cx="200" cy="200" r="174"></circle><circle cx="200" cy="200" r="124"></circle><circle cx="200" cy="200" r="70"></circle>' +
      '<path d="M200 26v348M26 200h348M77 77l246 246M323 77 77 323"></path>' +
      '<path class="arena-radar-sweep" d="M200 200 L200 34 A166 166 0 0 1 344 117 Z"></path>' +
      '</svg>' +
      '<div class="arena-radar-core"><strong>' + escapeHtml(center) + "</strong></div>" +
      '<div class="arena-radar-items">' + items.map(function (item, index) {
        var content = iconSvg(index) + '<b>' + escapeHtml(item.label) + "</b>";
        var style = ' style="--i:' + index + ';--count:' + count + '"';
        if (item.href) {
          return '<button class="arena-radar-node" type="button" data-article-url="' + escapeHtml(item.href) + '"' + style + ' aria-label="View article: ' + escapeHtml(item.label) + '">' + content + "</button>";
        }
        return '<span class="arena-radar-node"' + style + ">" + content + "</span>";
      }).join("") + "</div>" +
      "</div>";
  }

  function collectRadarItems(view, graphic) {
    var labels;
    if (graphic.items) labels = graphic.items;
    else if (graphic.type === "gate") labels = ["PMF", "Moat", "Rights", "Evidence", "Formation"];
    else if (graphic.type === "scores") labels = ["Story", "Confidence", "Evidence", "Architecture", "Margins", "Rights"];
    else if (graphic.type === "filter") labels = ["Capital", "Diligence", "Invest", "Probe", "Pass"];
    else if (graphic.type === "final") labels = ["Validate", "Partner", "Form", "Decide"];
    else if (graphic.type === "stack" && view.layers) labels = ["Judgment", "Review", "Provenance", "Memory", "Contest"];
    else labels = graphic.labels || graphic.nodes || [];
    return uniqueRadarItems(labels.map(normalizeRadarItem)).slice(0, 8);
  }

  function radarCenter(graphic) {
    var centers = {
      gate: "Probe",
      scanner: "Validate",
      scores: "Diligence",
      filter: "Decide",
      final: "Outcome",
      stack: "Trust",
      map: "Impact",
      formation: "Form",
      graph: "Path",
      diagnosis: "Proof",
      "choice-ring": "Choose"
    };
    return centers[graphic.type] || "Explore";
  }

  function uniqueLabels(labels) {
    var seen = {};
    return labels.filter(function (label) {
      if (!label || seen[label]) return false;
      seen[label] = true;
      return true;
    });
  }

  function uniqueRadarItems(items) {
    var seen = {};
    return items.filter(function (item) {
      if (!item.label || seen[item.label]) return false;
      seen[item.label] = true;
      return true;
    });
  }

  function normalizeRadarItem(item) {
    if (item && typeof item === "object") {
      return {
        label: normalizeRadarLabel(item.label),
        href: item.href || ""
      };
    }
    return {
      label: normalizeRadarLabel(item),
      href: ""
    };
  }

  function normalizeRadarLabel(label) {
    var raw = String(label || "").replace(/[?%]/g, "").trim();
    var aliases = {
      "AI-native": "Native",
      "10x": "Scale",
      "Data rights": "Rights",
      "Workflow control": "Workflow",
      "Switching cost": "Moat",
      "Evidence Unknown": "Evidence",
      "Technical depth": "Depth",
      "Rights clarity": "Rights",
      "Team formation": "Team",
      "Capital readiness": "Capital",
      "Evidence filter": "Diligence",
      "Kill early": "Kill",
      "Market access": "Access",
      "Research / IP": "Research",
      "Execution leadership": "Execution",
      "Venture thesis": "Thesis",
      "Deployment path": "Deploy",
      "Unit economics": "Margins",
      "Inference cost": "Compute",
      "Research origin": "Origin",
      "Contributor rights": "Rights",
      "Repeatable demand": "Demand",
      "Language model": "Model",
      "Symbolic layer": "Symbolic",
      "Human oversight": "Oversight",
      "Sensitive data": "Data",
      "Local control": "Control",
      "Selective disclosure": "Disclosure",
      "Verifiable computation": "Verify",
      "Human judgment": "Judgment",
      "AI-assisted review": "Review",
      "Verifiable provenance": "Provenance",
      "Reputation memory": "Memory",
      "Product discipline": "Product",
      "Market ownership": "Market",
      "Financing path": "Capital"
    };
    if (aliases[raw]) return aliases[raw];
    if (/^Story /.test(raw)) return "Story";
    if (/^Confidence /.test(raw)) return "Confidence";
    var first = raw.split(/[\s/+→-]+/).filter(Boolean)[0] || raw;
    return first.charAt(0).toUpperCase() + first.slice(1);
  }

  function iconSvg(index) {
    var icons = [
      '<svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      '<svg viewBox="0 0 24 24"><path d="M4 18 10 6l4 8 2-4 4 8"></path></svg>',
      '<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM8 12h8M12 8v8"></path></svg>',
      '<svg viewBox="0 0 24 24"><path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0z"></path><circle cx="12" cy="12" r="2"></circle></svg>',
      '<svg viewBox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"></path></svg>',
      '<svg viewBox="0 0 24 24"><path d="M6 7h12M6 12h12M6 17h8"></path></svg>'
    ];
    return icons[index % icons.length];
  }

  function renderScanner(graphic) {
    return '<div class="arena-scan-board">' + renderTags(graphic.labels) + '<span class="arena-scan-beam"></span></div>' +
      '<div class="arena-node-row">' + graphic.nodes.map(function (node) {
        return '<span>' + escapeHtml(node) + "</span>";
      }).join("") + "</div>";
  }

  function renderTags(labels) {
    return '<div class="arena-tag-cloud">' + (labels || []).map(function (label, index) {
      return '<span style="--i:' + index + '">' + escapeHtml(label) + "</span>";
    }).join("") + "</div>";
  }

  function renderGraph(labels, caption) {
    return '<div class="arena-graph">' + (labels || []).map(function (label, index) {
      return '<span style="--i:' + index + '">' + escapeHtml(label) + "</span>";
    }).join("") + "</div>";
  }

  var renderToken = 0;

  function stopAutoPlay() {
    state.autoPlayEnabled = false;
    if (autoPlayTimer) window.clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
    app.dataset.autoplay = "off";
  }

  function syncAutoPlay() {
    if (autoPlayTimer) window.clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
    var slideIndex = presentationOrder.indexOf(state.currentView);
    var nextView = slideIndex >= 0 && slideIndex < presentationOrder.length - 1 ? presentationOrder[slideIndex + 1] : autoPlayLoopStart;
    var canPlay = state.autoPlayEnabled && state.started && !state.reducedMotion && state.currentView !== "V0";
    if (!canPlay) {
      app.dataset.autoplay = "off";
      return;
    }
    app.dataset.autoplay = "playing";
    autoPlayTimer = window.setTimeout(function () {
      if (state.autoPlayEnabled && state.currentView !== "V0") go(nextView, true);
    }, autoPlayDuration);
  }

  function loadStoredState() {
    try {
      var raw = window.localStorage && (window.localStorage.getItem(storageKey) || window.localStorage.getItem(legacyStorageKey));
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved || !views[saved.currentView]) return;
      state.currentView = saved.currentView;
      state.role = typeof saved.role === "string" ? saved.role : "";
      state.branchChoice = typeof saved.branchChoice === "string" ? saved.branchChoice : "";
      state.started = !!saved.started;
      if (saved.soundPreference === "on" || saved.soundPreference === "off") {
        state.soundPreference = saved.soundPreference;
      } else if (saved.soundEnabled === false) {
        // Before soundPreference existed, false could only result from an explicit toggle.
        state.soundPreference = "off";
      }
      if (Array.isArray(saved.history)) {
        state.history = saved.history.filter(function (viewId) {
          return !!views[viewId];
        }).slice(-12);
      }
      if (Array.isArray(saved.completedViews)) {
        state.completedViews = new Set(saved.completedViews.filter(function (viewId) {
          return !!views[viewId];
        }));
      }
    } catch (error) {}
  }

  function saveStoredState() {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(storageKey, JSON.stringify({
        currentView: state.currentView,
        role: state.role,
        branchChoice: state.branchChoice,
        started: state.started,
        soundEnabled: state.soundEnabled,
        soundPreference: state.soundPreference,
        history: state.history.slice(-12),
        completedViews: Array.from(state.completedViews)
      }));
    } catch (error) {}
  }

  function render() {
    var view = views[state.currentView] || views.V0;
    renderToken += 1;
    radarMusicStyle = createRadarMusicStyle(view);
    app.dataset.view = state.currentView;
    app.dataset.tone = view.tone || "neutral";
    state.completedViews.add(state.currentView);
    var html = '<article class="arena-scene arena-scene--' + escapeHtml(view.tone || "neutral") + '">';
    html += renderCopy(view);
    html += renderGraphic(view);
    html += "</article>";
    host.innerHTML = html;
    updateSoundButtons();
    typewrite(renderToken);
    startRadarSweep(renderToken);
    syncAutoPlay();
    saveStoredState();
  }

  function typewrite(token) {
    if (state.reducedMotion) return;
    var spans = Array.from(host.querySelectorAll("[data-full]"));
    var queue = [];
    spans.forEach(function (span) {
      var text = span.getAttribute("data-full") || "";
      queue.push({
        el: span,
        tokens: span.closest(".arena-headline") ? Array.from(text) : (text.match(/\S+\s*/g) || [text]),
        index: 0,
        headline: !!span.closest(".arena-headline")
      });
      span.textContent = "";
      span.classList.add("is-typing");
    });
    var itemIndex = 0;
    function tick() {
      if (token !== renderToken) return;
      var item = queue[itemIndex];
      if (!item) return;
      item.el.textContent += item.tokens[item.index] || "";
      item.index += 1;
      if (item.index >= item.tokens.length) {
        item.el.classList.remove("is-typing");
        itemIndex += 1;
      }
      window.setTimeout(tick, item.headline ? 24 : 36);
    }
    tick();
  }

  function go(nextView, silent) {
    if (!views[nextView]) return;
    if (!silent) state.history.push(state.currentView);
    state.currentView = nextView;
    render();
  }

  function goBack() {
    var previous = state.history.pop();
    if (!previous || !views[previous]) return;
    state.currentView = previous;
    render();
  }

  function goHome() {
    state.role = "";
    state.branchChoice = "";
    state.currentView = "V0";
    state.history = [];
    render();
  }

  function ensureArticleModal() {
    if (articleModal) return articleModal;
    articleModal = document.createElement("dialog");
    articleModal.className = "arena-article-modal";
    articleModal.setAttribute("aria-labelledby", "arena-article-title");
    articleModal.setAttribute("aria-busy", "false");
    articleModal.innerHTML = '<article class="arena-article-panel"><button class="arena-article-close" type="button" data-article-close aria-label="Close article">×</button><h1 id="arena-article-title" aria-live="polite" aria-atomic="true">Article</h1><div class="arena-article-content" data-article-content></div></article>';
    document.body.appendChild(articleModal);
    articleModal.addEventListener("click", function (event) {
      if (event.target === articleModal || event.target.closest("[data-article-close]")) closeArticle();
    });
    articleModal.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeArticle();
    });
    return articleModal;
  }

  function articleTitle(value) {
    return String(value || "Article").replace(/\s*\|\s*Outfinity\s*$/i, "").replace(/\s*[—-]\s*Article\s*$/i, "").trim() || "Article";
  }

  function fetchArticleDocument(url) {
    return window.fetch(url).then(function (response) {
      if (!response.ok) throw new Error("Article unavailable");
      return response.text();
    }).then(function (html) { return new DOMParser().parseFromString(html, "text/html"); });
  }

  function extractArticle(documentSource, sourceUrl) {
    var alternate = documentSource.querySelector('link[rel="alternate"][type="text/html"]');
    if (alternate) return { alternate: new URL(alternate.getAttribute("href"), sourceUrl).href };
    return documentSource.querySelector("article.presentation-seo-source, article.presentation-article-source, article.presentation-article, main article, main") || documentSource.body;
  }

  function renderArticle(source, title) {
    var modal = ensureArticleModal();
    modal.querySelector("#arena-article-title").textContent = articleTitle(title);
    var content = modal.querySelector("[data-article-content]");
    var holder = document.createElement("div");
    if (source) holder.appendChild(source.cloneNode(true));
    holder.querySelectorAll("nav, footer, form, script, style, noscript, iframe, outfinity-presentation, outfinity-cover, .deck-viewport, .deck-canvas, .contents, .site-header, .presentation-footer, .presentation-site-footer, .continue-exploring, .page-cta").forEach(function (node) { node.remove(); });
    var fragment = document.createDocumentFragment();
    Array.from(holder.querySelectorAll("h2, h3, h4, p, ul, ol, blockquote, table, figure, pre")).filter(function (node) {
      return !node.closest("li") && !node.closest("figure") && (node.textContent.trim() || node.querySelector("img, video"));
    }).forEach(function (node) {
      var copy = node.cloneNode(true);
      [copy].concat(Array.from(copy.querySelectorAll("*"))).forEach(function (element) {
        element.removeAttribute("class");
        element.removeAttribute("id");
        element.removeAttribute("style");
        Array.from(element.attributes).forEach(function (attribute) {
          if (/^data-|^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
        });
      });
      fragment.appendChild(copy);
    });
    if (!fragment.childNodes.length) {
      var fallback = document.createElement("p");
      fallback.textContent = "The editorial article could not be loaded in this presentation.";
      fragment.appendChild(fallback);
    }
    content.replaceChildren(fragment);
    modal.setAttribute("aria-busy", "false");
  }

  function openArticle(url, trigger) {
    var modal = ensureArticleModal();
    var requestId = ++articleRequestId;
    articleTrigger = trigger;
    modal.setAttribute("aria-busy", "true");
    modal.querySelector("#arena-article-title").textContent = "Loading article …";
    modal.querySelector("[data-article-content]").replaceChildren();
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    var sourceUrl = new URL(url, document.baseURI).href;
    fetchArticleDocument(sourceUrl).then(function (documentSource) {
      var source = extractArticle(documentSource, sourceUrl);
      if (!source.alternate) return { source: source, title: documentSource.title };
      return fetchArticleDocument(source.alternate).then(function (articleDocument) {
        return { source: extractArticle(articleDocument, source.alternate), title: articleDocument.title };
      });
    }).then(function (result) {
      if (requestId !== articleRequestId || !modal.hasAttribute("open")) return;
      if (result.source && result.source.alternate) throw new Error("Article unavailable");
      renderArticle(result.source, result.title);
    }).catch(function () {
      if (requestId !== articleRequestId || !modal.hasAttribute("open")) return;
      renderArticle(null, "Article unavailable");
    });
  }

  function closeArticle() {
    if (!articleModal || !articleModal.hasAttribute("open")) return;
    articleRequestId += 1;
    articleModal.setAttribute("aria-busy", "false");
    if (typeof articleModal.close === "function") articleModal.close();
    else articleModal.removeAttribute("open");
    if (articleTrigger && articleTrigger.focus) articleTrigger.focus({ preventScroll: true });
    articleTrigger = null;
  }

  // iOS Safari requires Web Audio to be created and started directly from a
  // touch gesture. `click` can arrive too late there, so use pointer/touch
  // input as the primary unlock and retain click as the keyboard fallback.
  function unlockSoundFromEvent(event) {
    if (event.target.closest("[data-sound-toggle]")) {
      // Prime without changing the visible preference. The following click
      // performs the actual toggle against an already resumed context.
      ensureAudio(true);
      return;
    }
    enableSoundFromInteraction();
  }

  if (window.PointerEvent) {
    document.addEventListener("pointerdown", unlockSoundFromEvent, true);
  } else {
    document.addEventListener("touchstart", unlockSoundFromEvent, { capture: true, passive: true });
  }
  document.addEventListener("click", unlockSoundFromEvent, true);

  host.addEventListener("click", function (event) {
    var articleAction = event.target.closest("[data-article-url]");
    if (articleAction) {
      event.preventDefault();
      stopAutoPlay();
      openArticle(articleAction.dataset.articleUrl, articleAction);
      return;
    }
    var slideNavigation = event.target.closest("[data-slide-view]");
    if (slideNavigation) {
      event.preventDefault();
      if (!slideNavigation.disabled && slideNavigation.dataset.slideView) {
        stopAutoPlay();
        go(slideNavigation.dataset.slideView);
      }
      return;
    }
    var videoAction = event.target.closest("[data-video-open]");
    if (videoAction) {
      event.preventDefault();
      openVideo(videoAction);
      return;
    }
    var soundAction = event.target.closest("[data-sound-toggle]");
    if (soundAction) {
      event.preventDefault();
      toggleSound();
      return;
    }
    var backAction = event.target.closest("[data-back]");
    if (backAction) {
      event.preventDefault();
      if (!backAction.disabled) {
        stopAutoPlay();
        var backAudio = prepareAudioForInteraction();
        goBack();
        playWhenAudioReady(backAudio);
      }
      return;
    }
    var homeAction = event.target.closest("[data-home]");
    if (homeAction) {
      event.preventDefault();
      stopAutoPlay();
      var homeAudio = prepareAudioForInteraction();
      goHome();
      playWhenAudioReady(homeAudio);
      return;
    }
    var deckStep = event.target.closest("[data-deck-step]");
    if (deckStep) {
      event.preventDefault();
      if (!deckStep.disabled && deckStep.dataset.deckStep) {
        stopAutoPlay();
        var stepAudio = prepareAudioForInteraction();
        go(deckStep.dataset.deckStep);
        playWhenAudioReady(stepAudio);
      }
      return;
    }
    var action = event.target.closest("[data-next]");
    if (!action) return;
    event.preventDefault();
    var audioReady = prepareAudioForInteraction();
    if (action.dataset.start) {
      if (!state.started) {
        state.started = true;
        track("arena_started");
      }
      state.autoPlayEnabled = true;
    } else {
      stopAutoPlay();
    }
    if (action.dataset.role) {
      state.role = action.dataset.role;
      state.branchChoice = "";
      track("role_selected");
    }
    if (action.dataset.choice) {
      state.branchChoice = action.dataset.choice;
      track("branch_choice_selected");
    }
    go(action.dataset.next);
    playWhenAudioReady(audioReady);
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-intent]");
    if (!link) return;
    var intent = link.getAttribute("data-intent") || "";
    if (intent === "presentation") track("presentation_clicked", { intent: intent });
  });

  var audioContext = null;
  var masterGain = null;
  var audioUnlocked = false;
  var radarFrameId = 0;
  var radarLastFrameTime = 0;
  var radarLastAngle = null;
  var radarCycleMs = 4800;
  var radarSweepOffset = -Math.PI / 3;
  var radarMusicStyle = null;
  var videoTrigger = null;

  function disableVideoCaptions(frame) {
    var message = JSON.stringify({
      event: "command",
      func: "setOption",
      args: ["captions", "track", {}]
    });
    [0, 500, 1500, 3000].forEach(function (delay) {
      window.setTimeout(function () {
        if (frame.isConnected && frame.contentWindow) {
          frame.contentWindow.postMessage(message, "https://www.youtube-nocookie.com");
        }
      }, delay);
    });
  }

  function openVideo(trigger) {
    if (!videoModal || !videoFrame) return;
    videoTrigger = trigger;
    videoFrame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/P4_jUm4dHLo?autoplay=1&controls=0&disablekb=1&fs=0&playsinline=1&rel=0&iv_load_policy=3&cc_load_policy=0&enablejsapi=1" title="Outfinity presentation film" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    var frame = videoFrame.querySelector("iframe");
    if (frame) frame.addEventListener("load", function () { disableVideoCaptions(frame); }, { once: true });
    if (typeof videoModal.showModal === "function") videoModal.showModal();
    else videoModal.setAttribute("open", "");
    track("presentation_video_opened");
  }

  function showVideoConfirm() {
    if (!videoConfirm || !videoConfirm.hidden) return;
    videoConfirm.hidden = false;
    var cancel = videoConfirm.querySelector("[data-video-cancel]");
    if (cancel) cancel.focus();
  }

  function hideVideoConfirm() {
    if (videoConfirm) videoConfirm.hidden = true;
  }

  function closeVideo() {
    if (!videoModal || !videoModal.hasAttribute("open")) return;
    if (typeof videoModal.close === "function") videoModal.close();
    else videoModal.removeAttribute("open");
  }

  function clearVideo() {
    if (videoFrame) videoFrame.innerHTML = "";
    hideVideoConfirm();
    if (videoTrigger && videoTrigger.isConnected) videoTrigger.focus();
    videoTrigger = null;
  }

  if (videoModal) {
    videoModal.addEventListener("click", function (event) {
      if (event.target.closest("[data-video-cancel]")) {
        hideVideoConfirm();
        return;
      }
      if (event.target.closest("[data-video-youtube]")) {
        hideVideoConfirm();
        track("presentation_video_youtube_opened");
        return;
      }
      if (event.target === videoModal || event.target.closest("[data-video-close]")) closeVideo();
    });
    videoModal.addEventListener("close", clearVideo);
    videoModal.addEventListener("cancel", function () {
      window.setTimeout(clearVideo, 0);
    });
  }

  if (videoFrame) videoFrame.addEventListener("click", showVideoConfirm);

  function enableSoundFromInteraction() {
    if (state.soundPreference === "off") return;
    if (!state.soundEnabled) {
      state.soundEnabled = true;
      updateSoundButtons();
      saveStoredState();
    }
    // iOS can move a running AudioContext back to suspended/interrupted when
    // Safari chrome changes, the page is backgrounded, or output is rerouted.
    // Retry inside every subsequent trusted gesture instead of trusting only
    // the UI state.
    playWhenAudioReady(ensureAudio());
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    state.soundPreference = state.soundEnabled ? "on" : "off";
    updateSoundButtons();
    saveStoredState();
    track("sound_toggled");
    if (state.soundEnabled) {
      ensureAudio().then(function (ready) {
        if (ready) playSoundConfirmation();
      });
    }
  }

  function ensureAudio(forceUnlock) {
    if (!state.soundEnabled && !forceUnlock) return Promise.resolve(false);
    if (!audioContext) {
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return Promise.resolve(false);
      audioContext = new AudioCtor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.48;
      masterGain.connect(audioContext.destination);
    }
    var needsResume = audioContext.state === "suspended" || audioContext.state === "interrupted";
    // Calling resume synchronously from the gesture is essential on iOS.
    var ready = needsResume ? audioContext.resume() : Promise.resolve();
    unlockAudioContext();
    return Promise.resolve(ready).then(function () {
      if (audioContext && audioContext.state !== "running" && audioContext.resume) return audioContext.resume();
    }).then(function () {
      unlockAudioContext();
      return !!audioContext && audioContext.state === "running";
    }).catch(function () {
      return false;
    });
  }

  function unlockAudioContext() {
    if (!audioContext || !masterGain) return;
    if (audioUnlocked && audioContext.state === "running") return;
    // Prime both a buffer source and an oscillator during the trusted gesture.
    // The dedicated zero-gain node keeps this completely silent.
    try {
      var silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      silentGain.connect(audioContext.destination);
      var source = audioContext.createBufferSource();
      source.buffer = audioContext.createBuffer(1, 32, audioContext.sampleRate);
      source.connect(silentGain);
      source.start(0);
      if (audioContext.createOscillator) {
        var oscillator = audioContext.createOscillator();
        oscillator.connect(silentGain);
        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.035);
      }
      audioUnlocked = true;
    } catch (error) {}
  }

  function playSoundConfirmation() {
    if (!state.soundEnabled || !audioContext || audioContext.state !== "running") return;
    try {
      var now = audioContext.currentTime;
      var gain = audioContext.createGain();
      var oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, now);
      oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      oscillator.connect(gain);
      connectAudio(gain);
      oscillator.start(now);
      oscillator.stop(now + 0.13);
    } catch (error) {}
  }

  function prepareAudioForInteraction() {
    return state.soundEnabled ? ensureAudio() : Promise.resolve(false);
  }

  function playWhenAudioReady(ready) {
    if (!state.soundEnabled || !ready) return;
    ready.then(function () {});
  }

  function connectAudio(node) {
    node.connect(masterGain || audioContext.destination);
  }

  function updateSoundButtons() {
    Array.from(document.querySelectorAll("[data-sound-toggle]")).forEach(function (button) {
      button.dataset.soundState = state.soundEnabled ? "on" : "off";
      button.innerHTML = soundIcon(state.soundEnabled) + '<span>' + (state.soundEnabled ? "Sound ON" : "Sound OFF") + "</span>";
      button.setAttribute("aria-pressed", state.soundEnabled ? "true" : "false");
    });
  }

  function startRadarSweep(token) {
    stopRadarSweep();
    if (state.reducedMotion) return;
    var radar = Array.from(host.querySelectorAll(".arena-radar")).find(function (candidate) {
      return candidate.offsetWidth > 0 && candidate.offsetHeight > 0;
    });
    var sweep = radar && radar.querySelector(".arena-radar-sweep");
    if (!sweep || !radar) return;
    var startTime = performance.now();
    radarLastAngle = null;

    function frame(now) {
      if (token !== renderToken) return;
      if (now - radarLastFrameTime < 32) {
        radarFrameId = window.requestAnimationFrame(frame);
        return;
      }
      radarLastFrameTime = now;
      var nodes = Array.from(radar.querySelectorAll(".arena-radar-node"));
      if (!nodes.length) return;
      var elapsed = (now - startTime) % radarCycleMs;
      var centerAngle = normalizeAngle((elapsed / radarCycleMs) * Math.PI * 2);
      var sweepRotation = centerAngle - radarSweepOffset;
      sweep.style.transform = "rotate(" + sweepRotation + "rad)";

      var previous = radarLastAngle;
      radarLastAngle = centerAngle;
      var angles = getRadarNodeAngles(nodes, radar);
      angles.forEach(function (angle, index) {
        if (previous === null ? angularDistance(centerAngle, angle) < 0.035 : crossedAngle(previous, centerAngle, angle)) {
          activateRadarNode(nodes[index], index, nodes.length);
        }
      });
      radarFrameId = window.requestAnimationFrame(frame);
    }
    radarFrameId = window.requestAnimationFrame(frame);
  }

  function stopRadarSweep() {
    if (radarFrameId) window.cancelAnimationFrame(radarFrameId);
    radarFrameId = 0;
    radarLastAngle = null;
    radarLastFrameTime = 0;
  }

  function getRadarNodeAngles(nodes, radar) {
    var radarRect = radar.getBoundingClientRect();
    var cx = radarRect.left + radarRect.width / 2;
    var cy = radarRect.top + radarRect.height / 2;
    return nodes.map(function (node) {
      var rect = node.getBoundingClientRect();
      var nx = rect.left + rect.width / 2;
      var ny = rect.top + rect.height / 2;
      return normalizeAngle(Math.atan2(ny - cy, nx - cx));
    });
  }

  function normalizeAngle(angle) {
    var full = Math.PI * 2;
    return ((angle % full) + full) % full;
  }

  function crossedAngle(previous, current, target) {
    if (current >= previous) return target > previous && target <= current;
    return target > previous || target <= current;
  }

  function angularDistance(a, b) {
    var diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
    return Math.min(diff, Math.PI * 2 - diff);
  }

  function activateRadarNode(node, index, count) {
    if (!node) return;
    node.classList.add("is-audible");
    window.setTimeout(function () {
      node.classList.remove("is-audible");
    }, 360);
    playRadarPing(index, count);
  }

  function playRadarPing(index, count) {
    if (!state.soundEnabled || !audioContext || audioContext.state !== "running") return;
    var now = audioContext.currentTime;
    if (!radarMusicStyle) radarMusicStyle = createRadarMusicStyle(views[state.currentView] || views.V0);
    var melody = generateRadarMelody(index, count, radarMusicStyle);
    scheduleRadarClick(now, index);
    melody.notes.forEach(function (step, noteIndex) {
      var noteStart = now + melody.offsets[noteIndex];
      var frequency = noteFrequency(melody.scale, step + melody.shift);
      scheduleRadarTone(noteStart, frequency, noteIndex, index, melody);
    });
  }

  function createRadarMusicStyle(view) {
    var profiles = [
      {
        name: "samba",
        scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
        stable: [0, 2, 4],
        intervals: [1, 1, 2, -1, 3],
        contour: "rise",
        rhythm: [0.064, 0.046, 0.082],
        gap: 0.072,
        swing: 0.018,
        duration: 0.17,
        accent: 1.08,
        glide: 1.018,
        timbre: "triangle",
        noteCounts: [3, 4, 4]
      },
      {
        name: "salsa",
        scale: [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5],
        stable: [0, 2, 4],
        intervals: [1, 2, -1, 2, 3],
        contour: "arch",
        rhythm: [0.058, 0.058, 0.092],
        gap: 0.074,
        swing: 0.024,
        duration: 0.16,
        accent: 1.06,
        glide: 1.015,
        timbre: "triangle",
        noteCounts: [4, 4, 5]
      },
      {
        name: "calypso",
        scale: [493.88, 554.37, 622.25, 739.99, 830.61, 987.77],
        stable: [0, 2, 4],
        intervals: [1, 2, -1, 1, 3],
        contour: "wave",
        rhythm: [0.072, 0.048, 0.076],
        gap: 0.078,
        swing: 0.03,
        duration: 0.18,
        accent: 1.03,
        glide: 1.017,
        timbre: "sine",
        noteCounts: [3, 4, 4]
      },
      {
        name: "afrobeat",
        scale: [440, 493.88, 554.37, 659.25, 739.99, 880],
        stable: [0, 2, 3],
        intervals: [1, 1, 2, -1, 2],
        contour: "wave",
        rhythm: [0.052, 0.07, 0.052, 0.086],
        gap: 0.068,
        swing: 0.02,
        duration: 0.15,
        accent: 1.1,
        glide: 1.014,
        timbre: "triangle",
        noteCounts: [4, 4, 5]
      },
      {
        name: "disco",
        scale: [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5],
        stable: [0, 2, 4],
        intervals: [1, 1, 2, 2, -1],
        contour: "rise",
        rhythm: [0.06, 0.06, 0.06, 0.078],
        gap: 0.066,
        swing: 0.01,
        duration: 0.15,
        accent: 1.12,
        glide: 1.012,
        timbre: "sine",
        noteCounts: [4, 4, 4]
      },
      {
        name: "funk",
        scale: [523.25, 587.33, 659.25, 698.46, 783.99, 880, 932.33, 1046.5],
        stable: [0, 2, 4, 6],
        intervals: [1, -1, 2, 1, 3],
        contour: "wave",
        rhythm: [0.046, 0.074, 0.048],
        gap: 0.062,
        swing: 0.026,
        duration: 0.14,
        accent: 1.14,
        glide: 1.011,
        timbre: "triangle",
        noteCounts: [3, 4, 4]
      },
      {
        name: "k-pop",
        scale: [587.33, 659.25, 739.99, 880, 987.77, 1174.66],
        stable: [0, 2, 4],
        intervals: [1, 2, 2, -1, 3],
        contour: "rise",
        rhythm: [0.052, 0.052, 0.07],
        gap: 0.06,
        swing: 0.008,
        duration: 0.14,
        accent: 1.16,
        glide: 1.016,
        timbre: "sine",
        noteCounts: [4, 4, 5]
      },
      {
        name: "cumbia",
        scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
        stable: [0, 2, 4],
        intervals: [1, -1, 2, 1, 2],
        contour: "arch",
        rhythm: [0.084, 0.052, 0.064],
        gap: 0.078,
        swing: 0.028,
        duration: 0.17,
        accent: 1.04,
        glide: 1.013,
        timbre: "triangle",
        noteCounts: [3, 4, 4]
      },
      {
        name: "bhangra",
        scale: [587.33, 659.25, 739.99, 880, 987.77, 1174.66],
        stable: [0, 2, 4],
        intervals: [1, 2, -1, 2, 3],
        contour: "rise",
        rhythm: [0.052, 0.052, 0.082, 0.052],
        gap: 0.064,
        swing: 0.014,
        duration: 0.15,
        accent: 1.18,
        glide: 1.018,
        timbre: "triangle",
        noteCounts: [4, 4, 5]
      },
      {
        name: "highlife",
        scale: [493.88, 554.37, 622.25, 739.99, 830.61, 987.77],
        stable: [0, 2, 4],
        intervals: [1, 2, 1, -1, 3],
        contour: "wave",
        rhythm: [0.058, 0.074, 0.052],
        gap: 0.07,
        swing: 0.022,
        duration: 0.16,
        accent: 1.08,
        glide: 1.015,
        timbre: "sine",
        noteCounts: [3, 4, 4]
      }
    ];
    var profile = profiles[Math.floor(Math.random() * profiles.length)];
    var startStep = profile.stable[Math.floor(Math.random() * profile.stable.length)];
    var viewLift = view && view.tone === "researcher" ? 1 : view && view.tone === "investor" ? 2 : 0;
    return {
      name: profile.name,
      scale: profile.scale.slice(),
      stable: profile.stable.slice(),
      intervals: profile.intervals.slice(),
      contour: profile.contour,
      rhythm: profile.rhythm ? profile.rhythm.slice() : null,
      gap: profile.gap + Math.random() * 0.008,
      swing: profile.swing,
      duration: profile.duration + Math.random() * 0.02,
      accent: profile.accent + Math.random() * 0.14,
      glide: profile.glide,
      timbre: profile.timbre,
      currentStep: startStep + viewLift,
      phraseIndex: 0,
      noteCount: profile.noteCounts[Math.floor(Math.random() * profile.noteCounts.length)],
      cadenceEvery: 2 + Math.floor(Math.random() * 3),
      minStep: 0,
      maxStep: profile.scale.length + 6
    };
  }

  function generateRadarMelody(index, count, style) {
    var noteCount = Math.min(5, style.noteCount + (Math.random() > 0.88 ? 1 : 0));
    var current = typeof style.currentStep === "number" ? style.currentStep : style.stable[0];
    var notes = [current];
    for (var i = 1; i < noteCount - 1; i += 1) {
      current += chooseMelodicInterval(style, i, noteCount);
      current = Math.max(style.minStep, Math.min(current, style.maxStep));
      notes.push(current);
    }
    var target = chooseCadenceStep(style, current);
    notes.push(target);
    style.currentStep = target + (Math.random() > 0.62 ? chooseMelodicInterval(style, 1, noteCount) : 0);
    style.currentStep = Math.max(style.minStep, Math.min(style.currentStep, style.maxStep));
    style.phraseIndex += 1;
    return {
      scale: style.scale,
      notes: notes,
      offsets: melodyOffsets(noteCount, style),
      shift: Math.floor(index / Math.max(count || 1, 1)),
      accent: style.accent,
      duration: style.duration,
      glide: style.glide,
      timbre: style.timbre
    };
  }

  function chooseMelodicInterval(style, noteIndex, noteCount) {
    var interval = style.intervals[Math.floor(Math.random() * style.intervals.length)];
    if (style.contour === "rise" && interval < 0 && Math.random() > 0.28) interval = Math.abs(interval);
    if (style.contour === "fall" && interval > 0 && Math.random() > 0.28) interval = -interval;
    if (style.contour === "arch" && noteIndex > noteCount / 2 && interval > 0) interval = -interval;
    if (style.contour === "arch" && noteIndex <= noteCount / 2 && interval < 0 && Math.random() > 0.35) interval = Math.abs(interval);
    if (style.contour === "wave" && (style.phraseIndex + noteIndex) % 2 && Math.random() > 0.35) interval = -interval;
    return interval || 1;
  }

  function chooseCadenceStep(style, current) {
    var stable = style.stable[Math.floor(Math.random() * style.stable.length)];
    var octave = Math.round(current / style.scale.length);
    var target = stable + octave * style.scale.length;
    if ((style.phraseIndex + 1) % style.cadenceEvery === 0) {
      target = style.stable[0] + Math.max(0, octave) * style.scale.length;
    }
    if (Math.abs(target - current) > 4) {
      target += target > current ? -style.scale.length : style.scale.length;
    }
    return Math.max(style.minStep, Math.min(target, style.maxStep));
  }

  function melodyOffsets(noteCount, style) {
    var offsets = [0];
    var cursor = 0;
    for (var i = 1; i < noteCount; i += 1) {
      var rhythmGap = style.rhythm ? style.rhythm[(i - 1) % style.rhythm.length] : style.gap;
      cursor += rhythmGap + (i % 2 ? style.swing : 0) + Math.random() * 0.008;
      offsets.push(cursor);
    }
    return offsets;
  }

  function noteFrequency(scale, step) {
    var octave = Math.floor(step / scale.length);
    var wrapped = ((step % scale.length) + scale.length) % scale.length;
    return scale[wrapped] * Math.pow(2, octave);
  }

  function scheduleRadarClick(startTime, index) {
    var chirp = audioContext.createOscillator();
    var chirpGain = audioContext.createGain();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(1180 + index * 18, startTime);
    chirp.frequency.exponentialRampToValueAtTime(760 + index * 10, startTime + 0.055);
    chirpGain.gain.setValueAtTime(0.0001, startTime);
    chirpGain.gain.exponentialRampToValueAtTime(0.018, startTime + 0.006);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.07);
    chirp.connect(chirpGain);
    connectAudio(chirpGain);
    chirp.start(startTime);
    chirp.stop(startTime + 0.08);
  }

  function scheduleRadarTone(startTime, frequency, noteIndex, nodeIndex, melody) {
    var oscillator = audioContext.createOscillator();
    var overtone = audioContext.createOscillator();
    var gain = audioContext.createGain();
    var overtoneGain = audioContext.createGain();
    var duration = melody.duration + noteIndex * 0.012;
    var peak = Math.max(0.016, (0.036 - noteIndex * 0.004) * melody.accent);
    oscillator.type = "sine";
    overtone.type = noteIndex % 2 ? melody.timbre : "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * (melody.glide + nodeIndex * 0.001), startTime + duration);
    overtone.frequency.setValueAtTime(frequency * 2, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    overtoneGain.gain.setValueAtTime(0.0001, startTime);
    overtoneGain.gain.exponentialRampToValueAtTime(peak * 0.22, startTime + 0.014);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.82);
    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    connectAudio(gain);
    connectAudio(overtoneGain);
    oscillator.start(startTime);
    overtone.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
    overtone.stop(startTime + duration);
  }

  if (state.reducedMotion) {
    app.classList.add("is-reduced-motion");
    track("reduced_motion_detected");
  }

  loadStoredState();
  render();
  initParticles();

  function initParticles() {
    var canvas = document.getElementById("arena-particles");
    if (!canvas || state.reducedMotion) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var particles = [];
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var labels = ["Noise", "Claim", "Signal", "Failure", "Validated"];
    var running = true;
    var particleFrameId = 0;
    var particleLastFrameTime = 0;

    function resize() {
      width = app.clientWidth;
      height = app.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    }

    function makeParticles() {
      var count = width < 720 ? 80 : 120;
      particles = [];
      for (var i = 0; i < count; i += 1) {
        var validated = Math.random() > 0.7;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          r: validated ? 1.8 + Math.random() * 1.8 : 0.8 + Math.random() * 1.2,
          alpha: validated ? 0.65 + Math.random() * 0.35 : 0.08 + Math.random() * 0.22,
          validated: validated,
          label: labels[Math.floor(Math.random() * labels.length)]
        });
      }
    }

    function draw(now) {
      particleFrameId = 0;
      if (!running) return;
      if (now && now - particleLastFrameTime < 32) {
        particleFrameId = window.requestAnimationFrame(draw);
        return;
      }
      particleLastFrameTime = now || performance.now();
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.9;
      var cx = width * 0.52;
      var cy = height * 0.48;
      var radius = Math.min(width, height) * 0.34;
      ctx.strokeStyle = "rgba(84, 231, 226, 0.16)";
      ctx.lineWidth = 1;
      ctx.setLineDash([18, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -0.4, Math.PI * 1.72);
      ctx.stroke();
      ctx.setLineDash([]);

      particles.forEach(function (p, index) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        ctx.fillStyle = p.validated ? "rgba(84, 231, 226, " + p.alpha + ")" : "rgba(255, 255, 255, " + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.validated && index % 13 === 0) {
          ctx.fillStyle = "rgba(84, 231, 226, 0.34)";
          ctx.font = "10px Inter, sans-serif";
          ctx.fillText(p.label, p.x + 6, p.y - 6);
        }
      });

      var validated = particles.filter(function (p) { return p.validated; }).slice(0, 16);
      ctx.strokeStyle = "rgba(84, 231, 226, 0.18)";
      validated.forEach(function (a, index) {
        var b = validated[(index + 3) % validated.length];
        if (!b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      ctx.restore();
      particleFrameId = window.requestAnimationFrame(draw);
    }

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (!running && particleFrameId) {
        window.cancelAnimationFrame(particleFrameId);
        particleFrameId = 0;
      }
      if (running && !particleFrameId) particleFrameId = window.requestAnimationFrame(draw);
    });
    window.addEventListener("resize", resize);
    resize();
    particleFrameId = window.requestAnimationFrame(draw);
  }
})();

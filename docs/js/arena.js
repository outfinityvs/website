(function () {
  var app = document.getElementById("arena-app");
  var host = document.getElementById("arena-view");
  if (!app || !host) return;

  var storageKey = "outfinity.quickPresentation.state.v1";
  var legacyStorageKey = "outfinity.navigator.state.v1";
  var towerUrl = "tower.html";

  var state = {
    role: "",
    branchChoice: "",
    currentView: "V0",
    soundEnabled: true,
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    completedViews: new Set(),
    history: [],
    started: false
  };

  var views = {
    V0: {
      tone: "neutral",
      headline: ["AI Builds Fast"],
      subtitle: [
        "Social Legitimacy and Early Validation is the scarce asset. Start the Quick Presentation for a fast Outfinity scan, or visit the full site."
      ],
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
      actions: [{ label: "Continue", next: "V3", primary: true, icon: "continue" }]
    },
    V3: {
      tone: "neutral",
      headline: ["See The Wider Stakes"],
      subtitle: ["AI ventures shape work, science, finance, trust, coordination, and governance. Outfinity helps test what deserves to become real before it asks for belief."],
      graphic: {
        type: "map",
        items: [
          { label: "Work", href: "ventures/outfinity-works.html" },
          { label: "Science", href: "ventures/executable-science-ai-lab.html" },
          { label: "Finance", href: "investors.html" },
          { label: "Trust", href: "ventures/legitimacy-ventures-ai-abundant-societies.html" },
          { label: "Coordination", href: "ventures/webmeet-ai-collaboration-cloud.html" },
          { label: "Governance", href: "ventures/social-technologies-research.html" }
        ]
      },
      actions: [{ label: "Choose your role", next: "V2", primary: true, icon: "roles" }]
    },
    V2: {
      tone: "neutral",
      headline: ["Choose Your Role"],
      subtitle: ["Choose the lens that fits you: entrepreneur, investor, or researcher. Quick Presentation gives the short version; the full site has the details."],
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
        }
      ],
      graphic: {
        type: "choice-ring",
        items: [
          { label: "Entrepreneur", href: "partners/founder-operators.html" },
          { label: "Investor", href: "investors.html" },
          { label: "Researcher", href: "partners/research-partners.html" }
        ]
      }
    },
    B1: {
      tone: "builder",
      headline: ["For Entrepreneurs"],
      subtitle: ["Outfinity helps entrepreneurs turn a thesis, capability, or market access into validated venture material before the company gets expensive."],
      statement: "We clarify PMF, rights, prototype evidence, team gaps, and capital readiness.",
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
      actions: [
        { label: "Continue", next: "V6", primary: true, icon: "continue" }
      ]
    },
    I1: {
      tone: "investor",
      headline: ["For Investors"],
      subtitle: ["Outfinity helps investors see whether an AI opportunity has technical truth, market signal, defensibility, rights clarity, and a real formation path."],
      statement: "The goal is not another pitch review. It is a sharper interface with evidence before capital follows the story.",
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
      actions: [
        { label: "Continue", next: "V6", primary: true, icon: "continue" }
      ]
    },
    R1: {
      tone: "researcher",
      headline: ["For Researchers"],
      subtitle: ["Outfinity helps serious research move from papers and prototypes into systems, partners, rights clarity, ventures, or institutions."],
      statement: "The work is translation: what should be built, who should validate it, and what structure can carry it into the world.",
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
      actions: [
        { label: "Continue", next: "V6", primary: true, icon: "continue" }
      ]
    },
    V6: {
      tone: "neutral",
      headline: ["Venture Validation Studio"],
      subtitle: ["Outfinity reduces uncertainty before capital, teams, and public narratives commit. We test technical truth, market signal, rights, and formation risk early."],
      statement: "For investors, validation means clearer decisions: fund, investigate, reshape, or stop before the expensive phase.",
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
    var html = "";
    html += '<div class="arena-copy">';
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
    html += renderActions(view);
    html += "</div>";
    return html;
  }

  function renderActions(view) {
    var actions = view.actions;
    var choiceActions = view.choices ? renderChoiceActions(view) : "";
    var back = state.history.length ? '<button class="arena-control arena-back arena-icon-only" type="button" data-back aria-label="Back" title="Back">' + buttonIcon("back") + "</button>" : "";
    var home = state.history.length ? '<button class="arena-control arena-home arena-icon-only" type="button" data-home aria-label="Home" title="Home">' + buttonIcon("home") + "</button>" : "";
    var roleShortcut = state.currentView !== "V0" ? '<button class="arena-control arena-role-shortcut arena-icon-only" type="button" data-choose-role aria-label="Choose Your Role" title="Choose Your Role">' + buttonIcon("roles") + "</button>" : "";
    var main = actions && actions.length ? actions.map(function (action) {
      var classes = ["arena-action"];
      if (action.primary) classes.push("arena-action-primary");
      if (action.visual) classes.push("arena-action-visual");
      if (action.href) {
        return '<a class="' + classes.join(" ") + '" href="' + escapeHtml(action.href) + '" target="_blank" rel="noopener noreferrer" data-intent="' + escapeHtml(action.intent || "") + '">' + actionContent(action) + "</a>";
      }
      return '<button class="' + classes.join(" ") + '" type="button" data-next="' + escapeHtml(action.next) + '"' + (action.start ? ' data-start="true"' : "") + ">" + actionContent(action) + "</button>";
    }).join("") : "";
    return '<div class="arena-action-zone" aria-label="Quick Presentation actions">' +
      back +
      home +
      roleShortcut +
      main +
      choiceActions +
      '<a class="arena-control arena-tower-link" href="' + towerUrl + '" target="_blank" rel="noopener noreferrer" title="Open the full site" data-intent="tower">' + buttonIcon("details") + '<span>Visit Site</span></a>' +
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
      home: '<path d="M4 11 12 4l8 7"></path><path d="M6 10v10h12V10"></path><path d="M10 20v-6h4v6"></path>',
      enter: '<path d="M6 18 18 6M8 6h10v10"></path>',
      continue: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
      roles: '<path d="M8 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path><path d="M16 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"></path><path d="M3 20c1-3 3-4 5-4s4 1 5 4"></path><path d="M13 20c.8-2 2-3 3.5-3 1.7 0 3 1 3.5 3"></path>',
      studio: '<path d="M5 19V5h14v14"></path><path d="M8 9h8M8 13h5"></path><path d="M5 19h14"></path>',
      capital: '<path d="M4 17 9 9l4 5 3-7 4 10"></path>',
      research: '<path d="M6 4h8l4 4v12H6z"></path><path d="M14 4v5h5"></path><path d="M9 14h6M9 17h4"></path>',
      process: '<path d="M5 12a7 7 0 0 1 12-5"></path><path d="M17 4v4h-4"></path><path d="M19 12a7 7 0 0 1-12 5"></path><path d="M7 20v-4h4"></path>',
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
    html += renderSoundToggle();
    html += renderRadar(view, graphic);
    html += "</div>";
    return html;
  }

  function renderRadar(view, graphic) {
    var items = collectRadarItems(view, graphic);
    var center = radarCenter(graphic);
    var count = Math.max(items.length, 1);
    return '<div class="arena-radar" style="--count:' + count + '">' +
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
          return '<a class="arena-radar-node" href="' + escapeHtml(item.href) + '" target="_blank" rel="noopener noreferrer"' + style + ' aria-label="Open ' + escapeHtml(item.label) + '">' + content + "</a>";
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
      if (typeof saved.soundEnabled === "boolean") state.soundEnabled = saved.soundEnabled;
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
        tokens: text.match(/\S+\s*/g) || [text],
        index: 0,
        headline: !!span.closest(".arena-headline")
      });
      span.textContent = "";
    });
    var itemIndex = 0;
    function tick() {
      if (token !== renderToken) return;
      var item = queue[itemIndex];
      if (!item) return;
      item.el.textContent += item.tokens[item.index] || "";
      item.index += 1;
      if (item.index >= item.tokens.length) itemIndex += 1;
      window.setTimeout(tick, item.headline ? 105 : 36);
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

  host.addEventListener("click", function (event) {
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
        var backAudio = prepareAudioForInteraction();
        goBack();
        playWhenAudioReady(backAudio);
      }
      return;
    }
    var homeAction = event.target.closest("[data-home]");
    if (homeAction) {
      event.preventDefault();
      var homeAudio = prepareAudioForInteraction();
      goHome();
      playWhenAudioReady(homeAudio);
      return;
    }
    var roleShortcut = event.target.closest("[data-choose-role]");
    if (roleShortcut) {
      event.preventDefault();
      var roleAudio = prepareAudioForInteraction();
      if (state.currentView !== "V2") go("V2");
      playWhenAudioReady(roleAudio);
      return;
    }
    var action = event.target.closest("[data-next]");
    if (!action) return;
    event.preventDefault();
    var audioReady = prepareAudioForInteraction();
    if (action.dataset.start && !state.started) {
      state.started = true;
      track("arena_started");
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
    if (intent === "tower") track("tower_clicked", { intent: intent });
  });

  var audioContext = null;
  var masterGain = null;
  var radarFrameId = 0;
  var radarLastAngle = null;
  var radarCycleMs = 4800;
  var radarSweepOffset = -Math.PI / 3;
  var radarMusicStyle = null;

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    updateSoundButtons();
    saveStoredState();
    track("sound_toggled");
    if (state.soundEnabled) {
      playWhenAudioReady(ensureAudio());
    }
  }

  function ensureAudio() {
    if (!state.soundEnabled) return Promise.resolve(false);
    if (!audioContext) {
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return Promise.resolve(false);
      audioContext = new AudioCtor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.48;
      masterGain.connect(audioContext.destination);
    }
    var ready = audioContext.state === "suspended" ? audioContext.resume() : Promise.resolve();
    return ready.then(function () {
      return !!audioContext && audioContext.state === "running";
    }).catch(function () {
      return false;
    });
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
    var sweep = host.querySelector(".arena-radar-sweep");
    var radar = host.querySelector(".arena-radar");
    if (!sweep || !radar) return;
    var startTime = performance.now();
    radarLastAngle = null;

    function frame(now) {
      if (token !== renderToken) return;
      var nodes = Array.from(host.querySelectorAll(".arena-radar-node"));
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
        scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
        stable: [0, 2, 4],
        intervals: [-1, 1, 1, 2],
        contour: "rise",
        gap: 0.104,
        swing: 0.018,
        duration: 0.24,
        accent: 0.9,
        glide: 1.01,
        timbre: "sine"
      },
      {
        scale: [523.25, 587.33, 622.25, 698.46, 783.99, 932.33, 1046.5],
        stable: [0, 3, 4],
        intervals: [-2, -1, 1, 2],
        contour: "arch",
        gap: 0.118,
        swing: 0.026,
        duration: 0.27,
        accent: 0.82,
        glide: 1.014,
        timbre: "triangle"
      },
      {
        scale: [493.88, 554.37, 659.25, 739.99, 830.61, 987.77],
        stable: [0, 2, 4],
        intervals: [-1, 1, 2, -2],
        contour: "wave",
        gap: 0.11,
        swing: 0.022,
        duration: 0.25,
        accent: 0.86,
        glide: 1.012,
        timbre: "sine"
      },
      {
        scale: [440, 523.25, 587.33, 659.25, 783.99, 880],
        stable: [0, 3, 5],
        intervals: [-2, -1, 1, 1, 3],
        contour: "fall",
        gap: 0.124,
        swing: 0.016,
        duration: 0.29,
        accent: 0.78,
        glide: 1.009,
        timbre: "triangle"
      }
    ];
    var profile = profiles[Math.floor(Math.random() * profiles.length)];
    var startStep = profile.stable[Math.floor(Math.random() * profile.stable.length)];
    var viewLift = view && view.tone === "researcher" ? 1 : view && view.tone === "investor" ? 2 : 0;
    return {
      scale: profile.scale.slice(),
      stable: profile.stable.slice(),
      intervals: profile.intervals.slice(),
      contour: profile.contour,
      gap: profile.gap + Math.random() * 0.014,
      swing: profile.swing,
      duration: profile.duration + Math.random() * 0.035,
      accent: profile.accent + Math.random() * 0.18,
      glide: profile.glide,
      timbre: profile.timbre,
      currentStep: startStep + viewLift,
      phraseIndex: 0,
      noteCount: Math.random() > 0.45 ? 5 : 4,
      cadenceEvery: 3 + Math.floor(Math.random() * 3),
      minStep: -2,
      maxStep: profile.scale.length + 5
    };
  }

  function generateRadarMelody(index, count, style) {
    var noteCount = style.noteCount + (Math.random() > 0.72 ? 1 : 0);
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
      cursor += style.gap + (i % 2 ? style.swing : 0) + Math.random() * 0.012;
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
      var count = width < 720 ? 110 : 200;
      particles = [];
      for (var i = 0; i < count; i += 1) {
        var validated = Math.random() > 0.7;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: validated ? 1.8 + Math.random() * 1.8 : 0.8 + Math.random() * 1.2,
          alpha: validated ? 0.65 + Math.random() * 0.35 : 0.08 + Math.random() * 0.22,
          validated: validated,
          label: labels[Math.floor(Math.random() * labels.length)]
        });
      }
    }

    function draw() {
      if (!running) return;
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
      window.requestAnimationFrame(draw);
    }

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) draw();
    });
    window.addEventListener("resize", resize);
    resize();
    draw();
  }
})();

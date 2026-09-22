(function () {
  "use strict";

  var data = WORKSHOP_DATA;
  var languageStorageKey = "iisl-workshop-language";
  var language = readLanguage();
  var cleanupReveal = null;
  var byId = function (id) {
    return document.getElementById(id);
  };
  var escapeHtml = function (value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("'", "&#39;")
      .replaceAll('"', "&quot;");
  };
  var isExternal = function (url) {
    return String(url).startsWith("http://") || String(url).startsWith("https://");
  };
  var externalAttributes = function (url) {
    return isExternal(url)
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";
  };

  function readLanguage() {
    try {
      return window.sessionStorage.getItem(languageStorageKey) === "ko" ? "ko" : "en";
    } catch (error) {
      // Storage can be unavailable in restricted browsers or local-file previews.
      return "en";
    }
  }

  function saveLanguage() {
    try {
      window.sessionStorage.setItem(languageStorageKey, language);
    } catch (error) {
      // Switching still works on the current page when storage is blocked.
    }
  }

  function translate(value, replacements) {
    var dictionary = WORKSHOP_TRANSLATIONS[language] || {};
    var text = Object.prototype.hasOwnProperty.call(dictionary, value)
      ? dictionary[value]
      : value;
    return replacements
      ? text.replace(/\{(\w+)\}/g, function (match, key) {
          return Object.prototype.hasOwnProperty.call(replacements, key)
            ? replacements[key]
            : match;
        })
      : text;
  }

  // Build a translated copy so switching back never mutates the English source.
  function localizeData(value) {
    if (typeof value === "string") return translate(value);
    if (Array.isArray(value)) return value.map(localizeData);
    if (value && typeof value === "object") {
      var localized = {};
      Object.keys(value).forEach(function (key) {
        localized[key] = localizeData(value[key]);
      });
      return localized;
    }
    return value;
  }

  function renderLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = translate(element.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
      element.setAttribute("aria-label", translate(element.getAttribute("data-i18n-aria-label")));
    });
    var toggle = byId("language-toggle");
    toggle.textContent = language === "en" ? "한국어" : "English";
    toggle.setAttribute("lang", language === "en" ? "ko" : "en");
    toggle.setAttribute("aria-label", language === "en" ? "한국어로 전환" : "Switch to English");
    var menuOpen = document.querySelector(".menu-button").getAttribute("aria-expanded") === "true";
    setText("menu-label", translate(menuOpen ? "Close navigation" : "Open navigation"));
  }

  function renderTrackLabel(value) {
    var parts = String(value || "").split(" · ");
    if (parts.length < 2) {
      return escapeHtml(value);
    }

    return (
      '<span class="program-track-index">' +
      escapeHtml(parts.shift()) +
      " · </span>" +
      escapeHtml(parts.join(" · "))
    );
  }

  function setText(id, value) {
    var element = byId(id);
    if (element) element.textContent = value || "";
  }

  function registrationLink(className) {
    var cssClass = className || "button button-registration";
    if (!data.meta.registrationUrl) {
      return (
        '<span class="' +
        cssClass +
        ' is-disabled" aria-disabled="true">' +
        escapeHtml(data.meta.registrationLabel) +
        "</span>"
      );
    }
    return (
      '<a class="' +
      cssClass +
      '" href="' +
      escapeHtml(data.meta.registrationUrl) +
      '"' +
      externalAttributes(data.meta.registrationUrl) +
      ">" +
      escapeHtml(data.meta.registrationLabel) +
      "</a>"
    );
  }

  function renderMeta() {
    var meta = data.meta;
    var titleMeta = WORKSHOP_DATA.meta;
    document.title =
      titleMeta.themeTitle + " — " + titleMeta.shortName + " " + titleMeta.year;
    document.querySelector('meta[name="description"]').setAttribute("content", meta.summary);
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute(
        "content",
        meta.title + " " + meta.titleAccent + " · " + meta.themeTitle
      );
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", meta.summary);

    setText("nav-brand", meta.shortName + " " + meta.year);
    setText("footer-brand", meta.shortName + " " + meta.year);
    setText("hero-eyebrow", meta.eyebrow);
    setText("hero-title", meta.title);
    setText("hero-title-accent", meta.titleAccent);
    setText("hero-theme", meta.themeTitle);
    byId("hero-theme").hidden = language === "ko" && !String(meta.themeTitle || "").trim();
    setText("hero-date", meta.date);
    setText("hero-location", [meta.location, meta.cityName]
      .map(function (part) { return String(part || "").trim(); })
      .filter(Boolean)
      .join(", "));
    setText("hero-summary", meta.summary);
    setText("footer-tagline", meta.summary);

    byId("theme-chips").innerHTML = (meta.themeLabels || [])
      .map(function (label) {
        return "<span>" + escapeHtml(label) + "</span>";
      })
      .join("");

    byId("hero-actions").innerHTML =
      registrationLink() +
      '<a class="button button-secondary" href="#program">' +
      escapeHtml(translate("View the program")) + ' <span aria-hidden="true">↓</span></a>';

    var facts = [
      { label: translate("Date"), value: meta.date, detail: "" },
      { label: translate("Time"), value: meta.time, detail: "" },
      { label: translate("Location"), value: meta.location, detail: meta.city },
    ];
    byId("event-facts").innerHTML = facts
      .map(function (fact) {
        return (
          '<div class="fact"><span class="fact-label">' +
          escapeHtml(fact.label) +
          "</span><strong>" +
          escapeHtml(fact.value) +
          (fact.detail ? "<br><span>" + escapeHtml(fact.detail) + "</span>" : "") +
          "</strong></div>"
        );
      })
      .join("");
  }

  function renderAbout() {
    setText("about-label", data.about.label);
    setText("about-title", data.about.title);
    byId("about-copy").innerHTML = data.about.paragraphs
      .map(function (paragraph) {
        return "<p>" + escapeHtml(paragraph) + "</p>";
      })
      .join("");
    byId("topic-list").innerHTML = data.about.topics
      .map(function (topic) {
        return (
          '<article class="topic reveal"><span>' +
          escapeHtml(topic.number) +
          "</span><div><h3>" +
          escapeHtml(topic.title) +
          "</h3><p>" +
          escapeHtml(topic.description) +
          "</p></div></article>"
        );
      })
      .join("");
  }

  function renderProgram() {
    setText("program-title", data.program.title);
    setText(
      "program-note",
      translate("Confirmed program · {date} · {time} at {location}.", data.meta)
    );
    byId("program-list").innerHTML = data.program.items.map(renderProgramItem).join("");
  }

  function renderProgramItem(item) {
    if (item.type === "track") {
      return (
        '<div class="program-track"><span>' +
        renderTrackLabel(item.label) +
        "</span><div><h3>" +
        escapeHtml(item.title) +
        "</h3></div></div>"
      );
    }

    if (item.type === "note") {
      return (
        '<div class="program-note-row"><span>' +
        escapeHtml(item.label) +
        "</span><strong>" +
        escapeHtml(item.title) +
        "</strong></div>"
      );
    }

    var range = "<strong>" + escapeHtml(item.time) + "</strong>";
    if (item.endTime) {
      range += "<span>→ " + escapeHtml(item.endTime) + "</span>";
    }

    if (item.type === "break") {
      return (
        '<div class="program-break"><time>' +
        range +
        "</time><strong>" +
        escapeHtml(item.title) +
        "</strong></div>"
      );
    }

    return (
      '<div class="program-item"><div class="program-summary"><time>' +
      range +
      '</time><div class="program-main"><h3>' +
      escapeHtml(item.title) +
      '</h3><p class="program-speaker">' +
      escapeHtml(item.speaker) +
      " <span>· " +
      escapeHtml(item.affiliation) +
      "</span></p></div></div></div>"
    );
  }

  function renderSpeakers() {
    setText("speakers-title", data.sections.speakers);
    byId("speaker-grid").innerHTML = data.speakers.map(renderSpeakerCard).join("");
  }

  function renderSpeakerCard(speaker, index) {
    var image = speaker.image
      ? '<img src="' +
        escapeHtml(speaker.image) +
        '" alt="' +
        escapeHtml(speaker.name) +
        '" loading="lazy" />'
      : '<span class="speaker-initials" aria-hidden="true">' +
        escapeHtml(speaker.name.slice(0, 2)) +
        "</span>";
    var cardTag = speaker.url ? "a" : "article";
    var cardAttributes = speaker.url
      ? ' href="' +
        escapeHtml(speaker.url) +
        '"' +
        externalAttributes(speaker.url) +
        ' aria-label="' + escapeHtml(speaker.name) + ' — ' + escapeHtml(translate("Visit website")) + '"'
      : "";
    var name = escapeHtml(speaker.name);
    return (
      '<' + cardTag + cardAttributes +
      ' class="speaker-card reveal" style="--card-index:' +
      index +
      '"><div class="speaker-photo">' +
      image +
      '</div><div class="speaker-meta"><p>' +
      escapeHtml(speaker.affiliation) +
      "</p><h3>" +
      name +
      "</h3><span>" +
      escapeHtml(speaker.role) +
      '</span></div><p class="speaker-talk">' +
      escapeHtml(speaker.talk) +
      "</p></" + cardTag + ">"
    );
  }

  function renderVenue() {
    var meta = data.meta;
    var venue = data.venue;
    var details = [
      { label: translate("Date"), value: meta.date },
      { label: translate("Time"), value: meta.time },
      { label: translate("Program"), value: venue.programSummary },
    ];
    setText("venue-name", meta.location);
    setText("venue-address", meta.city);
    var map = byId("venue-map");
    if (map && venue.mapEmbedUrl) {
      // Keep the existing map (and its zoom/pan state) when only the language changes.
      if (map.getAttribute("src") !== venue.mapEmbedUrl) map.setAttribute("src", venue.mapEmbedUrl);
      map.title = translate("Interactive map showing {location}", meta);
    }
    byId("venue-details").innerHTML = details
      .map(function (detail) {
        return (
          "<div><span>" +
          escapeHtml(detail.label) +
          "</span><p>" +
          escapeHtml(detail.value) +
          "</p></div>"
        );
      })
      .join("");
    byId("venue-actions").innerHTML = venue.mapUrl
      ? '<a class="text-link" href="' +
        escapeHtml(venue.mapUrl) +
        '"' +
        externalAttributes(venue.mapUrl) +
        '>' + escapeHtml(translate("Open in maps")) + ' <span aria-hidden="true">↗</span></a>'
      : '<span class="text-link is-disabled">' + escapeHtml(translate("Map link coming soon")) + '</span>';
  }

  function renderInstitutionVisual(institution) {
    var logoClass = "institution-logo";
    var supportedScales = ["large", "expanded", "small", "extra-large"];
    if (supportedScales.includes(institution.logoScale)) {
      logoClass += " institution-logo-" + institution.logoScale;
    }

    if (!institution.logo) {
      return '<span class="institution-wordmark">' +
        escapeHtml(institution.displayName || institution.name) +
        "</span>";
    }
    if (institution.logoScale === "expanded") {
      // DGIST's visible artwork occupies this region of the 760 × 201 PNG.
      // Frame that region directly so transparent padding cannot shift alignment.
      return (
        '<svg class="' + logoClass +
        '" viewBox="209 48 343 105" width="343" height="105" role="img" aria-label="' +
        escapeHtml(institution.name) + ' ' + escapeHtml(translate("logo")) + '">' +
        '<image href="' + escapeHtml(institution.logo) +
        '" width="760" height="201" /></svg>'
      );
    }
    return '<img class="' + logoClass +
      '" src="' + escapeHtml(institution.logo) +
      '" alt="' + escapeHtml(institution.name) +
      ' ' + escapeHtml(translate("logo")) + '" loading="lazy" />';
  }

  function renderInstitutionCard(institution) {
    var visual = renderInstitutionVisual(institution);
    var cardClass = "institution-card" + (institution.logo ? " has-logo" : "");

    if (institution.url) {
      return (
        '<a class="' +
        cardClass +
        '" href="' +
        escapeHtml(institution.url) +
        '"' +
        externalAttributes(institution.url) +
        ' aria-label="' +
        escapeHtml(institution.name) +
        '">' +
        visual +
        "</a>"
      );
    }

    return (
      '<div class="' +
      cardClass +
      '" aria-label="' +
      escapeHtml(institution.name) +
      '">' +
      visual +
      "</div>"
    );
  }

  function renderInstitutionList(id, institutions) {
    byId(id).innerHTML = institutions.map(renderInstitutionCard).join("");
  }

  function renderInstitutions() {
    renderInstitutionList("host-grid", data.institutions.hosts);
    renderInstitutionList("support-grid", data.institutions.supporters);
  }

  function renderFooter() {
    setText(
      "copyright",
      "© " +
        new Date().getFullYear() +
        " " +
        data.meta.shortName +
        ". " + translate("All rights reserved.")
    );
  }

  function setupNavigation() {
    var button = document.querySelector(".menu-button");
    var links = byId("nav-links");
    var label = byId("menu-label");
    var setOpen = function (isOpen) {
      button.setAttribute("aria-expanded", String(isOpen));
      links.classList.toggle("is-open", isOpen);
      label.textContent = translate(isOpen ? "Close navigation" : "Open navigation");
    };

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        button.getAttribute("aria-expanded") === "true"
      ) {
        setOpen(false);
        button.focus();
      }
    });
  }

  function setupSectionNavigation() {
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    var cleanUrl = function () {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    };

    // Delegation also handles the hero link recreated by a language switch.
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute("href").slice(1);
      var target = targetId ? byId(targetId) : null;
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      if (link.classList.contains("skip-link")) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      if (window.location.hash) cleanUrl();
    });

    if (window.location.hash) {
      var initialTarget = byId(window.location.hash.slice(1));
      if (initialTarget) {
        window.requestAnimationFrame(function () {
          initialTarget.scrollIntoView({ behavior: "auto", block: "start" });
          cleanUrl();
        });
      }
    }
  }

  function setupHomeReload() {
    document.querySelectorAll('a.brand[href="./"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
        window.location.assign(link.href);
      });
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var lastScrollY = Math.max(window.scrollY, 0);
    var scrollDirection = "down";
    var onScroll = function () {
      var currentScrollY = Math.max(window.scrollY, 0);
      if (currentScrollY !== lastScrollY) {
        scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            if (scrollDirection === "up") {
              entry.target.classList.add("is-reveal-static");
            } else {
              entry.target.classList.remove("is-reveal-static");
            }
            entry.target.classList.add("is-visible");
          } else if (!entry.isIntersecting) {
            entry.target.classList.remove(
              "is-visible",
              "is-reveal-static"
            );
          }
        });
      },
      { threshold: [0, 0.12] }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
    return function () {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }

  function renderPage() {
    if (cleanupReveal) cleanupReveal();
    data = language === "en" ? WORKSHOP_DATA : localizeData(WORKSHOP_DATA);
    renderLanguage();
    renderMeta();
    renderAbout();
    renderProgram();
    renderSpeakers();
    renderVenue();
    renderInstitutions();
    renderFooter();
    cleanupReveal = setupReveal();
  }

  renderPage();
  byId("language-toggle").addEventListener("click", function () {
    language = language === "en" ? "ko" : "en";
    saveLanguage();
    renderPage();
  });
  setupNavigation();
  setupSectionNavigation();
  setupHomeReload();
})();

(function () {
  "use strict";

  var data = WORKSHOP_DATA;
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
    return isExternal(url) ? ' target="_blank" rel="noreferrer"' : "";
  };

  function setText(id, value) {
    var element = byId(id);
    if (element) element.textContent = value || "";
  }

  function registrationLink(className) {
    var cssClass = className || "button button-primary";
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
    document.title =
      meta.title + " " + meta.titleAccent + " — " + meta.shortName + " " + meta.year;
    document.querySelector('meta[name="description"]').setAttribute("content", meta.summary);
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", meta.title + " " + meta.titleAccent);
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", meta.summary);

    setText("nav-brand", meta.shortName + " " + meta.year);
    setText("footer-brand", meta.shortName + " " + meta.year);
    setText("hero-eyebrow", meta.eyebrow);
    setText("hero-title", meta.title);
    setText("hero-title-accent", meta.titleAccent);
    setText("hero-summary", meta.summary);
    setText("template-note", meta.statusNote);
    setText("footer-tagline", meta.summary);

    byId("theme-chips").innerHTML = (meta.themeLabels || [])
      .map(function (label) {
        return "<span>" + escapeHtml(label) + "</span>";
      })
      .join("");

    byId("hero-actions").innerHTML =
      registrationLink() +
      '<a class="button button-secondary" href="#program">View the program <span aria-hidden="true">↓</span></a>';

    var facts = [
      { label: "Date", value: meta.date, detail: "" },
      { label: "Time", value: meta.time, detail: "" },
      { label: "Location", value: meta.location, detail: meta.city },
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

    var navRegistration = byId("nav-registration");
    if (meta.registrationUrl) {
      navRegistration.href = meta.registrationUrl;
      navRegistration.textContent = meta.registrationLabel;
      if (isExternal(meta.registrationUrl)) {
        navRegistration.target = "_blank";
        navRegistration.rel = "noreferrer";
      }
    } else {
      navRegistration.href = "#program";
      navRegistration.textContent = "Program";
    }
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
    setText("program-note", data.program.note);
    byId("program-list").innerHTML = data.program.items
      .map(function (item) {
        if (item.type === "track") {
          return (
            '<div class="program-track"><span>' +
            escapeHtml(item.label) +
            "</span><div><h3>" +
            escapeHtml(item.title) +
            "</h3><p>" +
            escapeHtml(item.description) +
            "</p></div></div>"
          );
        }

        if (item.type === "note") {
          return (
            '<div class="program-note-row"><span>' +
            escapeHtml(item.label) +
            "</span><strong>" +
            escapeHtml(item.title) +
            "</strong><p>" +
            escapeHtml(item.description) +
            "</p></div>"
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
          '<article class="program-item"><time>' +
          range +
          '</time><div class="program-main"><h3>' +
          escapeHtml(item.title) +
          '</h3><p class="program-speaker">' +
          escapeHtml(item.speaker) +
          " <span>· " +
          escapeHtml(item.affiliation) +
          "</span></p>" +
          (item.description
            ? '<p class="program-description">' + escapeHtml(item.description) + "</p>"
            : "") +
          '</div><span class="program-type">' +
          escapeHtml(item.format || "Session") +
          "</span></article>"
        );
      })
      .join("");
  }

  function renderSpeakers() {
    byId("speaker-grid").innerHTML = data.speakers
      .map(function (speaker, index) {
        var image = speaker.image
          ? '<img src="' +
            escapeHtml(speaker.image) +
            '" alt="' +
            escapeHtml(speaker.name) +
            '" loading="lazy" />'
          : '<span class="speaker-initials" aria-hidden="true">' +
            escapeHtml(speaker.initials || speaker.name.slice(0, 2)) +
            "</span>";
        var name = speaker.url
          ? '<a href="' +
            escapeHtml(speaker.url) +
            '"' +
            externalAttributes(speaker.url) +
            ">" +
            escapeHtml(speaker.name) +
            ' <span aria-hidden="true">↗</span></a>'
          : escapeHtml(speaker.name);
        return (
          '<article class="speaker-card reveal" style="--card-index:' +
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
          "</p></article>"
        );
      })
      .join("");
  }

  function renderVenue() {
    var venue = data.venue;
    setText("venue-name", venue.name);
    setText("venue-address", venue.address);
    setText("map-label", venue.mapLabel);
    byId("venue-details").innerHTML = venue.details
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
        '>Open in maps <span aria-hidden="true">↗</span></a>'
      : '<span class="text-link is-disabled">Map link coming soon</span>';
  }

  function renderContact() {
    setText("contact-copy", data.contact.copy);
    byId("contact-action").innerHTML = data.meta.contactEmail
      ? '<a class="button button-primary" href="mailto:' +
        escapeHtml(data.meta.contactEmail) +
        '">Email the organizers</a>'
      : "";
    byId("organizer-grid").innerHTML = data.contact.organizers
      .map(function (organizer) {
        return (
          '<div class="organizer-person"><strong>' +
          escapeHtml(organizer.name) +
          "</strong><span>" +
          escapeHtml(organizer.affiliation) +
          "</span>" +
          (organizer.email
            ? '<a href="mailto:' +
              escapeHtml(organizer.email) +
              '">' +
              escapeHtml(organizer.email) +
              "</a>"
            : "") +
          "</div>"
        );
      })
      .join("");
  }

  function renderInstitutionList(id, institutions) {
    byId(id).innerHTML = institutions
      .map(function (institution) {
        var visual = institution.logo
          ? '<img class="institution-logo" src="' +
            escapeHtml(institution.logo) +
            '" alt="' +
            escapeHtml(institution.name) +
            ' logo" loading="lazy" />'
          : '<span class="institution-wordmark">' +
            escapeHtml(institution.displayName || institution.name) +
            "</span>";
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
      })
      .join("");
  }

  function renderInstitutions() {
    renderInstitutionList("host-grid", data.institutions.hosts);
    renderInstitutionList("support-grid", data.institutions.supporters);
  }

  function renderFooter() {
    byId("footer-links").innerHTML = data.footerLinks
      .filter(function (link) {
        return link.url;
      })
      .map(function (link) {
        return (
          '<a href="' +
          escapeHtml(link.url) +
          '"' +
          externalAttributes(link.url) +
          ">" +
          escapeHtml(link.label) +
          ' <span aria-hidden="true">↗</span></a>'
        );
      })
      .join("");
    setText(
      "copyright",
      "© " +
        new Date().getFullYear() +
        " " +
        data.meta.shortName +
        ". All rights reserved."
    );
  }

  function setupNavigation() {
    var button = document.querySelector(".menu-button");
    var links = byId("nav-links");
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      links.classList.toggle("is-open", !isOpen);
    });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        button.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
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

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
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
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  renderMeta();
  renderAbout();
  renderProgram();
  renderSpeakers();
  renderVenue();
  renderContact();
  renderInstitutions();
  renderFooter();
  setupNavigation();
  setupSectionNavigation();
  setupHomeReload();
  setupReveal();
})();

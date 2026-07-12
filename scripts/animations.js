/* ================================================================
   animations.js — Scroll animations, project detail panel,
   and WebKit blur fallback
   ================================================================ */

(function () {
  "use strict";

  /* --------------------------------
     PROJECT DATA
     All 9 projects with their content
     -------------------------------- */

  const PROJECTS = {
    aesthetisia: {
      name: "Aesthetisia",
      logo: "logos/aesthetisia.png",
      logoClass: "project-detail__logo--aesthetisia",
      nameClass: "project-detail__name--hidden",
      nameHTML: "",
      description:
        "My first complete website. For my instagram photography page I started during college. Made with HTML, CSS, JavaScript.",
      badge: null,
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/Aesthetisia-By-AkashSampath",
          external: true,
        },
        {
          label: "Visit Website",
          url: "https://akashonbeats.github.io/Aesthetisia-By-AkashSampath/",
          external: true,
        },
      ],
    },
    warcards: {
      name: "War Cards",
      logo: "logos/warcards.svg",
      logoClass: "",
      nameClass: "",
      nameHTML: "War Cards",
      description:
        "A simple card game that runs on swift logic. Made using Swift and Swift UI.",
      badge: null,
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/War-card-game",
          external: true,
        },
      ],
    },
    sushimenu: {
      name: "Sushi Menu",
      logo: "logos/sushimenu.png",
      logoClass: "invert-icon project-detail__logo--large",
      nameClass: "",
      nameHTML: "Sushi Menu",
      description:
        "Menu Card app for an imaginary Sushi Restaurant. Made using Swift and Swift UI for iOS and iPadOS.",
      badge: null,
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/Sushi-bar-menu",
          external: true,
        },
      ],
    },
    xoxo: {
      name: "XOXO",
      logo: "logos/XOXO.png",
      logoClass: "",
      nameClass: "",
      nameHTML: "XOXO",
      description:
        "XOXO, a typical Tic Tac Toe game and my ultimate goal in terms of Swift. Halfway through my planned features like Local Multiplayer, Minimalist design. In the making for iOS and iPadOS.",
      badge: { text: "In Progress", style: "background:rgba(137,87,229,0.5);color:#fff;" },
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/XOXO-an-XO-game",
          external: true,
        },
      ],
    },
    ava: {
      name: "AVA",
      logo: null,
      nameClass: "",
      nameHTML: "AVA: The Personal Voice Assistant",
      description:
        "Inspired from my simpler college project version. Made using Gemini & OpenAI APIs on top of Python.",
      badge: null,
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/Ava-my-voice-assistant",
          external: true,
        },
      ],
    },
    notationex: {
      name: "NotationEx",
      logo: null,
      nameClass: "project-detail__name--inter",
      nameHTML: 'Notation<span class="accent-purple">Ex</span>',
      description: "A Node.JS based Excel to JSON Converter.",
      badge: { text: "Available as a Docker Image", style: "background:#012c90;color:#fff;" },
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/NotationXL-Excel-to-JSON-Converter",
          external: true,
        },
        {
          label: "View in Docker Hub",
          url: "https://hub.docker.com/r/akashonbeats/notationex",
          external: true,
        },
      ],
    },
    cafemenu: {
      name: "L1 Gaming Cafe",
      logo: null,
      nameClass: "project-detail__name--norwester",
      nameHTML:
        '<span class="accent-neon">L1 Gaming Cafe</span><br><span style="font-size:0.6em;color:var(--color-fg-100);text-shadow:none;">Food Menu</span>',
      description:
        "A Web based Food Menu Card for L1 Gaming Cafe, Kolathur, Chennai.",
      badge: { text: "Freelance Project", style: "background:rgb(0,79,62);color:#fff;" },
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/L1-Gaming-Cafe-Menu",
          external: true,
        },
        {
          label: "Visit Website",
          url: "https://akashonbeats.github.io/L1-Gaming-Cafe-Menu/",
          external: true,
        },
      ],
    },
    looneylists: {
      name: "Looney Lists",
      logo: null,
      nameClass: "project-detail__name--stylescript",
      nameHTML:
        '<span class="accent-teal">Looney</span> <span class="name-accent">Lists</span>',
      description:
        "An aesthetically pleasing clutter free To-Do Manager App. Available as a Browser Extension in the Microsoft Store.",
      badge: { text: "v3.1 now available in store.", style: "background:#135a67;color:#fff;" },
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/Looney-Lists-Browser-Extension",
          external: true,
        },
        {
          label: "View in Microsoft Store",
          url: "https://microsoftedge.microsoft.com/addons/detail/looney-lists/npolmgajfknocdmakgcpnkmpjgjplndj",
          external: true,
        },
      ],
    },
    shimmer: {
      name: "Shimmer",
      logo: "logos/shimmer.png",
      logoClass: "",
      nameClass: "project-detail__name--headingnow",
      nameHTML: "Shimmer.",
      description: "A minimalistic notepad app built for design enthusiasts.",
      badge: { text: "Built using ElectronJS", style: "background:#1b1c25;color:#afe8f7;" },
      links: [
        {
          label: "Visit Repository",
          url: "https://github.com/Akashonbeats/Shimmer",
          external: true,
        },
        {
          label: "Download for macOS & Windows",
          url: "https://github.com/Akashonbeats/Shimmer/releases/tag/Main",
          external: true,
        },
      ],
    },
  };

  /* SVG icons for links */
  const ICON_EXTERNAL =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  /* --------------------------------
     SCROLL ANIMATIONS
     IntersectionObserver for fade-in
     -------------------------------- */

  function initScrollAnimations() {
    const elements = document.querySelectorAll(".animate-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* --------------------------------
     WEBKIT BLUR FALLBACK
     Remove auto-blur if scroll-linked
     animations are unsupported
     -------------------------------- */

  function initBlurFallback() {
    function isWebKitEngine() {
      const ua = navigator.userAgent;
      const hasAppleWebKit = /AppleWebKit\/\d+/i.test(ua);
      const isBlinkDesktop =
        /(Chrome\/|Chromium\/|Edg\/|OPR\/|SamsungBrowser\/)/i.test(ua) &&
        !/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
      return hasAppleWebKit && !isBlinkDesktop;
    }

    function supportsScrollLinkedAnimations() {
      try {
        return (
          typeof CSS !== "undefined" &&
          (CSS.supports("animation-timeline: scroll()") ||
            CSS.supports("animation-timeline: view()") ||
            "ScrollTimeline" in window)
        );
      } catch (_) {
        return false;
      }
    }

    if (isWebKitEngine() && !supportsScrollLinkedAnimations()) {
      document
        .querySelectorAll(".auto-blur")
        .forEach((el) => el.classList.remove("auto-blur"));
      document
        .querySelectorAll(".slide-in-view")
        .forEach((el) => el.classList.remove("slide-in-view"));
    }
  }

  /* --------------------------------
     PROJECT DETAIL PANEL
     Expand / collapse / crossfade
     -------------------------------- */

  let activeProject = null;
  const detailContainer = document.getElementById("project-detail");
  const detailContent = document.getElementById("project-detail-content");
  const closeBtn = document.querySelector(".project-detail__close");
  const pills = document.querySelectorAll(".pill[data-project]");

  function renderProjectContent(projectKey) {
    const project = PROJECTS[projectKey];
    if (!project) return "";

    let html = '<div class="project-detail__header">';

    // Logo
    if (project.logo) {
      html += `<img src="${project.logo}" alt="${project.name}" class="project-detail__logo ${project.logoClass || ""}" />`;
    }

    // Name
    const nameClasses = ["project-detail__name", project.nameClass]
      .filter(Boolean)
      .join(" ");
    html += `<h3 class="${nameClasses}">${project.nameHTML}</h3>`;
    html += "</div>";

    // Badge
    if (project.badge) {
      const badgeStyle = project.badge.style || "";
      const badgeClass = project.badge.class ? ` ${project.badge.class}` : "";
      html += `<span class="badge${badgeClass}" style="${badgeStyle}">${project.badge.text}</span>`;
    }

    // Description
    html += `<p class="project-detail__desc">${project.description}</p>`;

    // Links
    html += '<div class="project-detail__links">';
    project.links.forEach((link) => {
      html += `<a href="${link.url}" target="_blank" rel="noopener" class="link-btn">${link.label} ${ICON_EXTERNAL}</a>`;
    });
    html += "</div>";

    return html;
  }

  function scrollCardIntoView() {
    // Wait for the CSS grid-template-rows expansion to finish before measuring
    setTimeout(() => {
      const card = detailContainer.querySelector(".project-detail__card");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const viewportBottom = window.innerHeight;
      const gap = 32; // breathing room below the card

      if (rect.bottom > viewportBottom - gap) {
        const scrollBy = rect.bottom - (viewportBottom - gap);
        if (window.lenis) {
          window.lenis.scrollTo(window.scrollY + scrollBy, {
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          window.scrollBy({ top: scrollBy, behavior: "smooth" });
        }
      }
    }, 350); // just after the 300ms grid expand transition
  }

  function openProject(projectKey) {
    if (activeProject === projectKey) {
      // Clicking the same pill again closes the panel
      closeProject();
      return;
    }

    const wasOpen = activeProject !== null;

    // Update pill active states
    pills.forEach((pill) => {
      pill.classList.toggle(
        "pill--active",
        pill.dataset.project === projectKey
      );
    });

    if (wasOpen) {
      // Crossfade: fade out, swap content, fade in
      detailContent.classList.add("project-detail__content--switching");

      setTimeout(() => {
        detailContent.innerHTML = renderProjectContent(projectKey);
        detailContent.classList.remove("project-detail__content--switching");
        activeProject = projectKey;
        scrollCardIntoView();
      }, 200); // Match --duration-normal
    } else {
      // First open: set content, then expand
      detailContent.innerHTML = renderProjectContent(projectKey);
      activeProject = projectKey;

      // Force reflow before adding open class for animation
      void detailContainer.offsetHeight;
      detailContainer.classList.add("project-detail--open");
      detailContainer.setAttribute("aria-hidden", "false");

      scrollCardIntoView();
    }
  }


  function closeProject() {
    if (activeProject === null) return;

    detailContainer.classList.remove("project-detail--open");
    detailContainer.setAttribute("aria-hidden", "true");

    // Clear active pill
    pills.forEach((pill) => pill.classList.remove("pill--active"));

    // Clear content after animation completes
    setTimeout(() => {
      detailContent.innerHTML = "";
      activeProject = null;
    }, 300); // Match --duration-slow
  }

  function initProjectPanel() {
    // Pill click handlers
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        openProject(pill.dataset.project);
      });
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener("click", closeProject);
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeProject !== null) {
        closeProject();
      }
    });
  }

  /* --------------------------------
     INITIALIZE
     -------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initBlurFallback();
    initProjectPanel();
  });
})();

// script.js
// Frame Studio — Wedding Photography Website

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const EMAIL = "hello@example.com";
  const EMAIL_SUBJECT = "Wedding photography availability";

  // 1. Automatically update the footer year
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Respect reduced-motion preferences
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // 3. Smooth scrolling for internal navigation
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.getElementById(targetId.slice(1));

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      // Keep the URL hash in sync
      if (window.location.hash !== targetId) {
        history.pushState(null, "", targetId);
      }

      // Move keyboard focus to the destination
      const hadTabindex = target.hasAttribute("tabindex");
      const previousTabindex = target.getAttribute("tabindex");

      target.setAttribute("tabindex", "-1");

      target.focus({
        preventScroll: true
      });

      target.addEventListener(
        "blur",
        () => {
          if (hadTabindex) {
            target.setAttribute("tabindex", previousTabindex);
          } else {
            target.removeAttribute("tabindex");
          }
        },
        { once: true }
      );
    });
  });

  // 4. Highlight the active navigation section
  const navigationLinks = document.querySelectorAll(
    '.main-nav a[href^="#"]'
  );

  const sections = Array.from(navigationLinks)
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNavigation() {
    if (!sections.length) return;

    const scrollPosition = window.scrollY + 150;
    let activeSectionId = null;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        activeSectionId = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${activeSectionId}`;

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      requestAnimationFrame(() => {
        updateActiveNavigation();
        scrollScheduled = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", updateActiveNavigation);

  updateActiveNavigation();

  // 5. Configure the availability inquiry buttons
  const inquiryButtons = document.querySelectorAll(
    'a[href^="mailto:"][href*="Wedding%20photography%20availability"]'
  );

  const emailBody = [
    "Hello Frame Studio,",
    "",
    "We're interested in wedding photography and would love to check your availability.",
    "",
    "Wedding date:",
    "Wedding location:",
    "Coverage we're interested in:",
    "A little about our plans:",
    "",
    "Looking forward to hearing from you!",
    "",
    "Thank you!"
  ].join("\n");

  const inquiryEmailLink =
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(EMAIL_SUBJECT)}` +
    `&body=${encodeURIComponent(emailBody)}`;

  inquiryButtons.forEach((button) => {
    button.setAttribute("href", inquiryEmailLink);
  });

  // 6. Keep direct email links consistent
  const directEmailLinks = document.querySelectorAll(
    'a[href="mailto:hello@example.com"]'
  );

  directEmailLinks.forEach((link) => {
    link.setAttribute("href", `mailto:${EMAIL}`);
  });

  // 7. Restore navigation highlighting on history changes
  window.addEventListener("popstate", () => {
    updateActiveNavigation();
  });
});

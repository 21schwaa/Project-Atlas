const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const floatingTrainingCta = document.querySelector("[data-floating-training-cta]");
const heroSection = document.getElementById("home");
const contactSection = document.getElementById("contact");
const testimonialsSection = document.getElementById("testimonials");
let heroVisible = true;
let contactVisible = false;
let testimonialsVisible = false;

document.documentElement.classList.add("js-enabled");

const revealNow = (element) => {
  const delay = element.dataset.revealDelay;

  if (delay) {
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  }

  element.classList.add("is-visible");
};

const revealWithin = (root) => {
  if (!root) {
    return;
  }

  if (root.matches("[data-reveal]")) {
    revealNow(root);
  }

  root.querySelectorAll("[data-reveal]").forEach(revealNow);
};

const getHashTarget = (hash) => {
  if (!hash || hash.length < 2) {
    return null;
  }

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

const navTargets = navLinks
  .map((link) => getHashTarget(link.getAttribute("href")))
  .filter((target, index, targets) => target && targets.indexOf(target) === index);
const navObservedSections = [document.getElementById("home"), ...navTargets].filter(Boolean);

const setActiveNavLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateFloatingTrainingCta = () => {
  if (!floatingTrainingCta) {
    return;
  }

  const shouldShow = !heroVisible && !contactVisible && !testimonialsVisible;

  floatingTrainingCta.classList.toggle("is-visible", shouldShow);
  floatingTrainingCta.tabIndex = shouldShow ? 0 : -1;
  floatingTrainingCta.setAttribute("aria-hidden", shouldShow ? "false" : "true");
};

updateFloatingTrainingCta();

const getAnchorScrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const alignHashTarget = (target, behavior = "auto") => {
  const header = document.querySelector(".atlas-topline");
  const headerOffset = header ? header.getBoundingClientRect().height : 0;
  const targetTop = Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - headerOffset,
  );

  window.scrollTo({ top: targetTop, behavior });
};

const revealHashTarget = (behavior = "auto") => {
  const hash = window.location.hash;
  const target = getHashTarget(hash);

  if (!target) {
    return;
  }

  revealWithin(target);
  setActiveNavLink(target.id);

  // Wait for the browser's native fragment work, then settle on the target below the fixed header.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => alignHashTarget(target, behavior));
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        revealNow(entry.target);
        observer.unobserve(entry.target);
      }
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.16,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);

      if (visibleEntries[0]) {
        setActiveNavLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-34% 0px -54% 0px",
      threshold: 0,
    },
  );

  navObservedSections.forEach((target) => navObserver.observe(target));

  if (floatingTrainingCta && heroSection && contactSection && testimonialsSection) {
    const floatingCtaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            heroVisible = entry.isIntersecting;
          }

          if (entry.target === contactSection) {
            contactVisible = entry.isIntersecting;
          }

          if (entry.target === testimonialsSection) {
            testimonialsVisible = entry.isIntersecting;
          }
        });

        updateFloatingTrainingCta();
      },
      {
        rootMargin: "-10% 0px -20% 0px",
        threshold: 0,
      },
    );

    floatingCtaObserver.observe(heroSection);
    floatingCtaObserver.observe(contactSection);
    floatingCtaObserver.observe(testimonialsSection);
  }
} else {
  revealItems.forEach(revealNow);
  heroVisible = false;
  contactVisible = false;
  updateFloatingTrainingCta();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href^="#"]');

  if (!link) {
    return;
  }

  const hash = link.getAttribute("href");
  const target = getHashTarget(hash);

  if (!target) {
    return;
  }

  const mobileNav = link.closest(".mobile-nav");
  event.preventDefault();
  revealWithin(target);
  setActiveNavLink(target.id);
  window.history.pushState(null, "", hash);
  alignHashTarget(target, getAnchorScrollBehavior());

  if (mobileNav) {
    mobileNav.open = false;
  }
});

window.addEventListener("load", () => {
  revealHashTarget("auto");
}, { once: true });
window.addEventListener("hashchange", () => revealHashTarget(getAnchorScrollBehavior()));
window.addEventListener("popstate", () => revealHashTarget(getAnchorScrollBehavior()));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const testimonialFaq = document.querySelector("[data-testimonial-faq]");
const testimonialTabs = Array.from(document.querySelectorAll("[data-testimonial-tab]"));
const testimonialQuestions = Array.from(document.querySelectorAll("[data-testimonial-question]"));
const testimonialRails = Array.from(document.querySelectorAll("[data-testimonial-rail]"));

const setTestimonialQuestion = (question, shouldOpen) => {
  const panelId = question.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  const item = question.closest(".testimonial-faq-item");

  if (!panel || !item) {
    return;
  }

  const wasPanelHidden = panel.hidden;
  const currentPanelHeight = wasPanelHidden ? 0 : panel.getBoundingClientRect().height;
  const currentPanelOpacity = wasPanelHidden
    ? 0
    : Number.parseFloat(window.getComputedStyle(panel).opacity);
  panel.getAnimations?.().forEach((animation) => animation.cancel());
  question.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  item.classList.toggle("is-open", shouldOpen);

  if (shouldOpen) {
    panel.hidden = false;

    if (wasPanelHidden) {
      panel.classList.remove("testimonial-panel-enter");
      void panel.offsetWidth;
      panel.classList.add("testimonial-panel-enter");
    }

    panel.querySelectorAll("[data-testimonial-rail]").forEach((rail) => {
      window.requestAnimationFrame(() => updateTestimonialRail(rail));
    });

    if (!prefersReducedMotion && panel.animate) {
      panel.animate(
        [
          { height: `${currentPanelHeight}px`, opacity: currentPanelOpacity },
          { height: `${panel.scrollHeight}px`, opacity: 1 },
        ],
        { duration: 420, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
      );
    }

    return;
  }

  if (prefersReducedMotion || !panel.animate) {
    panel.hidden = true;
    return;
  }

  const closingAnimation = panel.animate(
    [
      { height: `${currentPanelHeight}px`, opacity: currentPanelOpacity },
      { height: "0px", opacity: 0 },
    ],
    { duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
  );

  closingAnimation.finished
    .then(() => {
      if (question.getAttribute("aria-expanded") === "false") {
        panel.hidden = true;
      }
    })
    .catch(() => {});
};

const selectTestimonialTab = (selectedTab) => {
  const selectedCategory = selectedTab.dataset.testimonialTab;

  testimonialTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", isSelected ? "true" : "false");
    tab.tabIndex = isSelected ? 0 : -1;
  });

  testimonialFaq?.querySelectorAll("[data-testimonial-category]").forEach((panel) => {
    const isSelected = panel.dataset.testimonialCategory === selectedCategory;
    panel.hidden = !isSelected;

    if (isSelected) {
      panel.classList.remove("testimonial-panel-enter");
      void panel.offsetWidth;
      panel.classList.add("testimonial-panel-enter");
      panel.querySelectorAll("[data-testimonial-rail]").forEach((rail) => {
        window.requestAnimationFrame(() => updateTestimonialRail(rail));
      });
    }
  });
};

const getTestimonialRailStep = (rail) => {
  const firstCard = rail.querySelector(".testimonial-response-card");
  const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
  return firstCard ? firstCard.getBoundingClientRect().width + gap : rail.clientWidth;
};

const updateTestimonialRail = (rail) => {
  const shell = rail.closest("[data-testimonial-rail-shell]");
  const previousButton = shell?.querySelector("[data-testimonial-rail-previous]");
  const nextButton = shell?.querySelector("[data-testimonial-rail-next]");
  const status = shell?.querySelector("[data-testimonial-rail-status]");
  const cards = Array.from(rail.querySelectorAll(".testimonial-response-card"));
  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const canScrollLeft = rail.scrollLeft > 2;
  const canScrollRight = rail.scrollLeft < maxScroll - 2;
  const step = getTestimonialRailStep(rail);
  const currentCard = Math.min(cards.length, Math.max(1, Math.round(rail.scrollLeft / step) + 1));

  shell?.classList.toggle("can-scroll-left", canScrollLeft);
  shell?.classList.toggle("can-scroll-right", canScrollRight);

  if (previousButton) previousButton.disabled = !canScrollLeft;
  if (nextButton) nextButton.disabled = !canScrollRight;
  if (status) status.textContent = `${String(currentCard).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
};

testimonialRails.forEach((rail) => {
  const shell = rail.closest("[data-testimonial-rail-shell]");
  const previousButton = shell?.querySelector("[data-testimonial-rail-previous]");
  const nextButton = shell?.querySelector("[data-testimonial-rail-next]");

  previousButton?.addEventListener("click", () => {
    rail.scrollBy({ left: -getTestimonialRailStep(rail) });
    updateTestimonialRail(rail);
  });

  nextButton?.addEventListener("click", () => {
    rail.scrollBy({ left: getTestimonialRailStep(rail) });
    updateTestimonialRail(rail);
  });

  rail.addEventListener("scroll", () => {
    updateTestimonialRail(rail);
  }, { passive: true });

  updateTestimonialRail(rail);
});

window.addEventListener("resize", () => {
  testimonialRails.forEach(updateTestimonialRail);
});

testimonialTabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => selectTestimonialTab(tab));
  tab.addEventListener("keydown", (event) => {
    const keyOffsets = { ArrowLeft: -1, ArrowRight: 1 };
    let nextIndex = tabIndex;

    if (event.key in keyOffsets) {
      nextIndex = (tabIndex + keyOffsets[event.key] + testimonialTabs.length) % testimonialTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = testimonialTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    testimonialTabs[nextIndex].focus();
    selectTestimonialTab(testimonialTabs[nextIndex]);
  });
});

testimonialQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const categoryPanel = question.closest("[data-testimonial-category]");
    const shouldOpen = question.getAttribute("aria-expanded") !== "true";

    categoryPanel?.querySelectorAll("[data-testimonial-question]").forEach((otherQuestion) => {
      if (otherQuestion !== question && otherQuestion.getAttribute("aria-expanded") === "true") {
        setTestimonialQuestion(otherQuestion, false);
      }
    });

    setTestimonialQuestion(question, shouldOpen);
  });
});

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.utils.toArray("[data-scroll-image]").forEach((image) => {
    window.gsap.fromTo(
      image,
      {
        scale: 0.88,
        opacity: 0.62,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: image,
          start: "top 88%",
          end: "bottom 18%",
          scrub: 0.8,
        },
      },
    );
  });

  window.gsap.utils.toArray("[data-scrub-word]").forEach((word, index) => {
    window.gsap.to(word, {
      opacity: 1,
      y: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: word.closest("[data-reveal]") || word,
        start: `${10 + index * 3}% 72%`,
        end: `${34 + index * 3}% 46%`,
        scrub: 0.9,
      },
    });
  });
} else {
  document.querySelectorAll("[data-scrub-word]").forEach((word) => {
    word.style.opacity = "1";
    word.style.transform = "none";
  });
}

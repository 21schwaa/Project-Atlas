const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const floatingTrainingCta = document.querySelector("[data-floating-training-cta]");
const heroSection = document.getElementById("home");
const contactSection = document.getElementById("contact");
let heroVisible = true;
let contactVisible = false;

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

  const shouldShow = !heroVisible && !contactVisible;

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

  if (floatingTrainingCta && heroSection && contactSection) {
    const floatingCtaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            heroVisible = entry.isIntersecting;
          }

          if (entry.target === contactSection) {
            contactVisible = entry.isIntersecting;
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

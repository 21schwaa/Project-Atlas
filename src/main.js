const revealItems = document.querySelectorAll("[data-reveal]");

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

const alignHashTarget = (target) => {
  const header = document.querySelector(".atlas-topline");
  const headerOffset = header ? header.getBoundingClientRect().height : 0;
  const targetTop = Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - headerOffset,
  );
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: targetTop, behavior: "auto" });
  root.style.scrollBehavior = previousScrollBehavior;
};

const revealHashTarget = () => {
  const hash = window.location.hash;

  if (!hash || hash.length < 2) {
    return;
  }

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  revealWithin(target);

  if (target) {
    // Wait for the browser's native fragment work, then settle on the target below the fixed header.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => alignHashTarget(target));
    });
  }
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
} else {
  revealItems.forEach(revealNow);
}

window.addEventListener("load", revealHashTarget, { once: true });
window.addEventListener("hashchange", revealHashTarget);

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

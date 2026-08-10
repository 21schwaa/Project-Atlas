const revealItems = document.querySelectorAll("[data-reveal]");

const revealNow = (element) => {
  const delay = element.dataset.revealDelay;

  if (delay) {
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  }

  element.classList.add("is-visible");
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

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

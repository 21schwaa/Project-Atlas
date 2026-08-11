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

const testimonialSlides = [
  {
    quote: "Technique cues are specific, the floor is calm, and every session feels like it has a reason.",
    author: "Technique-focused training",
    role: "Member perspective",
    context: "Atlas floor",
    image: "./firstcardimage.webp",
  },
  {
    quote: "Programming, coaching, and open gym access can live in the same serious weightlifting room.",
    author: "Flexible training options",
    role: "Training path",
    context: "Team or open gym",
    image: "./secondcardimage.webp",
  },
  {
    quote: "The details matter here: positions, mobility, timing, and the patience to make better lifts repeatable.",
    author: "Position before load",
    role: "Technique and mobility",
    context: "Atlas standard",
    image: "./thirdcardimage.webp",
  },
];

document.querySelectorAll("[data-testimonial-carousel]").forEach((carousel) => {
  const quote = carousel.querySelector("[data-testimonial-quote]");
  const author = carousel.querySelector("[data-testimonial-author]");
  const role = carousel.querySelector("[data-testimonial-role]");
  const context = carousel.querySelector("[data-testimonial-context]");
  const image = carousel.querySelector("[data-testimonial-image]");
  const indexLabel = carousel.querySelector("[data-testimonial-index]");
  const countLabel = carousel.querySelector("[data-testimonial-count]");
  const dots = Array.from(carousel.querySelectorAll("[data-testimonial-dot]"));
  const previousButton = carousel.querySelector("[data-testimonial-prev]");
  const nextButton = carousel.querySelector("[data-testimonial-next]");
  let active = 0;
  let transitionTimer;

  const pad = (number) => String(number).padStart(2, "0");

  const renderSlide = () => {
    const current = testimonialSlides[active];

    quote.textContent = current.quote;
    author.textContent = current.author;
    role.textContent = current.role;
    context.textContent = current.context;
    image.src = current.image;
    image.alt = "";
    indexLabel.textContent = pad(active + 1);
    countLabel.textContent = `${pad(active + 1)} / ${pad(testimonialSlides.length)}`;

    dots.forEach((dot, index) => {
      const isActive = index === active;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const changeSlide = (nextIndex) => {
    const normalizedIndex = (nextIndex + testimonialSlides.length) % testimonialSlides.length;

    if (normalizedIndex === active) {
      return;
    }

    window.clearTimeout(transitionTimer);
    carousel.classList.add("is-changing");

    transitionTimer = window.setTimeout(() => {
      active = normalizedIndex;
      renderSlide();
      carousel.classList.remove("is-changing");
    }, 220);
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      changeSlide(Number(dot.dataset.testimonialTarget));
    });
  });

  previousButton.addEventListener("click", () => changeSlide(active - 1));
  nextButton.addEventListener("click", () => changeSlide(active + 1));
  renderSlide();
});

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

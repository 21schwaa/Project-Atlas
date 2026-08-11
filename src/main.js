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
} else {
  revealItems.forEach(revealNow);
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

  event.preventDefault();
  revealWithin(target);
  window.history.pushState(null, "", hash);
  alignHashTarget(target, getAnchorScrollBehavior());
});

window.addEventListener("load", () => revealHashTarget("auto"), { once: true });
window.addEventListener("hashchange", () => revealHashTarget(getAnchorScrollBehavior()));
window.addEventListener("popstate", () => revealHashTarget(getAnchorScrollBehavior()));

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
  {
    quote: "Open gym still feels intentional here. You can bring your online coach, your own cycle, or your own pace.",
    author: "Open gym access",
    role: "Independent training",
    context: "Your plan",
    image: "./mainlandingpageimage.webp",
  },
  {
    quote: "The attached therapy office adds useful access nearby, while staying separate from the gym itself.",
    author: "Training support",
    role: "Adjacent resource",
    context: "Independent practice",
    image: "./hero-card-generated-v1.png",
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
  const dotContainer = carousel.querySelector("[data-testimonial-dots]");
  const previousButton = carousel.querySelector("[data-testimonial-prev]");
  const nextButton = carousel.querySelector("[data-testimonial-next]");
  let active = 0;
  let transitionTimer;

  if (
    !quote ||
    !author ||
    !role ||
    !context ||
    !image ||
    !indexLabel ||
    !countLabel ||
    !dotContainer ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  const pad = (number) => String(number).padStart(2, "0");

  const dots = testimonialSlides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.dataset.testimonialDot = "";
    dot.dataset.testimonialTarget = String(index);
    dot.setAttribute("aria-label", `Show review ${index + 1}`);
    dot.addEventListener("click", () => changeSlide(index));
    return dot;
  });

  dotContainer.replaceChildren(...dots);

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

// Keep the arrival announcement independent of the page's animation libraries.
const eventDialog = document.querySelector("[data-event-dialog]");

if (eventDialog) {
  const expiresAt = Date.parse(eventDialog.dataset.eventExpires);
  const closeEvent = () => eventDialog.close();
  eventDialog.querySelector("[data-event-close]").addEventListener("click", closeEvent);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && eventDialog.open) closeEvent();
  });

  if (Number.isFinite(expiresAt) && Date.now() < expiresAt) {
    // A non-modal announcement leaves the page interactive without taking focus.
    eventDialog.open = true;
  }
}

document.querySelectorAll("[data-event-card]").forEach((card) => {
  const front = card.querySelector("[data-event-flip]");
  const back = card.querySelector(".event-card-back");
  const backButton = card.querySelector("[data-event-back]");
  const flip = (showDetails) => {
    card.classList.toggle("is-flipped", showDetails);
    front.setAttribute("aria-expanded", String(showDetails));
    front.inert = showDetails;
    back.inert = !showDetails;
    (showDetails ? back.querySelector("a") : front).focus({ preventScroll: true });
  };

  card.classList.add("is-interactive");
  back.inert = true;
  front.addEventListener("click", () => flip(true));
  backButton.addEventListener("click", () => flip(false));
  back.addEventListener("click", (event) => {
    if (!event.target.closest("a, button")) flip(false);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && card.classList.contains("is-flipped")) {
      event.preventDefault();
      flip(false);
    }
  });
});

document.querySelectorAll("[data-events-track]").forEach((track) => {
  const gallery = track.closest(".events-gallery");
  const controls = gallery.querySelector("[data-event-controls]");
  const previous = gallery.querySelector("[data-event-previous]");
  const next = gallery.querySelector("[data-event-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    const end = track.scrollWidth - track.clientWidth;
    controls.hidden = end <= 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= end - 2;
  };
  const move = (direction) => {
    const cardWidth = track.querySelector("[data-event-card]").getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: reducedMotion.matches ? "instant" : "smooth" });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("keydown", (event) => {
    if (event.target !== track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });
  track.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
});

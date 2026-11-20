// Keep the arrival announcement independent of the page's animation libraries.
const eventDialog = document.querySelector("[data-event-dialog]");
const eventCards = Array.from(document.querySelectorAll("[data-event-card]"));
const events = eventCards.map((card) => ({
  card,
  expiresAt: Date.parse(card.dataset.eventExpires),
  upcomingTrack: card.parentElement,
  summary: card.querySelector(".event-card-summary")?.textContent,
  hint: card.querySelector("[data-event-hint]")?.textContent,
}));
const announcementEvent = events.find(({ card }) => card.dataset.eventId === eventDialog?.dataset.eventId);
const announcementExpiresAt = announcementEvent?.expiresAt ?? Date.parse(eventDialog?.dataset.eventExpires);

if (eventDialog) {
  const closeEvent = () => eventDialog.close();
  eventDialog.querySelector("[data-event-close]").addEventListener("click", closeEvent);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && eventDialog.open) closeEvent();
  });

  if (Number.isFinite(announcementExpiresAt) && Date.now() < announcementExpiresAt) {
    // A non-modal announcement leaves the page interactive without taking focus.
    eventDialog.open = true;
  }
}

eventCards.forEach((card) => {
  const front = card.querySelector("[data-event-flip]");
  const back = card.querySelector(".event-card-back");
  const backButton = card.querySelector("[data-event-back]");
  const flip = (showDetails) => {
    card.classList.toggle("is-flipped", showDetails);
    front.setAttribute("aria-expanded", String(showDetails));
    front.inert = showDetails;
    back.inert = !showDetails;
    const backFocus = card.classList.contains("is-past") ? backButton : back.querySelector("a");
    (showDetails ? backFocus : front).focus({ preventScroll: true });
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
    const firstCard = track.querySelector("[data-event-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
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
  new MutationObserver(update).observe(track, { childList: true });
  update();
});

// Recheck at the cutoff and on return to a tab, including a page left open overnight.
const pastEventsSection = document.querySelector("[data-past-events]");
const pastEventsTrack = document.getElementById("past-events-track");
const upcomingGallery = document.querySelector("[data-upcoming-events]");
const emptyUpcoming = document.querySelector("[data-events-empty]");
let eventDeadlineTimer;

const updateEventLifecycle = () => {
  window.clearTimeout(eventDeadlineTimer);
  const now = Date.now();

  if (pastEventsSection && pastEventsTrack) {
    events.forEach(({ card, expiresAt, upcomingTrack, summary, hint }) => {
      const isPast = Number.isFinite(expiresAt) && now >= expiresAt;
      const destination = isPast ? pastEventsTrack : upcomingTrack;
      const registration = card.querySelector(".event-registration");
      const focusNeedsMoving = isPast && registration?.contains(document.activeElement);

      if (isPast) pastEventsSection.hidden = false;
      if (card.parentElement !== destination) destination.append(card);
      card.classList.toggle("is-past", isPast);
      if (registration) {
        registration.hidden = isPast;
        registration.inert = isPast;
      }
      card.querySelectorAll("[data-event-ended]").forEach((label) => { label.hidden = !isPast; });
      const summaryText = card.querySelector(".event-card-summary");
      if (summaryText) summaryText.textContent = isPast ? "A day on the platform with the Atlas community." : summary;
      const hintText = card.querySelector("[data-event-hint]");
      if (hintText) hintText.textContent = isPast ? "View event details" : hint;
      if (focusNeedsMoving) card.querySelector("[data-event-back]").focus({ preventScroll: true });
    });

    pastEventsSection.hidden = !pastEventsTrack.querySelector("[data-event-card]");
    const hasUpcoming = events.some(({ card }) => !card.classList.contains("is-past"));
    if (upcomingGallery) upcomingGallery.hidden = !hasUpcoming;
    if (emptyUpcoming) emptyUpcoming.hidden = hasUpcoming;
  }

  if (eventDialog?.open && Number.isFinite(announcementExpiresAt) && now >= announcementExpiresAt) {
    eventDialog.close();
  }

  const nextDeadline = Math.min(...events.map(({ expiresAt }) => expiresAt)
    .concat(announcementExpiresAt).filter((deadline) => Number.isFinite(deadline) && deadline > now));
  if (Number.isFinite(nextDeadline)) {
    // Browser timers accept at most a signed 32-bit millisecond delay.
    eventDeadlineTimer = window.setTimeout(updateEventLifecycle, Math.min(nextDeadline - now, 2_147_483_647));
  }
};

updateEventLifecycle();
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateEventLifecycle();
});
window.addEventListener("pageshow", updateEventLifecycle);

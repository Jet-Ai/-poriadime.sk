const LANGUAGE_KEY = "poriadime-language";

const pageMeta = {
  sk: {
    title: "PORIADIME - Hĺbkové tepovanie a profesionálne upratovanie",
    description:
      "PORIADIME zabezpečuje hĺbkové tepovanie áut, dodávok, kamiónov, sedačiek, matracov a kobercov. Upratovanie domácností, firiem a apartmánov v okolí Sládkovičova a Galanty.",
    booking: "https://booqme.app/sk/rezervacia/poriadimesk",
  },
  en: {
    title: "PORIADIME - Deep extraction cleaning and professional cleaning",
    description:
      "PORIADIME provides deep extraction cleaning for cars, vans, trucks, sofas, mattresses and carpets, plus home, office and apartment cleaning around Sládkovičovo and Galanta.",
    booking: "https://booqme.app/en/rezervacia/poriadimesk",
  },
};

function setLanguage(language) {
  const nextLanguage = pageMeta[language] ? language : "sk";

  document.documentElement.lang = nextLanguage;
  document.title = pageMeta[nextLanguage].title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", pageMeta[nextLanguage].description);
  }

  document.querySelectorAll("[data-sk][data-en]").forEach((element) => {
    element.innerHTML = element.getAttribute(`data-${nextLanguage}`);
  });

  document.querySelectorAll("[data-placeholder-sk][data-placeholder-en]").forEach((element) => {
    element.setAttribute("placeholder", element.getAttribute(`data-placeholder-${nextLanguage}`));
  });

  document.querySelectorAll("[data-language-button]").forEach((button) => {
    const isActive = button.dataset.languageButton === nextLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const bookingFrame = document.getElementById("booqme-iframe");
  if (bookingFrame && bookingFrame.src !== pageMeta[nextLanguage].booking) {
    bookingFrame.src = pageMeta[nextLanguage].booking;
  }

  document.querySelectorAll("[data-booking-link]").forEach((bookingLink) => {
    bookingLink.href = pageMeta[nextLanguage].booking;
  });

  localStorage.setItem(LANGUAGE_KEY, nextLanguage);
}

function closeNavigation() {
  const navigation = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");

  if (!navigation || !toggle) {
    return;
  }

  navigation.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || "sk";
  const header = document.querySelector("[data-header]");
  const navigation = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const year = document.querySelector("[data-year]");
  const bookingFrame = document.getElementById("booqme-iframe");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  document.querySelectorAll("[data-language-button]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });

  if (toggle && navigation) {
    toggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });
  }

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (bookingFrame) {
    bookingFrame.addEventListener("load", () => {
      bookingFrame.closest(".booking-frame-wrap")?.classList.add("is-loaded");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  setLanguage(savedLanguage);
});

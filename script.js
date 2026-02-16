(function () {
  const THEME_KEY = "upopi-theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  document.body.classList.toggle("theme-dark", initialTheme === "dark");

  const nav = document.querySelector(".nav");
  let themeToggle = null;

  const applyTheme = (theme) => {
    const dark = theme === "dark";
    document.body.classList.toggle("theme-dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    if (themeToggle) {
      themeToggle.textContent = dark ? "Светлая тема" : "Темная тема";
      themeToggle.setAttribute("aria-pressed", String(dark));
    }
  };

  if (nav) {
    themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("theme-dark") ? "light" : "dark");
    });
    nav.appendChild(themeToggle);
    applyTheme(document.body.classList.contains("theme-dark") ? "dark" : "light");
  }

  const buildMobileNav = () => {
    if (!nav || document.querySelector(".mobile-nav")) return;

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = Array.from(nav.querySelectorAll("nav a[href]"));

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-menu-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobile-nav");
    toggle.textContent = "Меню";
    nav.appendChild(toggle);

    const backdrop = document.createElement("div");
    backdrop.className = "mobile-nav-backdrop";

    const mobile = document.createElement("aside");
    mobile.className = "mobile-nav";
    mobile.id = "mobile-nav";

    const header = document.createElement("div");
    header.className = "mobile-nav-header";
    header.innerHTML = '<div class="mobile-nav-title">Меню</div>';
    const close = document.createElement("button");
    close.type = "button";
    close.className = "mobile-nav-close";
    close.setAttribute("aria-label", "Закрыть меню");
    close.textContent = "×";
    header.appendChild(close);

    mobile.appendChild(header);

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.endsWith(".html")) return;
      const item = document.createElement("a");
      item.className = "mobile-nav-link";
      item.href = href;
      item.textContent = (link.textContent || "").trim();
      if (href.toLowerCase() === page || (page === "" && href === "index.html")) {
        item.classList.add("active");
      }
      mobile.appendChild(item);
      item.addEventListener("click", () => {
        document.body.classList.remove("mobile-nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(mobile);

    const openMenu = () => {
      document.body.classList.add("mobile-nav-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      document.body.classList.remove("mobile-nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      document.body.classList.contains("mobile-nav-open") ? closeMenu() : openMenu();
    });

    close.addEventListener("click", closeMenu);
    backdrop.addEventListener("click", closeMenu);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  };

  buildMobileNav();

  const buildQuickContactDock = () => {
    if (document.querySelector(".quick-contact-fab")) return;

    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "quick-contact-fab";
    fab.textContent = "Контакты";
    fab.setAttribute("aria-expanded", "false");

    const panel = document.createElement("aside");
    panel.className = "quick-contact-panel";
    panel.innerHTML = `
      <div class="quick-contact-panel-title">У попи</div>
      <a class="quick-contact-panel-link" href="tel:+79940057901">Телефон: +7 994 005 79 01</a>
      <a class="quick-contact-panel-link" href="https://t.me/Welika_00" target="_blank" rel="noopener noreferrer">Телеграм: @Welika_00</a>
      <a class="quick-contact-panel-link" href="mailto:jadeloomwear@gmail.com">Почта: jadeloomwear@gmail.com</a>
      <a class="quick-contact-panel-link" href="contact.html">Адрес: г. Владивосток, ул. Луговая, д. 74</a>
      <a class="quick-contact-panel-link" href="work.html">Услуги и цены</a>
    `;

    const backdrop = document.createElement("div");
    backdrop.className = "quick-contact-backdrop";

    const closeDock = () => {
      document.body.classList.remove("quick-contact-open");
      fab.setAttribute("aria-expanded", "false");
    };

    const openDock = () => {
      document.body.classList.add("quick-contact-open");
      fab.setAttribute("aria-expanded", "true");
    };

    fab.addEventListener("click", () => {
      document.body.classList.contains("quick-contact-open") ? closeDock() : openDock();
    });
    backdrop.addEventListener("click", closeDock);
    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDock));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDock();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(fab);
  };

  buildQuickContactDock();

  const bookingForms = Array.from(document.querySelectorAll("[data-booking-form]"));
  const encode = (value) => encodeURIComponent((value || "").trim());
  bookingForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const service = String(fd.get("service") || "").trim();
      const date = String(fd.get("date") || "").trim();
      const comment = String(fd.get("comment") || "").trim();

      if (!name || !phone) {
        const firstInput = form.querySelector("input[name='name']") || form.querySelector("input[name='phone']");
        if (firstInput) firstInput.focus();
        return;
      }

      const subject = encode(`Заявка на сервис — ${service || "Автомастерская У попи"}`);
      const body = encode(
        [
          "Новая заявка с сайта:",
          `Имя: ${name}`,
          `Телефон: ${phone}`,
          `Услуга: ${service || "Не указана"}`,
          `Желаемая дата: ${date || "Не указана"}`,
          `Комментарий: ${comment || "Нет"}`
        ].join("\n")
      );
      window.location.href = `mailto:jadeloomwear@gmail.com?subject=${subject}&body=${body}`;
    });
  });

  const turboBtn = document.getElementById("car-turbo-btn");
  const nightBtn = document.getElementById("car-night-btn");
  const carStage = document.getElementById("car-stage");
  const carHint = document.querySelector(".car-hint");
  const speedValue = document.getElementById("car-speed");
  let speedTimer = null;

  const updateSpeed = () => {
    if (!speedValue || !carStage) return;
    const turbo = carStage.classList.contains("turbo");
    const min = turbo ? 86 : 38;
    const max = turbo ? 128 : 62;
    speedValue.textContent = String(Math.floor(min + Math.random() * (max - min + 1)));
  };

  if (carStage) {
    updateSpeed();
    speedTimer = window.setInterval(updateSpeed, 1100);
  }

  if (turboBtn && carStage) {
    turboBtn.addEventListener("click", () => {
      const enabled = carStage.classList.toggle("turbo");
      turboBtn.textContent = enabled ? "Отключить турбо" : "Включить турбо";
      if (carHint) {
        carHint.textContent = enabled ? "Турбо-тест на роликах" : "Демонстрация бокса";
      }
      updateSpeed();
    });
  }

  if (nightBtn && carStage) {
    nightBtn.addEventListener("click", () => {
      const enabled = carStage.classList.toggle("night");
      nightBtn.textContent = enabled ? "Дневной режим" : "Ночной режим";
      if (carHint) {
        carHint.textContent = enabled ? "Ночная диагностика света" : "Демонстрация бокса";
      }
    });
  }

  const carMascot = document.getElementById("car-mascot");
  const carSong = document.getElementById("car-song");
  const playCarSong = () => {
    if (!carMascot || !carSong) return;
    if (!carSong.getAttribute("src") && !carSong.querySelector("source")?.getAttribute("src")) {
      return;
    }

    if (carSong.paused) {
      carSong.currentTime = 0;
      carSong.play().then(() => {
        carMascot.classList.add("car-song-active");
        if (carHint) carHint.textContent = "Сейчас играет: Rock You Like a Hurricane";
      }).catch(() => {
        if (carHint) carHint.textContent = "Добавьте файл rock-you-like-a-hurricane.mp3 в папку сайта";
      });
      return;
    }

    carSong.pause();
    carMascot.classList.remove("car-song-active");
    if (carHint) carHint.textContent = carStage?.classList.contains("night") ? "Ночная диагностика света" : "Демонстрация бокса";
  };

  if (carMascot) {
    carMascot.addEventListener("click", playCarSong);
    carMascot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        playCarSong();
      }
    });
  }

  if (carSong) {
    carSong.addEventListener("ended", () => {
      if (carMascot) carMascot.classList.remove("car-song-active");
      if (carHint) carHint.textContent = carStage?.classList.contains("night") ? "Ночная диагностика света" : "Демонстрация бокса";
    });
  }

  const showPhoneBtn = document.getElementById("show-phone");
  const phoneLink = document.getElementById("phone-link");
  if (showPhoneBtn && phoneLink) {
    showPhoneBtn.addEventListener("click", () => {
      phoneLink.hidden = false;
      showPhoneBtn.hidden = true;
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  window.addEventListener("load", () => {
    document.body.classList.add("page-ready");
  });

  window.addEventListener("beforeunload", () => {
    if (speedTimer) window.clearInterval(speedTimer);
    if (carSong) {
      carSong.pause();
      carSong.currentTime = 0;
    }
  });
})();

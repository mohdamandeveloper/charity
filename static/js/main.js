(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Dropdown sub-menus (click/tap + keyboard)
  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = btn.parentElement;
      var open = !li.classList.contains("open");
      document.querySelectorAll(".has-sub.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
      });
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function () {
    if (window.matchMedia("(min-width: 961px)").matches) {
      document.querySelectorAll(".has-sub.open").forEach(function (o) { o.classList.remove("open"); });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".has-sub.open").forEach(function (o) { o.classList.remove("open"); });
      document.body.classList.remove("nav-open");
    }
  });

  // Keep "Ends in X days" accurate between site rebuilds
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  document.querySelectorAll(".days-left[data-end]").forEach(function (el) {
    var parts = el.getAttribute("data-end").split("-");
    var end = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var days = Math.round((end - today) / 86400000);
    var text = el.querySelector(".days-text");
    if (!text) return;
    if (days > 1) text.textContent = "Ends in " + days + " days";
    else if (days === 1) text.textContent = "Ends tomorrow";
    else if (days === 0) text.textContent = "Ends today";
    else text.textContent = "Campaign closed";
  });

  // Campaign category filter
  var grid = document.querySelector("[data-filter-grid]");
  if (grid) {
    var empty = document.querySelector(".empty");
    document.querySelectorAll(".chip[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        document.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        var shown = 0;
        grid.querySelectorAll("[data-cats]").forEach(function (item) {
          var match = f === "all" || (" " + item.getAttribute("data-cats") + " ").indexOf(" " + f + " ") > -1;
          item.hidden = !match;
          if (match) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // Copy campaign link
  document.querySelectorAll(".copy-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-url");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = "Link copied";
          setTimeout(function () { btn.textContent = "Copy link"; }, 2000);
        });
      }
    });
  });

  // Submit forms without leaving the page
  document.querySelectorAll("form[data-ajax-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (!window.fetch) return; // fall back to normal submit
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (res.ok && res.data.success !== false) {
            status.classList.add("ok");
            status.textContent = "Thank you! We have received your message and will be in touch soon.";
            form.reset();
          } else {
            throw new Error(res.data.message || "Error");
          }
        })
        .catch(function () {
          status.classList.add("err");
          status.textContent = "Sorry, something went wrong. Please try again or email us directly.";
        })
        .then(function () { button.disabled = false; });
    });
  });
})();

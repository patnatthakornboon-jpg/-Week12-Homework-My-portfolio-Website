/* ===========================================================
   ส่วนโปรแกรมหลัก (ข้อมูลผลงานอยู่ที่ data.js)
   =========================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  function esc(v) {
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- ลดการเคลื่อนไหว ---------- */
  var motionBtn = $("#motion-btn");
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  function setMotion(off) {
    root.setAttribute("data-motion", off ? "off" : "on");
    motionBtn.setAttribute("aria-pressed", off ? "true" : "false");
    motionBtn.textContent = off ? "เปิดการเคลื่อนไหว" : "ลดการเคลื่อนไหว";
    onScroll();
  }
  motionBtn.addEventListener("click", function () { setMotion(root.getAttribute("data-motion") !== "off"); });

  /* ---------- เมนูมือถือ ---------- */
  var menuBtn = $("#menu-btn"), menu = $("#menu");
  function closeMenu() { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("open") && !e.target.closest(".nav")) closeMenu();
  });

  /* ---------- เลื่อน: แถบความคืบหน้า + parallax ---------- */
  var progress = $("#progress"), percent = $("#percent");
  var photo = $("#hero-photo"), g1 = $(".g1"), g2 = $(".g2"), ring = $(".ring");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || 0;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, y / max));
      progress.style.transform = "scaleX(" + p + ")";
      percent.textContent = Math.round(p * 100) + "%";
      if (root.getAttribute("data-motion") === "off") {
        photo.style.transform = g1.style.transform = g2.style.transform = ring.style.transform = "";
        photo.style.opacity = "";
        return;
      }
      var h = window.innerHeight;
      var k = Math.min(y, h * 1.2);
      photo.style.transform = "translateY(" + (k * 0.18) + "px) scale(" + (1 + k / h * 0.04) + ")";
      photo.style.opacity = String(Math.max(0.15, 1 - k / (h * 1.1)));
      g1.style.transform = "translateY(" + (y * 0.12) + "px)";
      g2.style.transform = "translateY(" + (-y * 0.08) + "px)";
      ring.style.transform = "rotate(" + (-18 + y * 0.015) + "deg) scaleY(.55) translateY(" + (y * 0.05) + "px)";
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- ข้อความทยอยปรากฏ ---------- */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 5) * 60 + "ms"; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- เมนูไฮไลต์ตามส่วนที่กำลังดู ---------- */
  var navLinks = $$("#menu a");
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  function markActive() {
    var line = window.scrollY + window.innerHeight * 0.35, idx = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= line) idx = i; });
    navLinks.forEach(function (a, i) {
      if (i === idx && idx !== 0) a.classList.add("active"); else a.classList.remove("active");
    });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  window.addEventListener("resize", markActive);

  /* ---------- แกลเลอรีภาพ (คลิก / ลูกศร / ปัด / ภาพย่อ) ---------- */
  var shots = $$(".shot"), thumbBtns = $$("#thumbs button");
  var stage = $("#stage");
  var cur = 0, justDragged = false;
  function showPhoto(i) {
    cur = (i + shots.length) % shots.length;
    shots.forEach(function (s, idx) {
      s.setAttribute("data-pos", String((idx - cur + shots.length) % shots.length));
    });
    thumbBtns.forEach(function (b, idx) {
      if (idx === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    $("#count").textContent = (cur + 1) + " / " + shots.length;
  }
  $("#prev").addEventListener("click", function () { showPhoto(cur - 1); });
  $("#next").addEventListener("click", function () { showPhoto(cur + 1); });
  thumbBtns.forEach(function (b) {
    b.addEventListener("click", function () { showPhoto(Number(b.getAttribute("data-t"))); });
  });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { showPhoto(cur - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { showPhoto(cur + 1); e.preventDefault(); }
  });
  shots.forEach(function (s, idx) {
    s.addEventListener("click", function () {
      if (justDragged) { justDragged = false; return; }
      if (idx === cur) openPhoto(idx); else showPhoto(idx);
    });
  });
  var startX = null;
  stage.addEventListener("pointerdown", function (e) { startX = e.clientX; });
  window.addEventListener("pointerup", function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 45) {
      justDragged = true;
      showPhoto(dx < 0 ? cur + 1 : cur - 1);
      setTimeout(function () { justDragged = false; }, 60);
    }
  });
  window.addEventListener("pointercancel", function () { startX = null; });
  showPhoto(0);

  /* ---------- ป๊อปอัพ ---------- */
  var modal = $("#modal"), body = $("#modal-body"), lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    body.innerHTML = html;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
  }
  function cleanupModal() {
    var v = body.querySelector("video");
    if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
    body.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }
  function closeModal() {
    if (modal.open) modal.close(); else cleanupModal();
  }
  function openPhoto(i) {
    var p = PHOTOS[i];
    openModal('<h3 id="modal-title" class="sr">' + esc(p.alt) + '</h3><img class="lightbox-img" src="' + esc(p.src) + '" alt="' + esc(p.alt) + '">');
  }
  function openWork(id) {
    var w = WORKS[id];
    if (!w) return;
    var media = "";
    if (w.media && w.media.type === "image") {
      media = '<div class="m-media"><img src="' + esc(w.media.src) + '" alt="' + esc(w.media.alt) + '"></div>';
    } else if (w.media && w.media.type === "video") {
      media = '<div class="m-media portrait"><video controls playsinline preload="metadata" poster="' + esc(w.media.poster) + '" src="' + esc(w.media.src) + '">เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ</video></div>';
    }
    var parts = (w.parts || []).map(function (p) {
      return "<div><b>" + esc(p[0]) + "</b><span>" + esc(p[1]) + "</span></div>";
    }).join("");
    var links = (w.links || []).map(function (l) {
      return '<a class="btn primary" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + " <i>↗</i></a>";
    }).join("");
    openModal(
      media +
      '<div class="m-body"><span class="tag">' + esc(w.tag) + '</span>' +
      '<h3 id="modal-title">' + esc(w.title) + "</h3>" +
      "<p>" + esc(w.text) + "</p>" +
      (parts ? '<div class="m-parts">' + parts + "</div>" : "") +
      (links ? '<div class="m-actions">' + links + "</div>" : "") +
      "</div>"
    );
  }
  $$("[data-open]").forEach(function (b) {
    b.addEventListener("click", function () { openWork(b.getAttribute("data-open")); });
  });
  $("#close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", cleanupModal);

  /* ---------- เริ่มต้น ---------- */
  setMotion(reduced);
  onScroll();
  markActive();
})();

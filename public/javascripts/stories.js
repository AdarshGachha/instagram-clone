/* Original made in SCSS and TS */
/* https://github.com/psilva999/stories-sabaton */
"use strict";
var Slide = (function () {
    function t(t, e, s, i, n) {
      void 0 === n && (n = 5e3),
        (this.container = t),
        (this.elements = e),
        (this.controls = s),
        (this.playPause = i),
        (this.time = n),
        (this.timeout = null),
        (this.pausedTimeout = null),
        (this.index = localStorage.getItem("activeStories")
          ? Number(localStorage.getItem("activeStories"))
          : 0),
        (this.slide = this.elements[this.index]),
        (this.paused = !1),
        (this.thumbItems = null),
        (this.thumb = null),
        this.init();
    }
    return (
      (t.prototype.hide = function (t) {
        var e = document.querySelector("#more");
        (null == e ? void 0 : e.classList.contains("active")) &&
          (null == e || e.classList.remove("active")),
          t.classList.remove("active"),
          t instanceof HTMLVideoElement &&
            (t.pause(), (t.muted = !0), (t.currentTime = 0));
      }),
      (t.prototype.show = function (t) {
        var e = this;
        (this.index = t),
          (this.slide = this.elements[this.index]),
          localStorage.setItem("activeStories", String(this.index)),
          this.thumbItems &&
            ((this.thumb = this.thumbItems[this.index]),
            this.thumbItems.forEach(function (t) {
              return t.classList.remove("active");
            }),
            this.thumb.classList.add("active")),
          this.elements.forEach(function (t) {
            return e.hide(t);
          }),
          this.slide.classList.add("active"),
          this.slide instanceof HTMLVideoElement
            ? this.autoVideo(this.slide)
            : this.auto(this.time);
      }),
      (t.prototype.autoVideo = function (t) {
        var e = this,
          s = document.querySelector("#more");
        (null == s ? void 0 : s.classList.contains("active")) ||
          null == s ||
          s.classList.add("active"),
          t.play(),
          (t.muted = !1);
        var i = !0;
        t.addEventListener("playing", function () {
          i && e.auto(1e3 * t.duration), (i = !1);
        });
      }),
      (t.prototype.auto = function (t) {
        var e,
          s = this;
        null === (e = this.timeout) || void 0 === e || e.clear(),
          (this.timeout = new Timeout(function () {
            return s.next();
          }, t)),
          this.thumb &&
            (this.thumb.style.animationDuration = "".concat(t, "ms"));
      }),
      (t.prototype.prev = function () {
        if (!this.paused) {
          var t =
            this.index - 1 >= 0 ? this.index - 1 : this.elements.length - 1;
          this.show(t);
        }
      }),
      (t.prototype.next = function () {
        if (!this.paused) {
          var t = this.index + 1 < this.elements.length ? this.index + 1 : 0;
          this.show(t);
        }
      }),
      (t.prototype.pause = function () {
        var t = this;
        document.body.classList.add("paused"),
          (window.oncontextmenu = function () {
            return !1;
          }),
          (this.pausedTimeout = new Timeout(function () {
            var e, s;
            null === (e = t.timeout) || void 0 === e || e.pause(),
              (t.paused = !0),
              null === (s = t.thumb) ||
                void 0 === s ||
                s.classList.add("paused"),
              t.slide instanceof HTMLVideoElement && t.slide.pause(),
              t.playPause.classList.contains("pause") &&
                (t.playPause.classList.remove("pause"),
                t.playPause.classList.add("play"));
          }, 300));
      }),
      (t.prototype.continue = function () {
        var t, e, s;
        document.body.classList.remove("paused"),
          null === (t = this.pausedTimeout) || void 0 === t || t.clear(),
          this.paused &&
            ((this.paused = !1),
            null === (e = this.timeout) || void 0 === e || e.continue(),
            null === (s = this.thumb) ||
              void 0 === s ||
              s.classList.remove("paused"),
            this.slide instanceof HTMLVideoElement && this.slide.play()),
          this.playPause.classList.contains("play") &&
            (this.playPause.classList.remove("play"),
            this.playPause.classList.add("pause"));
      }),
      (t.prototype.addControl = function () {
        var t = this,
          e = document.createElement("button"),
          s = document.createElement("button");
        (e.innerText = "Prev Slide"),
          (s.innerText = "Next Slide"),
          this.controls.appendChild(e),
          this.controls.appendChild(s),
          this.controls.addEventListener("pointerdown", function () {
            return t.pause();
          }),
          this.playPause.addEventListener("pointerdown", function () {
            t.playPause.classList.contains("pause") && t.pause(),
              t.playPause.classList.contains("play") && t.continue();
          }),
          this.playPause.addEventListener("pointerup", function () {
            if (
              !t.playPause.classList.contains("pause") &&
              t.playPause.classList.contains("play")
            )
              return;
          }),
          document.addEventListener("pointerup", function () {
            return t.continue();
          }),
          document.addEventListener("touchend", function () {
            return t.continue();
          }),
          e.addEventListener("pointerup", function () {
            return t.prev();
          }),
          s.addEventListener("pointerup", function () {
            return t.next();
          });
      }),
      (t.prototype.addThumbItems = function () {
        var t = document.getElementById("slide-thumb");
        if (t) {
          for (var e = 0; e < this.elements.length; e++)
            t.innerHTML +=
              "\n          <span>\n            <span class='thumb-item'></span>\n          </span>\n          ";
          this.thumbItems = Array.from(
            document.querySelectorAll(".thumb-item")
          );
        }
      }),
      (t.prototype.init = function () {
        this.addControl(), this.addThumbItems(), this.show(this.index);
      }),
      t
    );
  })(),
  Timeout = (function () {
    function t(t, e) {
      (this.id = setTimeout(t, e)),
        (this.handler = t),
        (this.start = Date.now()),
        (this.timeLeft = e);
    }
    return (
      (t.prototype.clear = function () {
        clearTimeout(this.id);
      }),
      (t.prototype.pause = function () {
        var t = Date.now() - this.start;
        (this.timeLeft = this.timeLeft - t), this.clear();
      }),
      (t.prototype.continue = function () {
        this.clear(),
          (this.id = setTimeout(this.handler, this.timeLeft)),
          (this.start = Date.now());
      }),
      t
    );
  })(),
  container = document.getElementById("slide"),
  elements = document.getElementById("slide-elements"),
  controls = document.getElementById("slide-controls"),
  playPause = document.getElementById("play-pause");
if (container && elements && controls && elements.children.length && playPause)
  var stories = new Slide(
    container,
    Array.from(elements.children),
    controls,
    playPause,
    5e3
  );

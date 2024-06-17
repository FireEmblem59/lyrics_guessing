(() => {
  var t,
    e,
    n = "Taylor Swift",
    o = document.getElementById("check-lyrics-button"),
    r = document.getElementById("lyrics-display"),
    c = document.getElementById("timer"),
    i =
      (document.getElementById("score"),
      document.getElementById("restart-button")),
    a = "",
    s = "",
    l = "",
    u = "",
    d = 9,
    m = void 0,
    f = void 0;
  console.log("Client ID:", m), console.log("Client Secret:", f);
  var h,
    g,
    y = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(m + ":" + f),
      },
      body: "grant_type=client_credentials",
    };
  function p(t) {
    (d = t), v();
  }
  function v() {
    fetch(
      "https://api.spotify.com/v1/search?q=artist:".concat(
        n,
        "&type=track&limit=50"
      ),
      { headers: { Authorization: "Bearer ".concat(u) } }
    )
      .then(function (t) {
        return t.json();
      })
      .then(function (n) {
        var o,
          r = n.tracks.items,
          i = r[Math.floor(Math.random() * r.length)];
        (s = i.name),
          (l = i.artists[0].name),
          (o = s),
          fetch(
            "https://api.lyrics.ovh/v1/"
              .concat(encodeURIComponent(l), "/")
              .concat(encodeURIComponent(o))
          )
            .then(function (t) {
              return t.json();
            })
            .then(function (n) {
              (a = n.lyrics),
                (h = (function () {
                  var t = a.split("\n").filter(function (t) {
                    return "" !== t.trim();
                  });
                  var e = (function () {
                      var e, n;
                      function o(t) {
                        for (
                          var e = t.toLowerCase().split(/\s+/),
                            n = 0,
                            o = ["oh", "uh"];
                          n < o.length;
                          n++
                        ) {
                          var r = o[n];
                          if (e.includes(r)) return !0;
                        }
                        return !1;
                      }
                      do {
                        (n = Math.floor(Math.random() * (t.length - 2))),
                          (e = t.slice(n, n + 3));
                      } while (
                        e[1].split(" ").filter(function (t) {
                          return "" !== t;
                        }).length > d ||
                        o(e[1])
                      );
                      return (
                        console.log(e[1]),
                        (g = e[1]),
                        (e[1] = e[1].replace(/[a-zA-Z]/g, "_")),
                        e.join("\n"),
                        e
                      );
                    })(),
                    n = document.getElementById("lyrics-display");
                  n.innerHTML = e.join("<br>");
                  var o = 0,
                    r = e[1];
                  function c() {
                    if (o > 0) {
                      var t = r[o - 1];
                      if (/^[a-zA-Z]$/.test(t))
                        (r = r.substring(0, o - 1) + "_" + r.substring(o)),
                          (e[1] = r),
                          (n.innerHTML = e.join("<br>")),
                          o--;
                      else if (/^[.,!?]$/.test(t)) o--, c();
                      else if (" " === t) o--, c();
                      else {
                        for (
                          var i = r[o - 2];
                          (/^[.,!?]$/.test(i) || " " === i) && !(--o <= 1);

                        )
                          i = r[o - 2];
                        c();
                      }
                    }
                  }
                  return (
                    document.addEventListener("keydown", function (t) {
                      /^[a-zA-Z]$/.test(t.key)
                        ? (function (t) {
                            if (o < r.length) {
                              for (; "_" !== r[o] && o < r.length; ) o++;
                              o < r.length &&
                                ((r =
                                  r.substring(0, o) + t + r.substring(o + 1)),
                                (e[1] = r),
                                (n.innerHTML = e.join("<br>")),
                                o++);
                            }
                          })(t.key)
                        : "Backspace" === t.key || "Delete" === t.key
                        ? c()
                        : "Enter" === t.key && I();
                    }),
                    e
                  );
                })()),
                E(),
                (e = Date.now()),
                (c.textContent = "Time: 0s"),
                clearInterval(t),
                (t = setInterval(function () {
                  var t = Math.floor((Date.now() - e) / 1e3);
                  c.textContent = "Time: ".concat(t, "s");
                }, 1e3));
            })
            .catch(function (t) {
              return console.error("Error fetching lyrics:", t);
            });
      })
      .catch(function (t) {
        return console.error("Error fetching song from Spotify:", t);
      });
  }
  function I() {
    clearInterval(t);
    for (
      var e,
        n,
        o = h[1].toLowerCase().trim(),
        r = g.toLowerCase().trim(),
        c = [],
        i = 0,
        a = 0;
      a < o.length && a < r.length;
      a++
    )
      o[a] === r[a] && (c.push(a), i++);
    E(),
      (e = l),
      (n = "https://api.spotify.com/v1/search?q=track:"
        .concat(encodeURIComponent(s), "%20artist:")
        .concat(encodeURIComponent(e), "&type=track&limit=1")),
      fetch(n, { headers: { Authorization: "Bearer ".concat(u) } })
        .then(function (t) {
          return t.json();
        })
        .then(function (t) {
          var e,
            n = t.tracks.items[0];
          n && n.album && n.album.images && n.album.images.length > 0
            ? ((e = n.album.images[0].url),
              (document.getElementById("album-image").src = e))
            : console.error("Unable to fetch album image from Spotify API.");
        })
        .catch(function (t) {
          console.error("Error fetching track info from Spotify API:", t);
        }),
      (function (t, e, n, o) {
        var r = document.getElementById("song-info-modal"),
          c = document.getElementById("song-title"),
          i = document.getElementById("song-artist"),
          a = document.getElementById("correct-answer");
        if (
          ((c.textContent = "Song: ".concat(t)),
          (i.textContent = "Artist: ".concat(e)),
          o === n)
        ) {
          var s = "Correct! It was: ".concat(n);
          (a.textContent = "Correct Answer: ".concat(n)),
            (a.textContent = s),
            (a.style.color = "green");
        } else {
          var l = "But it was: ".concat(n),
            u = "You put: ".concat(o);
          (a.textContent = "".concat(u, "\n").concat(l)),
            (a.style.color = "red");
        }
        r.classList.add("show");
      })(s, l, r, o),
      (document.getElementById("score").textContent = "Score: "
        .concat(i, "/")
        .concat(r.length));
  }
  function E() {
    i.style.display = "inline-block";
  }
  fetch("https://accounts.spotify.com/api/token", y)
    .then(function (t) {
      return t.json();
    })
    .then(function (t) {
      (u = t.access_token), v();
    })
    .catch(function (t) {
      return console.error("Error:", t);
    }),
    document
      .getElementById("easy-button")
      .addEventListener("click", function () {
        return p(5);
      }),
    document
      .getElementById("medium-button")
      .addEventListener("click", function () {
        return p(9);
      }),
    document
      .getElementById("hard-button")
      .addEventListener("click", function () {
        return p(15);
      }),
    o.addEventListener("click", I),
    i.addEventListener("click", function () {
      clearInterval(t),
        (c.textContent = ""),
        (r.innerHTML = ""),
        (i.style.display = "none"),
        v();
    });
})();

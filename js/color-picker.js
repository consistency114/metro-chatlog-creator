(function (a) {
    if (typeof define === "function" && define.amd) {
      define(["jquery"], a);
    } else {
      if (typeof exports == "object" && typeof module == "object") {
        module.exports = a;
      } else {
        a(jQuery);
      }
    }
  })(function (e, g) {
    var m = {
        beforeShow: b,
        move: b,
        change: b,
        show: b,
        hide: b,
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: true,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "",
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [
          [
            "#ffffff",
            "#000000",
            "#ff0000",
            "#ff8000",
            "#ffff00",
            "#008000",
            "#0000ff",
            "#4b0082",
            "#9400d3",
          ],
        ],
        selectionPalette: [],
        disabled: false,
        offset: null,
      },
      d = [],
      h = !!/msie/i.exec(window.navigator.userAgent),
      l = (function () {
        function u(y, x) {
          return !!~("" + y).indexOf(x);
        }
        var w = document.createElement("div");
        var v = w.style;
        v.cssText = "background-color:rgba(0,0,0,.5)";
        return u(v.backgroundColor, "rgba") || u(v.backgroundColor, "hsla");
      })(),
      q = [
        "<div class='sp-replacer'>",
        "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
        "<div class='sp-dd'>&#9660;</div>",
        "</div>",
      ].join(""),
      p = (function () {
        var u = "";
        if (h) {
          for (var v = 1; v <= 6; v++) {
            u += "<div class='sp-" + v + "'></div>";
          }
        }
        return [
          "<div class='sp-container sp-hidden'>",
          "<div class='sp-palette-container'>",
          "<div class='sp-palette sp-thumb sp-cf'></div>",
          "<div class='sp-palette-button-container sp-cf'>",
          "<button type='button' class='sp-palette-toggle'></button>",
          "</div>",
          "</div>",
          "<div class='sp-picker-container'>",
          "<div class='sp-top sp-cf'>",
          "<div class='sp-fill'></div>",
          "<div class='sp-top-inner'>",
          "<div class='sp-color'>",
          "<div class='sp-sat'>",
          "<div class='sp-val'>",
          "<div class='sp-dragger'></div>",
          "</div>",
          "</div>",
          "</div>",
          "<div class='sp-clear sp-clear-display'>",
          "</div>",
          "<div class='sp-hue'>",
          "<div class='sp-slider'></div>",
          u,
          "</div>",
          "</div>",
          "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
          "</div>",
          "<div class='sp-input-container sp-cf'>",
          "<input class='sp-input' type='text' spellcheck='false'  />",
          "</div>",
          "</div>",
          "</div>",
          "</div>",
        ].join("");
      })();
    function s(w, y, C, u) {
      var A = [];
      for (var z = 0; z < w.length; z++) {
        var B = w[z];
        if (B) {
          var v = tinycolor(B);
          var E =
            v.toHsl().l < 0.5
              ? "sp-thumb-el sp-thumb-dark"
              : "sp-thumb-el sp-thumb-light";
          E += tinycolor.equals(y, B) ? " sp-thumb-active" : "";
          var D = v.toString(u.preferredFormat || "rgb");
          var x = l
            ? "background-color:" + v.toRgbString()
            : "filter:" + v.toFilter();
          A.push(
            '<span title="' +
              D +
              '" data-color="' +
              v.toRgbString() +
              '" class="' +
              E +
              '"><span class="sp-thumb-inner" style="' +
              x +
              ';" /></span>'
          );
        } else {
          var F = "sp-clear-display";
          A.push(
            e("<div />")
              .append(
                e(
                  '<span data-color="" style="background-color:transparent;" class="' +
                    F +
                    '"></span>'
                ).attr("title", u.noColorSelectedText)
              )
              .html()
          );
        }
      }
      return "<div class='sp-cf " + C + "'>" + A.join("") + "</div>";
    }
    function o() {
      for (var u = 0; u < d.length; u++) {
        if (d[u]) {
          d[u].hide();
        }
      }
    }
    function n(w, u) {
      var v = e.extend({}, m, w);
      v.callbacks = {
        move: t(v.move, u),
        change: t(v.change, u),
        show: t(v.show, u),
        hide: t(v.hide, u),
        beforeShow: t(v.beforeShow, u),
      };
      return v;
    }
    function r(a8, ah) {
      var a7 = n(ah, a8),
        a3 = a7.flat,
        W = a7.showSelectionPalette,
        w = a7.localStorageKey,
        ak = a7.theme,
        R = a7.callbacks,
        E = f(ad, 10),
        O = false,
        ap = false,
        aM = 0,
        af = 0,
        aN = 0,
        az = 0,
        L = 0,
        ay = 0,
        aY = 0,
        ar = 0,
        Y = 0,
        P = 0,
        aC = 0,
        aZ = 1,
        ai = [],
        al = [],
        a5 = {},
        aI = a7.selectionPalette.slice(0),
        aH = a7.maxSelectionSize,
        x = "sp-dragging",
        G = null;
      var X = a8.ownerDocument,
        N = X.body,
        D = e(a8),
        aW = false,
        aO = e(p, X).addClass(ak),
        u = aO.find(".sp-picker-container"),
        I = aO.find(".sp-color"),
        aL = aO.find(".sp-dragger"),
        M = aO.find(".sp-hue"),
        a2 = aO.find(".sp-slider"),
        aE = aO.find(".sp-alpha-inner"),
        Z = aO.find(".sp-alpha"),
        aF = aO.find(".sp-alpha-handle"),
        K = aO.find(".sp-input"),
        Q = aO.find(".sp-palette"),
        a6 = aO.find(".sp-initial"),
        aq = aO.find(".sp-cancel"),
        an = aO.find(".sp-clear"),
        H = aO.find(".sp-choose"),
        aQ = aO.find(".sp-palette-toggle"),
        S = D.is("input"),
        B = S && D.attr("type") === "color" && k(),
        aB = S && !a3,
        aU = aB
          ? e(q)
              .addClass(ak)
              .addClass(a7.className)
              .addClass(a7.replacerClassName)
          : e([]),
        aw = aB ? aU : D,
        J = aU.find(".sp-preview-inner"),
        T = a7.color || (S && D.val()),
        aP = false,
        V = a7.preferredFormat,
        au = V,
        F = !a7.showButtons || a7.clickoutFiresChange,
        C = !T,
        a4 = a7.allowEmpty && !B;
      function v() {
        if (a7.showPaletteOnly) {
          a7.showPalette = true;
        }
        aQ.text(
          a7.showPaletteOnly ? a7.togglePaletteMoreText : a7.togglePaletteLessText
        );
        if (a7.palette) {
          ai = a7.palette.slice(0);
          al = e.isArray(ai[0]) ? ai : [ai];
          a5 = {};
          for (var bc = 0; bc < al.length; bc++) {
            for (var bb = 0; bb < al[bc].length; bb++) {
              var ba = tinycolor(al[bc][bb]).toRgbString();
              a5[ba] = true;
            }
          }
        }
        aO.toggleClass("sp-flat", a3);
        aO.toggleClass("sp-input-disabled", !a7.showInput);
        aO.toggleClass("sp-alpha-enabled", a7.showAlpha);
        aO.toggleClass("sp-clear-enabled", a4);
        aO.toggleClass("sp-buttons-disabled", !a7.showButtons);
        aO.toggleClass("sp-palette-buttons-disabled", !a7.togglePaletteOnly);
        aO.toggleClass("sp-palette-disabled", !a7.showPalette);
        aO.toggleClass("sp-palette-only", a7.showPaletteOnly);
        aO.toggleClass("sp-initial-disabled", !a7.showInitial);
        aO.addClass(a7.className).addClass(a7.containerClassName);
        ad();
      }
      function aJ() {
        if (h) {
          aO.find("*:not(input)").attr("unselectable", "on");
        }
        v();
        if (aB) {
          D.after(aU).hide();
        }
        if (!a4) {
          an.hide();
        }
        if (a3) {
          D.after(aO).hide();
        } else {
          var bb = a7.appendTo === "parent" ? D.parent() : e(a7.appendTo);
          if (bb.length !== 1) {
            bb = e("body");
          }
          bb.append(aO);
        }
        aR();
        aw.bind("click.spectrum touchstart.spectrum", function (bd) {
          if (!aW) {
            ax();
          }
          bd.stopPropagation();
          if (!e(bd.target).is("input")) {
            bd.preventDefault();
          }
        });
        if (D.is(":disabled") || a7.disabled === true) {
          U();
        }
        aO.click(j);
        K.change(aS);
        K.bind("paste", function () {
          setTimeout(aS, 1);
        });
        K.keydown(function (bd) {
          if (bd.keyCode == 13) {
            aS();
          }
        });
        aq.text(a7.cancelText);
        aq.bind("click.spectrum", function (bd) {
          bd.stopPropagation();
          bd.preventDefault();
          av();
          aG();
        });
        an.attr("title", a7.clearText);
        an.bind("click.spectrum", function (bd) {
          bd.stopPropagation();
          bd.preventDefault();
          C = true;
          aK();
          if (a3) {
            ao(true);
          }
        });
        H.text(a7.chooseText);
        H.bind("click.spectrum", function (bd) {
          bd.stopPropagation();
          bd.preventDefault();
          if (h && K.is(":focus")) {
            K.trigger("change");
          }
          if (aA()) {
            ao(true);
            aG();
          }
        });
        aQ.text(
          a7.showPaletteOnly ? a7.togglePaletteMoreText : a7.togglePaletteLessText
        );
        aQ.bind("click.spectrum", function (bd) {
          bd.stopPropagation();
          bd.preventDefault();
          a7.showPaletteOnly = !a7.showPaletteOnly;
          if (!a7.showPaletteOnly && !a3) {
            aO.css("left", "-=" + (u.outerWidth(true) + 5));
          }
          v();
        });
        c(
          Z,
          function (bf, be, bd) {
            aZ = bf / ay;
            C = false;
            if (bd.shiftKey) {
              aZ = Math.round(aZ * 10) / 10;
            }
            aK();
          },
          A,
          a9
        );
        c(
          M,
          function (be, bd) {
            Y = parseFloat(bd / az);
            C = false;
            if (!a7.showAlpha) {
              aZ = 1;
            }
            aK();
          },
          A,
          a9
        );
        c(
          I,
          function (bk, bi, bh) {
            if (!bh.shiftKey) {
              G = null;
            } else {
              if (!G) {
                var bf = P * aM;
                var bd = af - aC * af;
                var be = Math.abs(bk - bf) > Math.abs(bi - bd);
                G = be ? "x" : "y";
              }
            }
            var bg = !G || G === "x";
            var bj = !G || G === "y";
            if (bg) {
              P = parseFloat(bk / aM);
            }
            if (bj) {
              aC = parseFloat((af - bi) / af);
            }
            C = false;
            if (!a7.showAlpha) {
              aZ = 1;
            }
            aK();
          },
          A,
          a9
        );
        if (!!T) {
          ac(T);
          aD();
          au = V || tinycolor(T).format;
          aV(T);
        } else {
          aD();
        }
        if (a3) {
          z();
        }
        function bc(bd) {
          if (bd.data && bd.data.ignore) {
            ac(e(bd.target).closest(".sp-thumb-el").data("color"));
            aK();
          } else {
            ac(e(bd.target).closest(".sp-thumb-el").data("color"));
            aK();
            ao(true);
            if (a7.hideAfterPaletteSelect) {
              aG();
            }
          }
          return false;
        }
        var ba = h ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
        Q.delegate(".sp-thumb-el", ba, bc);
        a6.delegate(".sp-thumb-el:nth-child(1)", ba, { ignore: true }, bc);
      }
      function aR() {
        if (w && window.localStorage) {
          try {
            var ba = window.localStorage[w].split(",#");
            if (ba.length > 1) {
              delete window.localStorage[w];
              e.each(ba, function (bc, bd) {
                aV(bd);
              });
            }
          } catch (bb) {}
          try {
            aI = window.localStorage[w].split(";");
          } catch (bb) {}
        }
      }
      function aV(ba) {
        if (W) {
          var bb = tinycolor(ba).toRgbString();
          if (!a5[bb] && e.inArray(bb, aI) === -1) {
            aI.push(bb);
            while (aI.length > aH) {
              aI.shift();
            }
          }
          if (w && window.localStorage) {
            try {
              window.localStorage[w] = aI.join(";");
            } catch (bc) {}
          }
        }
      }
      function aX() {
        var bc = [];
        if (a7.showPalette) {
          for (var bb = 0; bb < aI.length; bb++) {
            var ba = tinycolor(aI[bb]).toRgbString();
            if (!a5[ba]) {
              bc.push(aI[bb]);
            }
          }
        }
        return bc.reverse().slice(0, a7.maxSelectionSize);
      }
      function a0() {
        var ba = aT();
        var bb = e.map(al, function (bc, bd) {
          return s(bc, ba, "sp-palette-row sp-palette-row-" + bd, a7);
        });
        aR();
        if (aI) {
          bb.push(s(aX(), ba, "sp-palette-row sp-palette-row-selection", a7));
        }
        Q.html(bb.join(""));
      }
      function at() {
        if (a7.showInitial) {
          var ba = aP;
          var bb = aT();
          a6.html(s([ba, bb], bb, "sp-palette-row-initial", a7));
        }
      }
      function A() {
        if (af <= 0 || aM <= 0 || az <= 0) {
          ad();
        }
        ap = true;
        aO.addClass(x);
        G = null;
        D.trigger("dragstart.spectrum", [aT()]);
      }
      function a9() {
        ap = false;
        aO.removeClass(x);
        D.trigger("dragstop.spectrum", [aT()]);
      }
      function aS() {
        var bb = K.val();
        if ((bb === null || bb === "") && a4) {
          ac(null);
          ao(true);
        } else {
          var ba = tinycolor(bb);
          if (ba.isValid()) {
            ac(ba);
            ao(true);
          } else {
            K.addClass("sp-validation-error");
          }
        }
      }
      function ax() {
        if (O) {
          aG();
        } else {
          z();
        }
      }
      function z() {
        var ba = e.Event("beforeShow.spectrum");
        if (O) {
          ad();
          return;
        }
        D.trigger(ba, [aT()]);
        if (R.beforeShow(aT()) === false || ba.isDefaultPrevented()) {
          return;
        }
        o();
        O = true;
        e(X).bind("keydown.spectrum", aj);
        e(X).bind("click.spectrum", ab);
        e(window).bind("resize.spectrum", E);
        aU.addClass("sp-active");
        aO.removeClass("sp-hidden");
        ad();
        aD();
        aP = aT();
        at();
        R.show(aP);
        D.trigger("show.spectrum", [aP]);
      }
      function aj(ba) {
        if (ba.keyCode === 27) {
          aG();
        }
      }
      function ab(ba) {
        if (ba.button == 2) {
          return;
        }
        if (ap) {
          return;
        }
        if (F) {
          ao(true);
        } else {
          av();
        }
        aG();
      }
      function aG() {
        if (!O || a3) {
          return;
        }
        O = false;
        e(X).unbind("keydown.spectrum", aj);
        e(X).unbind("click.spectrum", ab);
        e(window).unbind("resize.spectrum", E);
        aU.removeClass("sp-active");
        aO.addClass("sp-hidden");
        R.hide(aT());
        D.trigger("hide.spectrum", [aT()]);
      }
      function av() {
        ac(aP, true);
      }
      function ac(ba, bc) {
        if (tinycolor.equals(ba, aT())) {
          aD();
          return;
        }
        var bb, bd;
        if (!ba && a4) {
          C = true;
        } else {
          C = false;
          bb = tinycolor(ba);
          bd = bb.toHsv();
          Y = (bd.h % 360) / 360;
          P = bd.s;
          aC = bd.v;
          aZ = bd.a;
        }
        aD();
        if (bb && bb.isValid() && !bc) {
          au = V || bb.getFormat();
        }
      }
      function aT(ba) {
        ba = ba || {};
        if (a4 && C) {
          return null;
        }
        return tinycolor.fromRatio(
          { h: Y, s: P, v: aC, a: Math.round(aZ * 100) / 100 },
          { format: ba.format || au }
        );
      }
      function aA() {
        return !K.hasClass("sp-validation-error");
      }
      function aK() {
        aD();
        R.move(aT());
        D.trigger("move.spectrum", [aT()]);
      }
      function aD() {
        K.removeClass("sp-validation-error");
        a1();
        var bc = tinycolor.fromRatio({ h: Y, s: 1, v: 1 });
        I.css("background-color", bc.toHexString());
        var bh = au;
        if (aZ < 1 && !(aZ === 0 && bh === "name")) {
          if (bh === "hex" || bh === "hex3" || bh === "hex6" || bh === "name") {
            bh = "rgb";
          }
        }
        var ba = aT({ format: bh }),
          bd = "";
        J.removeClass("sp-clear-display");
        J.css("background-color", "transparent");
        if (!ba && a4) {
          J.addClass("sp-clear-display");
        } else {
          var be = ba.toHexString(),
            bi = ba.toRgbString();
          if (l || ba.alpha === 1) {
            J.css("background-color", bi);
          } else {
            J.css("background-color", "transparent");
            J.css("filter", ba.toFilter());
          }
          if (a7.showAlpha) {
            var bf = ba.toRgb();
            bf.a = 0;
            var bb = tinycolor(bf).toRgbString();
            var bg = "linear-gradient(left, " + bb + ", " + be + ")";
            if (h) {
              aE.css("filter", tinycolor(bb).toFilter({ gradientType: 1 }, be));
            } else {
              aE.css("background", "-webkit-" + bg);
              aE.css("background", "-moz-" + bg);
              aE.css("background", "-ms-" + bg);
              aE.css(
                "background",
                "linear-gradient(to right, " + bb + ", " + be + ")"
              );
            }
          }
          bd = ba.toString(bh);
        }
        if (a7.showInput) {
          K.val(bd);
        }
        if (a7.showPalette) {
          a0();
        }
        at();
      }
      function a1() {
        var bc = P;
        var ba = aC;
        if (a4 && C) {
          aF.hide();
          a2.hide();
          aL.hide();
        } else {
          aF.show();
          a2.show();
          aL.show();
          var bf = bc * aM;
          var bd = af - ba * af;
          bf = Math.max(-aN, Math.min(aM - aN, bf - aN));
          bd = Math.max(-aN, Math.min(af - aN, bd - aN));
          aL.css({ top: bd + "px", left: bf + "px" });
          var bb = aZ * ay;
          aF.css({ left: bb - aY / 2 + "px" });
          var be = Y * az;
          a2.css({ top: be - ar + "px" });
        }
      }
      function ao(bb) {
        var ba = aT(),
          bd = "",
          bc = !tinycolor.equals(ba, aP);
        if (ba) {
          bd = ba.toString(au);
          aV(ba);
        }
        if (S) {
          D.val(bd);
        }
        if (bb && bc) {
          R.change(ba);
          D.trigger("change", [ba]);
        }
      }
      function ad() {
        aM = I.width();
        af = I.height();
        aN = aL.height();
        L = M.width();
        az = M.height();
        ar = a2.height();
        ay = Z.width();
        aY = aF.width();
        if (!a3) {
          aO.css("position", "absolute");
          if (a7.offset) {
            aO.offset(a7.offset);
          } else {
            aO.offset(a(aO, aw));
          }
        }
        a1();
        if (a7.showPalette) {
          a0();
        }
        D.trigger("reflow.spectrum");
      }
      function y() {
        D.show();
        aw.unbind("click.spectrum touchstart.spectrum");
        aO.remove();
        aU.remove();
        d[ae.id] = null;
      }
      function aa(ba, bb) {
        if (ba === g) {
          return e.extend({}, a7);
        }
        if (bb === g) {
          return a7[ba];
        }
        a7[ba] = bb;
        v();
      }
      function ag() {
        aW = false;
        D.attr("disabled", false);
        aw.removeClass("sp-disabled");
      }
      function U() {
        aG();
        aW = true;
        D.attr("disabled", true);
        aw.addClass("sp-disabled");
      }
      function am(ba) {
        a7.offset = ba;
        ad();
      }
      aJ();
      var ae = {
        show: z,
        hide: aG,
        toggle: ax,
        reflow: ad,
        option: aa,
        enable: ag,
        disable: U,
        offset: am,
        set: function (ba) {
          ac(ba);
          ao();
        },
        get: aT,
        destroy: y,
        container: aO,
      };
      ae.id = d.push(ae) - 1;
      return ae;
    }
    function a(B, C) {
      var A = 0;
      var y = B.outerWidth();
      var E = B.outerHeight();
      var u = C.outerHeight();
      var D = B[0].ownerDocument;
      var v = D.documentElement;
      var z = v.clientWidth + e(D).scrollLeft();
      var w = v.clientHeight + e(D).scrollTop();
      var x = C.offset();
      x.top += u;
      x.left -= Math.min(
        x.left,
        x.left + y > z && z > y ? Math.abs(x.left + y - z) : 0
      );
      x.top -= Math.min(x.top, x.top + E > w && w > E ? Math.abs(E + u - A) : A);
      return x;
    }
    function b() {}
    function j(u) {
      u.stopPropagation();
    }
    function t(v, w) {
      var x = Array.prototype.slice;
      var u = x.call(arguments, 2);
      return function () {
        return v.apply(w, u.concat(x.call(arguments)));
      };
    }
    function c(z, E, v, w) {
      E = E || function () {};
      v = v || function () {};
      w = w || function () {};
      var F = document;
      var H = false;
      var y = {};
      var I = 0;
      var G = 0;
      var B = "ontouchstart" in window;
      var A = {};
      A.selectstart = D;
      A.dragstart = D;
      A["touchmove mousemove"] = x;
      A["touchend mouseup"] = C;
      function D(J) {
        if (J.stopPropagation) {
          J.stopPropagation();
        }
        if (J.preventDefault) {
          J.preventDefault();
        }
        J.returnValue = false;
      }
      function x(N) {
        if (H) {
          if (h && F.documentMode < 9 && !N.button) {
            return C();
          }
          var L =
            N.originalEvent &&
            N.originalEvent.touches &&
            N.originalEvent.touches[0];
          var K = (L && L.pageX) || N.pageX;
          var J = (L && L.pageY) || N.pageY;
          var O = Math.max(0, Math.min(K - y.left, G));
          var M = Math.max(0, Math.min(J - y.top, I));
          if (B) {
            D(N);
          }
          E.apply(z, [O, M, N]);
        }
      }
      function u(K) {
        var J = K.which ? K.which == 3 : K.button == 2;
        if (!J && !H) {
          if (v.apply(z, arguments) !== false) {
            H = true;
            I = e(z).height();
            G = e(z).width();
            y = e(z).offset();
            e(F).bind(A);
            e(F.body).addClass("sp-dragging");
            x(K);
            D(K);
          }
        }
      }
      function C() {
        if (H) {
          e(F).unbind(A);
          e(F.body).removeClass("sp-dragging");
          setTimeout(function () {
            w.apply(z, arguments);
          }, 0);
        }
        H = false;
      }
      e(z).bind("touchstart mousedown", u);
    }
    function f(v, x, u) {
      var w;
      return function () {
        var z = this,
          y = arguments;
        var A = function () {
          w = null;
          v.apply(z, y);
        };
        if (u) {
          clearTimeout(w);
        }
        if (u || !w) {
          w = setTimeout(A, x);
        }
      };
    }
    function k() {
      return e.fn.spectrum.inputTypeColorSupport();
    }
    var i = "spectrum.id";
    e.fn.spectrum = function (x, u) {
      if (typeof x == "string") {
        var w = this;
        var v = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
          var y = d[e(this).data(i)];
          if (y) {
            var z = y[x];
            if (!z) {
              throw new Error("Spectrum: no such method: '" + x + "'");
            }
            if (x == "get") {
              w = y.get();
            } else {
              if (x == "container") {
                w = y.container;
              } else {
                if (x == "option") {
                  w = y.option.apply(y, v);
                } else {
                  if (x == "destroy") {
                    y.destroy();
                    e(this).removeData(i);
                  } else {
                    z.apply(y, v);
                  }
                }
              }
            }
          }
        });
        return w;
      }
      return this.spectrum("destroy").each(function () {
        var y = e.extend({}, x, e(this).data());
        var z = r(this, y);
        e(this).data(i, z.id);
      });
    };
    e.fn.spectrum.load = true;
    e.fn.spectrum.loadOpts = {};
    e.fn.spectrum.draggable = c;
    e.fn.spectrum.defaults = m;
    e.fn.spectrum.inputTypeColorSupport = function k() {
      if (typeof k._cachedResult === "undefined") {
        var u = e("<input type='color'/>")[0];
        k._cachedResult = u.type === "color" && u.value !== "";
      }
      return k._cachedResult;
    };
    e.spectrum = {};
    e.spectrum.localization = {};
    e.spectrum.palettes = {};
    e.fn.spectrum.processNativeColorInputs = function () {
      var u = e("input[type=color]");
      if (u.length && !k()) {
        u.spectrum({ preferredFormat: "hex6" });
      }
    };
    (function () {
      var Y = /^[\s,#]+/,
        K = /\s+$/,
        ad = 0,
        P = Math,
        T = P.round,
        ak = P.min,
        M = P.max,
        D = P.random;
      var af = function (an, ap) {
        an = an ? an : "";
        ap = ap || {};
        if (an instanceof af) {
          return an;
        }
        if (!(this instanceof af)) {
          return new af(an, ap);
        }
        var ao = ac(an);
        (this._originalInput = an),
          (this._r = ao.r),
          (this._g = ao.g),
          (this._b = ao.b),
          (this._a = ao.a),
          (this._roundA = T(100 * this._a) / 100),
          (this._format = ap.format || ao.format);
        this._gradientType = ap.gradientType;
        if (this._r < 1) {
          this._r = T(this._r);
        }
        if (this._g < 1) {
          this._g = T(this._g);
        }
        if (this._b < 1) {
          this._b = T(this._b);
        }
        this._ok = ao.ok;
        this._tc_id = ad++;
      };
      af.prototype = {
        isDark: function () {
          return this.getBrightness() < 128;
        },
        isLight: function () {
          return !this.isDark();
        },
        isValid: function () {
          return this._ok;
        },
        getOriginalInput: function () {
          return this._originalInput;
        },
        getFormat: function () {
          return this._format;
        },
        getAlpha: function () {
          return this._a;
        },
        getBrightness: function () {
          var an = this.toRgb();
          return (an.r * 299 + an.g * 587 + an.b * 114) / 1000;
        },
        setAlpha: function (an) {
          this._a = E(an);
          this._roundA = T(100 * this._a) / 100;
          return this;
        },
        toHsv: function () {
          var an = B(this._r, this._g, this._b);
          return { h: an.h * 360, s: an.s, v: an.v, a: this._a };
        },
        toHsvString: function () {
          var ao = B(this._r, this._g, this._b);
          var aq = T(ao.h * 360),
            ap = T(ao.s * 100),
            an = T(ao.v * 100);
          return this._a == 1
            ? "hsv(" + aq + ", " + ap + "%, " + an + "%)"
            : "hsva(" + aq + ", " + ap + "%, " + an + "%, " + this._roundA + ")";
        },
        toHsl: function () {
          var an = G(this._r, this._g, this._b);
          return { h: an.h * 360, s: an.s, l: an.l, a: this._a };
        },
        toHslString: function () {
          var ao = G(this._r, this._g, this._b);
          var aq = T(ao.h * 360),
            ap = T(ao.s * 100),
            an = T(ao.l * 100);
          return this._a == 1
            ? "hsl(" + aq + ", " + ap + "%, " + an + "%)"
            : "hsla(" + aq + ", " + ap + "%, " + an + "%, " + this._roundA + ")";
        },
        toHex: function (an) {
          return ab(this._r, this._g, this._b, an);
        },
        toHexString: function (an) {
          return "#" + this.toHex(an);
        },
        toHex8: function () {
          return al(this._r, this._g, this._b, this._a);
        },
        toHex8String: function () {
          return "#" + this.toHex8();
        },
        toRgb: function () {
          return { r: T(this._r), g: T(this._g), b: T(this._b), a: this._a };
        },
        toRgbString: function () {
          return this._a == 1
            ? "rgb(" + T(this._r) + ", " + T(this._g) + ", " + T(this._b) + ")"
            : "rgba(" +
                T(this._r) +
                ", " +
                T(this._g) +
                ", " +
                T(this._b) +
                ", " +
                this._roundA +
                ")";
        },
        toPercentageRgb: function () {
          return {
            r: T(ag(this._r, 255) * 100) + "%",
            g: T(ag(this._g, 255) * 100) + "%",
            b: T(ag(this._b, 255) * 100) + "%",
            a: this._a,
          };
        },
        toPercentageRgbString: function () {
          return this._a == 1
            ? "rgb(" +
                T(ag(this._r, 255) * 100) +
                "%, " +
                T(ag(this._g, 255) * 100) +
                "%, " +
                T(ag(this._b, 255) * 100) +
                "%)"
            : "rgba(" +
                T(ag(this._r, 255) * 100) +
                "%, " +
                T(ag(this._g, 255) * 100) +
                "%, " +
                T(ag(this._b, 255) * 100) +
                "%, " +
                this._roundA +
                ")";
        },
        toName: function () {
          if (this._a === 0) {
            return "transparent";
          }
          if (this._a < 1) {
            return false;
          }
          return am[ab(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function (aq) {
          var ar = "#" + al(this._r, this._g, this._b, this._a);
          var ao = ar;
          var an = this._gradientType ? "GradientType = 1, " : "";
          if (aq) {
            var ap = af(aq);
            ao = ap.toHex8String();
          }
          return (
            "progid:DXImageTransform.Microsoft.gradient(" +
            an +
            "startColorstr=" +
            ar +
            ",endColorstr=" +
            ao +
            ")"
          );
        },
        toString: function (aq) {
          var an = !!aq;
          aq = aq || this._format;
          var ap = false;
          var ao = this._a < 1 && this._a >= 0;
          var ar =
            !an &&
            ao &&
            (aq === "hex" || aq === "hex6" || aq === "hex3" || aq === "name");
          if (ar) {
            if (aq === "name" && this._a === 0) {
              return this.toName();
            }
            return this.toRgbString();
          }
          if (aq === "rgb") {
            ap = this.toRgbString();
          }
          if (aq === "prgb") {
            ap = this.toPercentageRgbString();
          }
          if (aq === "hex" || aq === "hex6") {
            ap = this.toHexString();
          }
          if (aq === "hex3") {
            ap = this.toHexString(true);
          }
          if (aq === "hex8") {
            ap = this.toHex8String();
          }
          if (aq === "name") {
            ap = this.toName();
          }
          if (aq === "hsl") {
            ap = this.toHslString();
          }
          if (aq === "hsv") {
            ap = this.toHsvString();
          }
          return ap || this.toHexString();
        },
        _applyModification: function (ap, ao) {
          var an = ap.apply(null, [this].concat([].slice.call(ao)));
          this._r = an._r;
          this._g = an._g;
          this._b = an._b;
          this.setAlpha(an._a);
          return this;
        },
        lighten: function () {
          return this._applyModification(J, arguments);
        },
        brighten: function () {
          return this._applyModification(v, arguments);
        },
        darken: function () {
          return this._applyModification(I, arguments);
        },
        desaturate: function () {
          return this._applyModification(O, arguments);
        },
        saturate: function () {
          return this._applyModification(Z, arguments);
        },
        greyscale: function () {
          return this._applyModification(y, arguments);
        },
        spin: function () {
          return this._applyModification(ae, arguments);
        },
        _applyCombination: function (ao, an) {
          return ao.apply(null, [this].concat([].slice.call(an)));
        },
        analogous: function () {
          return this._applyCombination(R, arguments);
        },
        complement: function () {
          return this._applyCombination(W, arguments);
        },
        monochromatic: function () {
          return this._applyCombination(L, arguments);
        },
        splitcomplement: function () {
          return this._applyCombination(U, arguments);
        },
        triad: function () {
          return this._applyCombination(z, arguments);
        },
        tetrad: function () {
          return this._applyCombination(aj, arguments);
        },
      };
      af.fromRatio = function (an, aq) {
        if (typeof an == "object") {
          var ao = {};
          for (var ap in an) {
            if (an.hasOwnProperty(ap)) {
              if (ap === "a") {
                ao[ap] = an[ap];
              } else {
                ao[ap] = H(an[ap]);
              }
            }
          }
          an = ao;
        }
        return af(an, aq);
      };
      function ac(ao) {
        var ap = { r: 0, g: 0, b: 0 };
        var an = 1;
        var aq = false;
        var ar = false;
        if (typeof ao == "string") {
          ao = N(ao);
        }
        if (typeof ao == "object") {
          if (
            ao.hasOwnProperty("r") &&
            ao.hasOwnProperty("g") &&
            ao.hasOwnProperty("b")
          ) {
            ap = A(ao.r, ao.g, ao.b);
            aq = true;
            ar = String(ao.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else {
            if (
              ao.hasOwnProperty("h") &&
              ao.hasOwnProperty("s") &&
              ao.hasOwnProperty("v")
            ) {
              ao.s = H(ao.s);
              ao.v = H(ao.v);
              ap = aa(ao.h, ao.s, ao.v);
              aq = true;
              ar = "hsv";
            } else {
              if (
                ao.hasOwnProperty("h") &&
                ao.hasOwnProperty("s") &&
                ao.hasOwnProperty("l")
              ) {
                ao.s = H(ao.s);
                ao.l = H(ao.l);
                ap = S(ao.h, ao.s, ao.l);
                aq = true;
                ar = "hsl";
              }
            }
          }
          if (ao.hasOwnProperty("a")) {
            an = ao.a;
          }
        }
        an = E(an);
        return {
          ok: aq,
          format: ao.format || ar,
          r: ak(255, M(ap.r, 0)),
          g: ak(255, M(ap.g, 0)),
          b: ak(255, M(ap.b, 0)),
          a: an,
        };
      }
      function A(ap, ao, an) {
        return {
          r: ag(ap, 255) * 255,
          g: ag(ao, 255) * 255,
          b: ag(an, 255) * 255,
        };
      }
      function G(an, ar, au) {
        an = ag(an, 255);
        ar = ag(ar, 255);
        au = ag(au, 255);
        var av = M(an, ar, au),
          ap = ak(an, ar, au);
        var aq,
          aw,
          ao = (av + ap) / 2;
        if (av == ap) {
          aq = aw = 0;
        } else {
          var at = av - ap;
          aw = ao > 0.5 ? at / (2 - av - ap) : at / (av + ap);
          switch (av) {
            case an:
              aq = (ar - au) / at + (ar < au ? 6 : 0);
              break;
            case ar:
              aq = (au - an) / at + 2;
              break;
            case au:
              aq = (an - ar) / at + 4;
              break;
          }
          aq /= 6;
        }
        return { h: aq, s: aw, l: ao };
      }
      function S(at, aw, ar) {
        var an, au, av;
        at = ag(at, 360);
        aw = ag(aw, 100);
        ar = ag(ar, 100);
        function aq(az, ay, ax) {
          if (ax < 0) {
            ax += 1;
          }
          if (ax > 1) {
            ax -= 1;
          }
          if (ax < 1 / 6) {
            return az + (ay - az) * 6 * ax;
          }
          if (ax < 1 / 2) {
            return ay;
          }
          if (ax < 2 / 3) {
            return az + (ay - az) * (2 / 3 - ax) * 6;
          }
          return az;
        }
        if (aw === 0) {
          an = au = av = ar;
        } else {
          var ao = ar < 0.5 ? ar * (1 + aw) : ar + aw - ar * aw;
          var ap = 2 * ar - ao;
          an = aq(ap, ao, at + 1 / 3);
          au = aq(ap, ao, at);
          av = aq(ap, ao, at - 1 / 3);
        }
        return { r: an * 255, g: au * 255, b: av * 255 };
      }
      function B(an, aq, at) {
        an = ag(an, 255);
        aq = ag(aq, 255);
        at = ag(at, 255);
        var au = M(an, aq, at),
          ao = ak(an, aq, at);
        var ap,
          aw,
          av = au;
        var ar = au - ao;
        aw = au === 0 ? 0 : ar / au;
        if (au == ao) {
          ap = 0;
        } else {
          switch (au) {
            case an:
              ap = (aq - at) / ar + (aq < at ? 6 : 0);
              break;
            case aq:
              ap = (at - an) / ar + 2;
              break;
            case at:
              ap = (an - aq) / ar + 4;
              break;
          }
          ap /= 6;
        }
        return { h: ap, s: aw, v: av };
      }
      function aa(ar, az, ax) {
        ar = ag(ar, 360) * 6;
        az = ag(az, 100);
        ax = ag(ax, 100);
        var aq = P.floor(ar),
          au = ar - aq,
          ap = ax * (1 - az),
          ao = ax * (1 - au * az),
          ay = ax * (1 - (1 - au) * az),
          aw = aq % 6,
          an = [ax, ao, ap, ap, ay, ax][aw],
          at = [ay, ax, ax, ao, ap, ap][aw],
          av = [ap, ap, ay, ax, ax, ao][aw];
        return { r: an * 255, g: at * 255, b: av * 255 };
      }
      function ab(aq, ap, an, ar) {
        var ao = [
          Q(T(aq).toString(16)),
          Q(T(ap).toString(16)),
          Q(T(an).toString(16)),
        ];
        if (
          ar &&
          ao[0].charAt(0) == ao[0].charAt(1) &&
          ao[1].charAt(0) == ao[1].charAt(1) &&
          ao[2].charAt(0) == ao[2].charAt(1)
        ) {
          return ao[0].charAt(0) + ao[1].charAt(0) + ao[2].charAt(0);
        }
        return ao.join("");
      }
      function al(ar, aq, an, ao) {
        var ap = [
          Q(V(ao)),
          Q(T(ar).toString(16)),
          Q(T(aq).toString(16)),
          Q(T(an).toString(16)),
        ];
        return ap.join("");
      }
      af.equals = function (ao, an) {
        if (!ao || !an) {
          return false;
        }
        return af(ao).toRgbString() == af(an).toRgbString();
      };
      af.random = function () {
        return af.fromRatio({ r: D(), g: D(), b: D() });
      };
      function O(ao, ap) {
        ap = ap === 0 ? 0 : ap || 10;
        var an = af(ao).toHsl();
        an.s -= ap / 100;
        an.s = u(an.s);
        return af(an);
      }
      function Z(ao, ap) {
        ap = ap === 0 ? 0 : ap || 10;
        var an = af(ao).toHsl();
        an.s += ap / 100;
        an.s = u(an.s);
        return af(an);
      }
      function y(an) {
        return af(an).desaturate(100);
      }
      function J(ao, ap) {
        ap = ap === 0 ? 0 : ap || 10;
        var an = af(ao).toHsl();
        an.l += ap / 100;
        an.l = u(an.l);
        return af(an);
      }
      function v(an, ap) {
        ap = ap === 0 ? 0 : ap || 10;
        var ao = af(an).toRgb();
        ao.r = M(0, ak(255, ao.r - T(255 * -(ap / 100))));
        ao.g = M(0, ak(255, ao.g - T(255 * -(ap / 100))));
        ao.b = M(0, ak(255, ao.b - T(255 * -(ap / 100))));
        return af(ao);
      }
      function I(ao, ap) {
        ap = ap === 0 ? 0 : ap || 10;
        var an = af(ao).toHsl();
        an.l -= ap / 100;
        an.l = u(an.l);
        return af(an);
      }
      function ae(ap, aq) {
        var ao = af(ap).toHsl();
        var an = (T(ao.h) + aq) % 360;
        ao.h = an < 0 ? 360 + an : an;
        return af(ao);
      }
      function W(ao) {
        var an = af(ao).toHsl();
        an.h = (an.h + 180) % 360;
        return af(an);
      }
      function z(ao) {
        var an = af(ao).toHsl();
        var ap = an.h;
        return [
          af(ao),
          af({ h: (ap + 120) % 360, s: an.s, l: an.l }),
          af({ h: (ap + 240) % 360, s: an.s, l: an.l }),
        ];
      }
      function aj(ao) {
        var an = af(ao).toHsl();
        var ap = an.h;
        return [
          af(ao),
          af({ h: (ap + 90) % 360, s: an.s, l: an.l }),
          af({ h: (ap + 180) % 360, s: an.s, l: an.l }),
          af({ h: (ap + 270) % 360, s: an.s, l: an.l }),
        ];
      }
      function U(ao) {
        var an = af(ao).toHsl();
        var ap = an.h;
        return [
          af(ao),
          af({ h: (ap + 72) % 360, s: an.s, l: an.l }),
          af({ h: (ap + 216) % 360, s: an.s, l: an.l }),
        ];
      }
      function R(ao, ar, at) {
        ar = ar || 6;
        at = at || 30;
        var an = af(ao).toHsl();
        var aq = 360 / at;
        var ap = [af(ao)];
        for (an.h = (an.h - ((aq * ar) >> 1) + 720) % 360; --ar; ) {
          an.h = (an.h + aq) % 360;
          ap.push(af(an));
        }
        return ap;
      }
      function L(ap, at) {
        at = at || 6;
        var ar = af(ap).toHsv();
        var av = ar.h,
          au = ar.s,
          ao = ar.v;
        var aq = [];
        var an = 1 / at;
        while (at--) {
          aq.push(af({ h: av, s: au, v: ao }));
          ao = (ao + an) % 1;
        }
        return aq;
      }
      af.mix = function (ay, ax, au) {
        au = au === 0 ? 0 : au || 50;
        var ar = af(ay).toRgb();
        var ap = af(ax).toRgb();
        var an = au / 100;
        var aw = an * 2 - 1;
        var av = ap.a - ar.a;
        var at;
        if (aw * av == -1) {
          at = aw;
        } else {
          at = (aw + av) / (1 + aw * av);
        }
        at = (at + 1) / 2;
        var aq = 1 - at;
        var ao = {
          r: ap.r * at + ar.r * aq,
          g: ap.g * at + ar.g * aq,
          b: ap.b * at + ar.b * aq,
          a: ap.a * an + ar.a * (1 - an),
        };
        return af(ao);
      };
      af.readability = function (aw, av) {
        var ar = af(aw);
        var ap = af(av);
        var aq = ar.toRgb();
        var ao = ap.toRgb();
        var at = ar.getBrightness();
        var an = ap.getBrightness();
        var au =
          Math.max(aq.r, ao.r) -
          Math.min(aq.r, ao.r) +
          Math.max(aq.g, ao.g) -
          Math.min(aq.g, ao.g) +
          Math.max(aq.b, ao.b) -
          Math.min(aq.b, ao.b);
        return { brightness: Math.abs(at - an), color: au };
      };
      af.isReadable = function (ao, an) {
        var ap = af.readability(ao, an);
        return ap.brightness > 125 && ap.color > 500;
      };
      af.mostReadable = function (av, au) {
        var aq = null;
        var ao = 0;
        var aw = false;
        for (var at = 0; at < au.length; at++) {
          var ap = af.readability(av, au[at]);
          var ar = ap.brightness > 125 && ap.color > 500;
          var an = 3 * (ap.brightness / 125) + ap.color / 500;
          if ((ar && !aw) || (ar && aw && an > ao) || (!ar && !aw && an > ao)) {
            aw = ar;
            ao = an;
            aq = af(au[at]);
          }
        }
        return aq;
      };
      var ah = (af.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32",
      });
      var am = (af.hexNames = ai(ah));
      function ai(ap) {
        var ao = {};
        for (var an in ap) {
          if (ap.hasOwnProperty(an)) {
            ao[ap[an]] = an;
          }
        }
        return ao;
      }
      function E(an) {
        an = parseFloat(an);
        if (isNaN(an) || an < 0 || an > 1) {
          an = 1;
        }
        return an;
      }
      function ag(ap, an) {
        if (X(ap)) {
          ap = "100%";
        }
        var ao = F(ap);
        ap = ak(an, M(0, parseFloat(ap)));
        if (ao) {
          ap = parseInt(ap * an, 10) / 100;
        }
        if (P.abs(ap - an) < 0.000001) {
          return 1;
        }
        return (ap % an) / parseFloat(an);
      }
      function u(an) {
        return ak(1, M(0, an));
      }
      function w(an) {
        return parseInt(an, 16);
      }
      function X(an) {
        return (
          typeof an == "string" && an.indexOf(".") != -1 && parseFloat(an) === 1
        );
      }
      function F(an) {
        return typeof an === "string" && an.indexOf("%") != -1;
      }
      function Q(an) {
        return an.length == 1 ? "0" + an : "" + an;
      }
      function H(an) {
        if (an <= 1) {
          an = an * 100 + "%";
        }
        return an;
      }
      function V(an) {
        return Math.round(parseFloat(an) * 255).toString(16);
      }
      function C(an) {
        return w(an) / 255;
      }
      var x = (function () {
        var ar = "[-\\+]?\\d+%?";
        var aq = "[-\\+]?\\d*\\.\\d+%?";
        var an = "(?:" + aq + ")|(?:" + ar + ")";
        var ap =
          "[\\s|\\(]+(" +
          an +
          ")[,|\\s]+(" +
          an +
          ")[,|\\s]+(" +
          an +
          ")\\s*\\)?";
        var ao =
          "[\\s|\\(]+(" +
          an +
          ")[,|\\s]+(" +
          an +
          ")[,|\\s]+(" +
          an +
          ")[,|\\s]+(" +
          an +
          ")\\s*\\)?";
        return {
          rgb: new RegExp("rgb" + ap),
          rgba: new RegExp("rgba" + ao),
          hsl: new RegExp("hsl" + ap),
          hsla: new RegExp("hsla" + ao),
          hsv: new RegExp("hsv" + ap),
          hsva: new RegExp("hsva" + ao),
          hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
          hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
          hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        };
      })();
      function N(ao) {
        ao = ao.replace(Y, "").replace(K, "").toLowerCase();
        var an = false;
        if (ah[ao]) {
          ao = ah[ao];
          an = true;
        } else {
          if (ao == "transparent") {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
          }
        }
        var ap;
        if ((ap = x.rgb.exec(ao))) {
          return { r: ap[1], g: ap[2], b: ap[3] };
        }
        if ((ap = x.rgba.exec(ao))) {
          return { r: ap[1], g: ap[2], b: ap[3], a: ap[4] };
        }
        if ((ap = x.hsl.exec(ao))) {
          return { h: ap[1], s: ap[2], l: ap[3] };
        }
        if ((ap = x.hsla.exec(ao))) {
          return { h: ap[1], s: ap[2], l: ap[3], a: ap[4] };
        }
        if ((ap = x.hsv.exec(ao))) {
          return { h: ap[1], s: ap[2], v: ap[3] };
        }
        if ((ap = x.hsva.exec(ao))) {
          return { h: ap[1], s: ap[2], v: ap[3], a: ap[4] };
        }
        if ((ap = x.hex8.exec(ao))) {
          return {
            a: C(ap[1]),
            r: w(ap[2]),
            g: w(ap[3]),
            b: w(ap[4]),
            format: an ? "name" : "hex8",
          };
        }
        if ((ap = x.hex6.exec(ao))) {
          return {
            r: w(ap[1]),
            g: w(ap[2]),
            b: w(ap[3]),
            format: an ? "name" : "hex",
          };
        }
        if ((ap = x.hex3.exec(ao))) {
          return {
            r: w(ap[1] + "" + ap[1]),
            g: w(ap[2] + "" + ap[2]),
            b: w(ap[3] + "" + ap[3]),
            format: an ? "name" : "hex",
          };
        }
        return false;
      }
      window.tinycolor = af;
    })();
    e(function () {
      if (e.fn.spectrum.load) {
        e.fn.spectrum.processNativeColorInputs();
      }
    });
  });
  
  $("#color-picker").spectrum({
    color: "#000", // default color
    showInput: true,
    preferredFormat: "hex",
    change: function(color) {
        // Only update the background color and preserve other styles
        $(".generated").each(function() {
            $(this).css("background-color", color.toHexString());
        });
    },
});

// ==UserScript==
// @name         Auto nord light/dark theme
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Applies a Nord color scheme for both light and dark modes based on system preference, excluding specified websites
// @author       Okerew 
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const disabledWebsites = ["youtube.com", "x.com", "netflix.com"];

  function isWebsiteDisabled() {
    const hostname = window.location.hostname;
    return disabledWebsites.some((domain) => hostname.includes(domain));
  }

  const nordColors = {
    dark_bg0: "#1e1e1e",
    dark_bg1: "#2d2d2d",
    dark_bg2: "#3b3b3b",
    dark_bg3: "#4a4a4a",
    dark_text0: "#f5f5f5",
    dark_text1: "#e3e3e3",
    dark_text2: "#d4d4d4",

    light_bg0: "#ECEFF4",
    light_bg1: "#FFFFFF",
    light_bg2: "#E5E9F0",
    light_bg3: "#D8DEE9",
    light_text0: "#2E3440",
    light_text1: "#3B4252",
    light_text2: "#4C566A",

    frost_green: "#8FBCBB",
    frost_cyan: "#88C0D0",
    frost_blue1: "#81A1C1",
    frost_blue2: "#5E81AC",
    aurora_red: "#BF616A",
    aurora_orange: "#D08770",
    aurora_yellow: "#EBCB8B",
    aurora_green: "#A3BE8C",
    aurora_purple: "#B48EAD",
  };

  function createNordDarkCSS() {
    return `
      html, body {
        background-color: ${nordColors.dark_bg0} !important;
        color: ${nordColors.dark_text2} !important;
      }
      h1, h2, h3, h4, h5, h6 { color: ${nordColors.dark_text0} !important; }
      a { color: ${nordColors.frost_cyan} !important; }
      a:hover { color: ${nordColors.frost_blue2} !important; }
      input, textarea, select {
        background-color: ${nordColors.dark_bg1} !important;
        color: ${nordColors.dark_text2} !important;
        border-color: ${nordColors.dark_bg3} !important;
      }
      input:focus, textarea:focus, select:focus {
        border-color: ${nordColors.frost_cyan} !important;
        box-shadow: 0 0 0 2px ${nordColors.frost_cyan}40 !important;
      }
      button, .button, .btn {
        background-color: ${nordColors.frost_cyan} !important;
        color: ${nordColors.dark_bg0} !important;
        border-color: ${nordColors.frost_cyan} !important;
      }
      button:hover, .button:hover, .btn:hover {
        background-color: ${nordColors.frost_blue2} !important;
      }
      code, pre {
        background-color: ${nordColors.dark_bg1} !important;
        color: ${nordColors.dark_text0} !important;
      }
      table { background-color: ${nordColors.dark_bg1} !important; }
      th {
        background-color: ${nordColors.dark_bg2} !important;
        color: ${nordColors.dark_text0} !important;
      }
      td { border-color: ${nordColors.dark_bg3} !important; }
      nav, .nav, .navbar, .menu { background-color: ${nordColors.dark_bg1} !important; }
      .card, .container, .box, .panel {
        background-color: ${nordColors.dark_bg1} !important;
        border-color: ${nordColors.dark_bg3} !important;
      }
      .sidebar, .aside { background-color: ${nordColors.dark_bg2} !important; }
      ::selection {
        background-color: ${nordColors.frost_cyan}60 !important;
        color: ${nordColors.dark_text0} !important;
      }
      ::-webkit-scrollbar { background-color: ${nordColors.dark_bg1} !important; }
      ::-webkit-scrollbar-thumb { background-color: ${nordColors.dark_bg3} !important; }
      ::-webkit-scrollbar-thumb:hover { background-color: ${nordColors.frost_cyan} !important; }
    `;
  }

  function createNordLightCSS() {
    return `
      html, body {
        background-color: ${nordColors.light_bg0} !important;
        color: ${nordColors.light_text2} !important;
      }
      h1, h2, h3, h4, h5, h6 { color: ${nordColors.light_text0} !important; }
      a { color: ${nordColors.frost_blue2} !important; }
      a:hover { color: ${nordColors.frost_blue1} !important; }
      input, textarea, select {
        background-color: ${nordColors.light_bg1} !important;
        color: ${nordColors.light_text1} !important;
        border-color: ${nordColors.light_bg3} !important;
      }
      input:focus, textarea:focus, select:focus {
        border-color: ${nordColors.frost_cyan} !important;
        box-shadow: 0 0 0 2px ${nordColors.frost_cyan}40 !important;
      }
      button, .button, .btn {
        background-color: ${nordColors.frost_cyan} !important;
        color: ${nordColors.light_bg1} !important;
        border-color: ${nordColors.frost_cyan} !important;
      }
      button:hover, .button:hover, .btn:hover {
        background-color: ${nordColors.frost_blue2} !important;
      }
      code, pre {
        background-color: ${nordColors.light_bg2} !important;
        color: ${nordColors.light_text0} !important;
      }
      table { background-color: ${nordColors.light_bg1} !important; }
      th {
        background-color: ${nordColors.light_bg2} !important;
        color: ${nordColors.light_text0} !important;
      }
      td { border-color: ${nordColors.light_bg3} !important; }
      nav, .nav, .navbar, .menu { background-color: ${nordColors.light_bg1} !important; }
      .card, .container, .box, .panel {
        background-color: ${nordColors.light_bg1} !important;
        border-color: ${nordColors.light_bg3} !important;
      }
      .sidebar, .aside { background-color: ${nordColors.light_bg2} !important; }
      ::selection {
        background-color: ${nordColors.frost_cyan}60 !important;
        color: ${nordColors.light_text0} !important;
      }
      ::-webkit-scrollbar { background-color: ${nordColors.light_bg2} !important; }
      ::-webkit-scrollbar-thumb { background-color: ${nordColors.light_bg3} !important; }
      ::-webkit-scrollbar-thumb:hover { background-color: ${nordColors.frost_cyan} !important; }
    `;
  }

  function applyTheme() {
    const existingStyle = document.getElementById("nord-theme-override");
    if (existingStyle) {
      existingStyle.remove();
    }
    document.documentElement.removeAttribute("data-nord-theme");

    if (isWebsiteDisabled()) {
      return;
    }

    let cssToApply = "";
    let themeName = "";

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      cssToApply = createNordDarkCSS();
      themeName = "dark";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      cssToApply = createNordLightCSS();
      themeName = "light";
    }

    if (cssToApply) {
      const styleElement = document.createElement("style");
      styleElement.id = "nord-theme-override";
      styleElement.textContent = cssToApply;
      (document.head || document.documentElement).prepend(styleElement);
      document.documentElement.setAttribute("data-nord-theme", themeName);
    }
  }

  applyTheme();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", applyTheme);
})();

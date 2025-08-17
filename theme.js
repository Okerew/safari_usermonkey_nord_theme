// ==UserScript==
// @name         Auto nord dark theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Applies a modified Nord color scheme strictly for dark mode preferred systems, excluding specified websites
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
    nord0: "#1e1e1e", // Dark background
    nord1: "#2d2d2d",
    nord2: "#3b3b3b",
    nord3: "#4a4a4a",
    nord4: "#d4d4d4", // Light text
    nord5: "#e3e3e3",
    nord6: "#f5f5f5",
    nord7: "#8FBCBB",
    nord8: "#88C0D0", // Main accent color
    nord9: "#81A1C1",
    nord10: "#5E81AC",
    nord11: "#BF616A",
    nord12: "#D08770",
    nord13: "#EBCB8B",
    nord14: "#A3BE8C",
    nord15: "#B48EAD",
  };

  let isInitialized = false;
  let styleElement = null;

  // Function to detect if the system prefers dark mode
  function detectTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  // Function to create and return the CSS for the Nord dark theme
  function createNordCSS() {
    return `
      /* Nord Dark Theme Override */
      html, body {
        background-color: ${nordColors.nord0} !important;
        color: ${nordColors.nord4} !important;
      }

      /* Headers */
      h1, h2, h3, h4, h5, h6 {
        color: ${nordColors.nord6} !important;
      }

      /* Links */
      a {
        color: ${nordColors.nord8} !important;
      }

      a:hover {
        color: ${nordColors.nord10} !important;
      }

      /* Form elements */
      input, textarea, select {
        background-color: ${nordColors.nord1} !important;
        color: ${nordColors.nord4} !important;
        border-color: ${nordColors.nord3} !important;
      }

      input:focus, textarea:focus, select:focus {
        border-color: ${nordColors.nord8} !important;
        box-shadow: 0 0 0 2px ${nordColors.nord8}40 !important;
      }

      /* Buttons */
      button, .button, .btn {
        background-color: ${nordColors.nord8} !important;
        color: ${nordColors.nord0} !important;
        border-color: ${nordColors.nord8} !important;
      }

      button:hover, .button:hover, .btn:hover {
        background-color: ${nordColors.nord10} !important;
      }

      /* Code blocks */
      code, pre {
        background-color: ${nordColors.nord1} !important;
        color: ${nordColors.nord6} !important;
      }

      /* Tables */
      table {
        background-color: ${nordColors.nord1} !important;
      }

      th {
        background-color: ${nordColors.nord2} !important;
        color: ${nordColors.nord6} !important;
      }

      td {
        border-color: ${nordColors.nord3} !important;
      }

      /* Navigation and menus */
      nav, .nav, .navbar, .menu {
        background-color: ${nordColors.nord1} !important;
      }

      /* Cards and containers */
      .card, .container, .box, .panel {
        background-color: ${nordColors.nord1} !important;
        border-color: ${nordColors.nord3} !important;
      }

      /* Sidebar */
      .sidebar, .aside {
        background-color: ${nordColors.nord2} !important;
      }

      /* Highlights and selections */
      ::selection {
        background-color: ${nordColors.nord8}60 !important;
        color: ${nordColors.nord0} !important;
      }

      /* Scrollbars (Webkit) */
      ::-webkit-scrollbar {
        background-color: ${nordColors.nord1} !important;
      }

      ::-webkit-scrollbar-thumb {
        background-color: ${nordColors.nord3} !important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: ${nordColors.nord8} !important;
      }
    `;
  }

  function applyNordTheme() {
    if (isInitialized || isWebsiteDisabled()) return;

    const detectedTheme = detectTheme();
    if (detectedTheme !== "dark") {
      console.log("Nord Theme: Light theme detected, no changes applied.");
      return;
    }

    console.log("Nord Theme: Applying dark theme...");
    // Remove existing style if present
    if (styleElement) {
      styleElement.remove();
    }

    // Create and inject CSS for dark theme only
    styleElement = document.createElement("style");
    styleElement.id = "nord-theme-override";
    styleElement.textContent = createNordCSS();

    // Insert style at the beginning of head or append to head/html
    const head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      head.insertBefore(styleElement, head.firstChild);
    } else {
      document.documentElement.appendChild(styleElement);
    }

    isInitialized = true;
    // Add indicator showing which theme is active
    document.documentElement.setAttribute("data-nord-theme", detectedTheme);
    document.documentElement.setAttribute("data-nord-source", "macos-system");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyNordTheme);
  } else {
    applyNordTheme();
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (!isInitialized) {
        applyNordTheme();
      }
    }, 500);
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const lightModeQuery = window.matchMedia("(prefers-color-scheme: light)");

    const handleThemeChange = () => {
      console.log("Nord Theme: System appearance changed, re-evaluating...");
      isInitialized = false;
      setTimeout(applyNordTheme, 100);
    };

    darkModeQuery.addListener(handleThemeChange);
    lightModeQuery.addListener(handleThemeChange);
  }
})();

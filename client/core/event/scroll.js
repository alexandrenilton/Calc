/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Listen for grid scrolling
   *
   * @method scroll
   * @static
   */
  NOVAE.Event.scroll = function(e) {

    /** Disable zooming */
    e.preventDefault();

    /** Update empty timestamp */
    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll) NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    /** Abort if [STRG] key pressed */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg) return void 0;

    /** Detect large grid */
    var largeGrid = NOVAE.Event.isLargeGrid();

    /** Detect horizontal scrolling */
    var horizontalScroll = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift ? true : false;

    var direction = 0;

    var amount = 0;

    var difference = 0;

    var calcDifference = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * (NOVAE.SystemSpeed - .5));

    /** Calculate if fast (native) scrolling is necessary */
    var fastScroll = NOVAE.Sheets[NOVAE.CurrentSheet].fastScroll;

    /** We're on a mobile device */
    if (NOVAE.Settings.Mobile) {

      var currentY = e.touches[0].clientY;
      var currentX = e.touches[0].clientX;

      var lastY = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY;
      var lastX = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX;

      if (currentY > lastY) {
        direction = 0;
      } else if (currentY < lastY) {
        direction = 1;
      } else {
        if (lastX > -1 && currentX > -1) {
          if (lastX < currentX) {
            direction = 0;
            horizontalScroll = true;
          } else if (lastX > currentX) {
            direction = 1;
            horizontalScroll = true;
          }
        }
      }

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY = currentY;
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX = currentX;

    }

    /** Make sure the grid was scrolled */
    if (e.target.parentNode.parentNode.id !== NOVAE.DOM.TableBody.id) return void 0;

    /** Only calculate that way, if not on mobile */
    if (!NOVAE.Settings.Mobile) {
      var scroll = NOVAE.$.calculateScroll(e);
      direction = scroll.direction;
      amount = scroll.amount;
    }

    direction = direction ? "down" : "up";

    /** Handle timestamps */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll > 0) {

      /** Calculate difference between this and last timestamp */
      difference = e.timeStamp - NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll;

      var selectedCellsLength = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells.length;

      /** Mobile device */
      if (!NOVAE.Settings.Mobile) {
        /** Large selection slows scrolling, below code fixes that */
        if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells.length >= 1e3) {
          /** Only do large scrolling if user presses the mouse */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed) {
            NOVAE.Settings.Scroll.Vertical = calcDifference + (Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) * 100);
          /** Go back to default mouse scroll amount */
          } else {
            /** Fast scroll depending on selection length, the larger the selection the greater the fast scroll chance */
            if (difference / NOVAE.SystemSpeed <= calcDifference * Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) / NOVAE.SystemSpeed) {
              NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
            /** Large selection, dont care just scroll fast */
            } else if (difference <= 75 && selectedCellsLength >= 1e4) {
              NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
            /** Slow scroll */
            } else {
              NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical;
            }
          }
        /** Fast scrolling */
        } else if (difference <= 75) {
          NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
        /** Slow scrolling */
        } else {
          NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical * Math.ceil(NOVAE.SystemSpeed);
        }
      /** Mobile device scroll amount */
      } else {
        NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical + 2;
      }

    }

    /** Calculate a scroll amount, divisible by celltemplate height */
    var scrollAmount = Math.roundTo(NOVAE.Settings.Scroll.Vertical * 5, 25);

    /** User scrolled up or down, dont redraw */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = true;

    if (largeGrid) scrollAmount *= 2;

    /** Vertical scroll */
    if (!horizontalScroll) {

      switch (direction) {

        /** DOWN */
        case "down":

          /** Native optimized scrolling */
          if (fastScroll) {

            NOVAE.DOM.Viewport.scrollTop += scrollAmount;

            var downSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 3);

            var downReRender = Math.floor(NOVAE.DOM.Viewport.scrollTop / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height) + downSettingsY;

            if (downReRender >= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) {
console.log("Re-render Down");
              NOVAE.DOM.Viewport.scrollTop = 0;

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += Math.floor((downReRender - downSettingsY - 6));
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cleanHoverEffect();
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

          /** Default scrolling */
          } else {

            NOVAE.DOM.Viewport.scrollTop = 0;

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += NOVAE.Settings.Scroll.Vertical;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
            NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
            //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

          }

          break;

        /** UP */
        case "up":

          /** Native optimized scrolling */
          if (fastScroll) {

            var upSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 3);

            var upReRender = Math.floor(NOVAE.DOM.Viewport.scrollTop / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height) - upSettingsY;

            if (upReRender < 0) upReRender = upReRender * -1;

            NOVAE.DOM.Viewport.scrollTop -= Math.floor(scrollAmount / 2);

            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY > 0 && upReRender === upSettingsY) {
console.log("Re-render Up");
              NOVAE.DOM.Viewport.scrollTop = NOVAE.DOM.Viewport.scrollHeight;

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= Math.floor(upReRender + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 4) + 6;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cleanHoverEffect();
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

          /** Default scrolling */
          } else {

            NOVAE.DOM.Viewport.scrollTop = 0;

            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY - NOVAE.Settings.Scroll.Vertical <= 0) {

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

              if (!largeGrid) NOVAE.Event.animateMouseUpMaximum();

            } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY - NOVAE.Settings.Scroll.Vertical >= 0) {

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("up", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              //NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

          }

          break;

      }

    /** Horizontal Scroll */
    } else {

      switch (direction) {

        /** DOWN */
        case "down":

          NOVAE.DOM.Viewport.scrollTop += scrollAmount;

          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX += NOVAE.Settings.Scroll.Horizontal;
          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
          NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("right", NOVAE.Settings.Scroll.Horizontal);

          break;

        /** UP */
        case "up":

          NOVAE.DOM.Viewport.scrollTop -= scrollAmount;

          /** Zero scroll */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX - NOVAE.Settings.Scroll.Horizontal <= 0) {

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX = 0;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = 0;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
            NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

          /** Default scroll */
          } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX - NOVAE.Settings.Scroll.Horizontal >= 0) {

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX -= NOVAE.Settings.Scroll.Horizontal;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
            NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("left");

          }

          break;

      }

    }

    /** Make sure user scrolled */
    if (direction) {

      /** Share scrolling */
      if (NOVAE.Connector.connected) {
        NOVAE.Connector.action("scrolling", {direction: direction, amount: NOVAE.Settings.Scroll.Vertical, position: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY});
      }

      /** Simulate mouse move to display the scrolled selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.x = Math.random();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.y = Math.random();
      /** Only simulate if we're on desktop */
      if (!NOVAE.Settings.Mobile) NOVAE.Event.mouseWipe(e);

    }

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

  };
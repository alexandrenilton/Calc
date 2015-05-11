/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */
(function() { "use strict"

  /**
   * Mark cell column in the menu based on selected cells
   *
   * @method updateMenu
   * @static
   */
  CORE.Selector.prototype.menuSelection = function(x, y) {

    x -= CORE.Grid.Settings.scrolledX;
    y -= CORE.Grid.Settings.scrolledY;

    /** Clean the menu */
    if (this.MenuSelection.Horizontal >= 0 && this.MenuSelection.Vertical >= 0) {

      CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.add("cell_dark");
      CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.remove("cell_bright");

      CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.add("cell_dark");
      CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.remove("cell_bright");

    }

    /** Update the menu */
    this.MenuSelection.Horizontal = x;
    this.MenuSelection.Vertical = y;

    if (CORE.DOM.HorizontalMenu.children[x] && CORE.DOM.VerticalMenu.children[y]) {

      CORE.DOM.HorizontalMenu.children[x].classList.add("cell_bright");
      CORE.DOM.HorizontalMenu.children[x].classList.remove("cell_dark");

      CORE.DOM.VerticalMenu.children[y].classList.add("cell_bright");
      CORE.DOM.VerticalMenu.children[y].classList.remove("cell_dark");

    }

  };

}).call(this);
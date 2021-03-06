/**
 * This file is part of the Calc project.
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

  /** Create Action Object */
  NOVAE_UI.ACTION = {
    /** SAVE */
    save: function() {
      NOVAE.File.export();
    },
    /** SAVE IMAGE */
    saveImage: function() {
      NOVAE.File.exportImage();
    },
    /** OPEN */
    open: function() {
      NOVAE.File.import();
    }
  };
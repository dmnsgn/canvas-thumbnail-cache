import canvasContext from "canvas-context";

/**
 * @typedef {object} Slot
 * @property {number} x Horizontal position in the grid.
 * @property {number} y Vertical position in the grid.
 */

/**
 * @typedef {object} Options
 * @property {CanvasRenderingContext2D} [context=createCanvasContext("2d", { offscreen: true }).context] Canvas to render thumbnails too. Will try to get an offscreen canvas by default.
 * @property {number} [size=2]  Size of the canvas at start: a square with sides of length `slotSize * size`.
 * @property {number} [slotSize=64] Size of the thumbnails. Will be drawn from center of the grid slot.
 */

class CanvasThumbnailCache {
  /**
   * Creates an instance of CanvasThumbnailCache.
   * @param {Options} [options={}]
   */
  constructor({
    context = canvasContext("2d", { offscreen: true }).context,
    slotSize = 64,
    size = 2,
  } = {}) {
    this.context = context;
    this.slotSize = slotSize;

    this.initSize = size;

    this.reset();
  }

  // Public
  /**
   * Reset and clear the canvas size and empty the thumbnails cache.
   */
  reset() {
    this.size = this.initSize;
    this.indices = this.getIndexArray(this.size * this.size);
    this.slots = new Map();
    this.updateCanvas(true);
  }

  /**
   * Add an image (or anything that can be draw into a 2D canvas) to the cache and return its slot.
   * @param {string} key Slots map key
   * @param {CanvasImageSource} source HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement, ImageBitmap, OffscreenCanvas
   * @returns {Slot}
   */
  add(key, source) {
    const slot = this.getSlot();
    this.drawSource(source, slot);
    this.slots.set(key, slot);

    return slot;
  }

  /**
   * Get a slot
   *
   * The slot can also be retrieved with get and the key passed when calling `thumbnailsCache.add(key, source)`.
   * @param {string} key
   * @returns {Slot}
   */
  get(key) {
    return this.slots.get(key);
  }

  /**
   * Remove the specified image from the cache and clear its slot.
   * @param {string} key
   */
  remove(key) {
    const slot = this.slots.get(key);
    this.clearSlot(slot);
    this.indices[slot.x + this.size * slot.y] = null;
    this.slots.delete(key);
  }

  // Data
  /**
   * @private
   */
  getIndexArray(size) {
    return new Array(size).fill(null);
  }

  /**
   * @private
   */
  getSlot() {
    let index = this.indices.findIndex((index) => index === null);

    if (index === -1) {
      index = this.size;

      for (let y = 0; y < this.size; y++) {
        this.indices.splice(
          y * this.size * 2 + this.size,
          0,
          ...this.getIndexArray(this.size)
        );
        this.indices.push(...this.getIndexArray(this.size * 2));
      }
      this.size = this.size * 2;
      this.updateCanvas();
    }

    this.indices[index] = 1;

    return {
      x: index % this.size,
      y: Math.floor(index / this.size),
    };
  }

  // Canvas operations
  /**
   * @private
   */
  updateCanvas(clear) {
    const newSize = this.size * this.slotSize;
    if (clear) {
      this.context.canvas.width = newSize;
      this.context.canvas.height = newSize;
    } else {
      const imageData = this.context.getImageData(
        0,
        0,
        newSize / 2,
        newSize / 2
      );
      this.context.canvas.width = newSize;
      this.context.canvas.height = newSize;
      this.context.putImageData(imageData, 0, 0);
    }
  }

  /**
   * @private
   */
  drawSource(image, slot) {
    const ratio = image.naturalWidth / image.naturalHeight;

    try {
      if (ratio > 1) {
        this.context.drawImage(
          image,
          slot.x * this.slotSize,
          slot.y * this.slotSize +
            this.slotSize / 2 -
            this.slotSize / ratio / 2,
          this.slotSize,
          this.slotSize / ratio
        );
      } else {
        this.context.drawImage(
          image,
          slot.x * this.slotSize +
            this.slotSize / 2 -
            (this.slotSize * ratio) / 2,
          slot.y * this.slotSize,
          this.slotSize * ratio,
          this.slotSize
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @private
   */
  clearSlot(slot) {
    this.context.clearRect(slot.x, slot.y, this.slotSize, this.slotSize);
  }
}

export default CanvasThumbnailCache;

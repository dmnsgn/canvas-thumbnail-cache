import createCanvasContext from "canvas-context";

export default class CanvasThumbnailCache {
  constructor({
    context = createCanvasContext("2d", { offscreen: true }).context,
    slotSize = 64,
    size = 2,
  } = {}) {
    this.context = context;
    this.slotSize = slotSize;

    this.initSize = size;

    this.reset();
  }

  // Public
  reset() {
    this.size = this.initSize;
    this.indices = this.getIndexArray(this.size * this.size);
    this.slots = new Map();
    this.updateCanvas(true);
  }

  add(key, source) {
    const slot = this.getSlot();
    this.drawSource(source, slot);
    this.slots.set(key, slot);

    return slot;
  }

  get(key) {
    return this.slots.get(key);
  }

  remove(key) {
    const slot = this.slots.get(key);
    this.clearSlot(slot);
    this.indices[slot.x + this.size * slot.y] = null;
    this.slots.delete(key);
  }

  // Data
  getIndexArray(size) {
    return new Array(size).fill(null);
  }

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

  clearSlot(slot) {
    this.context.clearRect(slot.x, slot.y, this.slotSize, this.slotSize);
  }
}

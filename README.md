# canvas-thumbnail-cache [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm version](https://badge.fury.io/js/canvas-thumbnail-cache.svg)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Draw images into a canvas square grid for fast retrieval at a thumbnail size.

![](https://raw.githubusercontent.com/dmnsgn/canvas-thumbnail-cache/master/screenshot.gif)

## Installation

```bash
npm install canvas-thumbnail-cache
```

[![NPM](https://nodei.co/npm/canvas-thumbnail-cache.png)](https://nodei.co/npm/canvas-thumbnail-cache/)

## Usage

```js
import CanvasThumbnailCache from "canvas-thumbnail-cache";
import createCanvasContext from "canvas-context";
import AsyncPreloader from "async-preloader";

const { canvas, context } = createCanvasContext("2d");
document.body.appendChild(canvas);

const COUNT = 50;

const thumbnailsCache = new CanvasThumbnailCache({
	context,
	slotSize: 128,
});

(async () => {
	const items = Array.from({ length: COUNT }, (_, index) => {
		return {
			id: index,
			src: `https://source.unsplash.com/collection/155977/${index}`,
			loader: "Image",
		};
	});

	items.map(async (item) => {
		const image = await AsyncPreloader.default.loadItem(item);

		thumbnailsCache.add(item.id, image);
	});
})();
```

## API

### `const thumbnailsCache = new CanvasThumbnailCache(options)`

| Option               | Type                      | Default                                                | Description                                                                      |
| -------------------- | ------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **options.context**  | CanvasRenderingContext2D? | createCanvasContext("2d", { offscreen: true }).context | Canvas to render thumbnails too. Will try to get an offscreen canvas by default. |
| **options.size**     | number?                   | 2                                                      | Size of the canvas at start: a square with sides of length `slotSize * size`.    |
| **options.slotSize** | number?                   | 64                                                     | Size of the thumbnails. Will be drawn from center of the grid slot.              |

#### interface Slot

Port options are all optional and intended to change the appearance in the Inspector component (using slider instead of number box, adding color interface for an array of 4 components...).

| Option | Type    | Description                      |
| :----- | :------ | :------------------------------- |
| **x**  | integer | Horizontal position in the grid. |
| **y**  | integer | Vertical position in the grid.   |

### `thumbnailsCache.add(key: string, source: CanvasImageSource): Slot`

Add an image (or anything that can be draw into a 2D canvas) to the cache and return its slot.

### `thumbnailsCache.get(key: string)`

The slot can also be retrieved with get and the key passed when calling `thumbnailsCache.add(key, source)`.

### `thumbnailsCache.remove(key: string)`

Remove the specified image from the cache and clear its slot.

### `thumbnailsCache.reset(key: string)`

Reset and clear the canvas size and empty the thumbnails cache.

## License

MIT. See [license file](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/master/LICENSE.md).

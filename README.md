# canvas-thumbnail-cache

[![npm version](https://img.shields.io/npm/v/canvas-thumbnail-cache)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/canvas-thumbnail-cache)](https://bundlephobia.com/package/canvas-thumbnail-cache)
[![dependencies](https://img.shields.io/librariesio/release/npm/canvas-thumbnail-cache)](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/main/package.json)
[![types](https://img.shields.io/npm/types/canvas-thumbnail-cache)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/canvas-thumbnail-cache)](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/main/LICENSE.md)

Draw images into a canvas square grid for fast retrieval at a thumbnail size.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

![](https://raw.githubusercontent.com/dmnsgn/canvas-thumbnail-cache/main/screenshot.gif)

## Installation

```bash
npm install canvas-thumbnail-cache
```

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
    const image = await AsyncPreloader.loadItem(item);

    thumbnailsCache.add(item.id, image);
  });
})();
```

## API

<!-- api-start -->

## Classes

<dl>
<dt><a href="#CanvasThumbnailCache">CanvasThumbnailCache</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Slot">Slot</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="CanvasThumbnailCache"></a>

## CanvasThumbnailCache

**Kind**: global class

- [CanvasThumbnailCache](#CanvasThumbnailCache)
  - [new CanvasThumbnailCache([options])](#new_CanvasThumbnailCache_new)
  - [.reset()](#CanvasThumbnailCache+reset)
  - [.add(key, source)](#CanvasThumbnailCache+add) ⇒ [<code>Slot</code>](#Slot)
  - [.get(key)](#CanvasThumbnailCache+get) ⇒ [<code>Slot</code>](#Slot)
  - [.remove(key)](#CanvasThumbnailCache+remove)

<a name="new_CanvasThumbnailCache_new"></a>

### new CanvasThumbnailCache([options])

Creates an instance of CanvasThumbnailCache.

| Param     | Type                             | Default         |
| --------- | -------------------------------- | --------------- |
| [options] | [<code>Options</code>](#Options) | <code>{}</code> |

<a name="CanvasThumbnailCache+reset"></a>

### canvasThumbnailCache.reset()

Reset and clear the canvas size and empty the thumbnails cache.

**Kind**: instance method of [<code>CanvasThumbnailCache</code>](#CanvasThumbnailCache)  
<a name="CanvasThumbnailCache+add"></a>

### canvasThumbnailCache.add(key, source) ⇒ [<code>Slot</code>](#Slot)

Add an image (or anything that can be draw into a 2D canvas) to the cache and return its slot.

**Kind**: instance method of [<code>CanvasThumbnailCache</code>](#CanvasThumbnailCache)

| Param  | Type                           | Description                                                                                          |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| key    | <code>string</code>            | Slots map key                                                                                        |
| source | <code>CanvasImageSource</code> | HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement, ImageBitmap, OffscreenCanvas |

<a name="CanvasThumbnailCache+get"></a>

### canvasThumbnailCache.get(key) ⇒ [<code>Slot</code>](#Slot)

Get a slot

The slot can also be retrieved with get and the key passed when calling `thumbnailsCache.add(key, source)`.

**Kind**: instance method of [<code>CanvasThumbnailCache</code>](#CanvasThumbnailCache)

| Param | Type                |
| ----- | ------------------- |
| key   | <code>string</code> |

<a name="CanvasThumbnailCache+remove"></a>

### canvasThumbnailCache.remove(key)

Remove the specified image from the cache and clear its slot.

**Kind**: instance method of [<code>CanvasThumbnailCache</code>](#CanvasThumbnailCache)

| Param | Type                |
| ----- | ------------------- |
| key   | <code>string</code> |

<a name="Slot"></a>

## Slot : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name | Type                | Description                      |
| ---- | ------------------- | -------------------------------- |
| x    | <code>number</code> | Horizontal position in the grid. |
| y    | <code>number</code> | Vertical position in the grid.   |

<a name="Options"></a>

## Options : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name       | Type                                  | Default                                                                       | Description                                                                      |
| ---------- | ------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [context]  | <code>CanvasRenderingContext2D</code> | <code>createCanvasContext(&quot;2d&quot;, { offscreen: true }).context</code> | Canvas to render thumbnails too. Will try to get an offscreen canvas by default. |
| [size]     | <code>number</code>                   | <code>2</code>                                                                | Size of the canvas at start: a square with sides of length `slotSize * size`.    |
| [slotSize] | <code>number</code>                   | <code>64</code>                                                               | Size of the thumbnails. Will be drawn from center of the grid slot.              |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/main/LICENSE.md).

# canvas-thumbnail-cache

[![npm version](https://img.shields.io/npm/v/canvas-thumbnail-cache)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/canvas-thumbnail-cache)](https://www.npmjs.com/package/canvas-thumbnail-cache)
[![dependencies](https://img.shields.io/david/dmnsgn/canvas-thumbnail-cache)](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/main/package.json)
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
    const image = await AsyncPreloader.default.loadItem(item);

    thumbnailsCache.add(item.id, image);
  });
})();
```

## API

<!-- api-start -->

Auto-generated API content.

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/canvas-thumbnail-cache/blob/main/LICENSE.md).

import CanvasThumbnailCache from "./index.js";
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

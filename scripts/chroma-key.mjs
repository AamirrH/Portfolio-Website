export function chromaKey(data, width, height, { removeWatermark = true } = {}) {
  const transparent = new Uint8Array(width * height);
  const watermarkX = Math.floor(width * 2380 / 2576);
  const watermarkY = Math.floor(height * 1250 / 1438);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const greenness = data[i + 1] - Math.max(data[i], data[i + 2]);
    const alpha = greenness > 110 ? 0 : greenness > 40 ? Math.round(255 * (110 - greenness) / 70) : 255;
    data[i + 3] = removeWatermark && x > watermarkX && y > watermarkY ? 0 : Math.min(data[i + 3], alpha);
    transparent[y * width + x] = data[i + 3] === 0 ? 1 : 0;
  }
  // Use the original keyed alpha, not an iteratively expanded neighborhood.
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    let edge = data[i + 3] < 255;
    for (let dy = -2; dy <= 2 && !edge; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && transparent[ny * width + nx]) { edge = true; break; }
    }
    if (edge) data[i + 1] = Math.min(data[i + 1], Math.max(data[i], data[i + 2]));
  }

}

export function keyMagenta(data, width, height, exteriorGaps = []) {
  const count = width * height;
  const distance = new Uint8Array(count);
  const queue = new Uint32Array(count);
  let end = 0;
  const magentaness = (pixel) => {
    const offset = pixel * 4;
    return Math.min(data[offset], data[offset + 2]) - data[offset + 1];
  };
  function add(pixel, depth) {
    if (distance[pixel] || (depth === 1 && magentaness(pixel) <= 90)) return;
    distance[pixel] = depth;
    queue[end++] = pixel;
  }
  function visitNeighbors(pixel, depth) {
    const x = pixel % width;
    if (x > 0) add(pixel - 1, depth);
    if (x < width - 1) add(pixel + 1, depth);
    if (pixel >= width) add(pixel - width, depth);
    if (pixel < count - width) add(pixel + width, depth);
  }
  for (let x = 0; x < width; x++) {
    add(x, 1);
    add(count - width + x, 1);
  }
  for (let y = 1; y < height - 1; y++) {
    add(y * width, 1);
    add((y + 1) * width - 1, 1);
  }
  for (const [x, y] of exteriorGaps) add(y * width + x, 1);
  for (let index = 0; index < end; index++) visitNeighbors(queue[index], 1);
  for (let index = 0; index < end; index++) {
    const pixel = queue[index];
    const depth = distance[pixel];
    if (depth < 3) visitNeighbors(pixel, depth + 1);
    const offset = pixel * 4;
    if (depth === 1) {
      data.fill(0, offset, offset + 4);
    } else {
      data[offset] = Math.min(data[offset], data[offset + 1] + 10);
      data[offset + 3] = Math.round(data[offset + 3] * (depth - 1) / 3);
    }
  }
}

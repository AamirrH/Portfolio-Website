export function chromaKey(data, width, height) {
  const transparent = new Uint8Array(width * height);
  const watermarkX = Math.floor(width * 2380 / 2576);
  const watermarkY = Math.floor(height * 1250 / 1438);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const greenness = data[i + 1] - Math.max(data[i], data[i + 2]);
    const alpha = greenness > 110 ? 0 : greenness > 40 ? Math.round(255 * (110 - greenness) / 70) : 255;
    data[i + 3] = x > watermarkX && y > watermarkY ? 0 : Math.min(data[i + 3], alpha);
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

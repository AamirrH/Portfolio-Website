export function components(data, width, height, includePixels = false) {
  const seen = new Uint8Array(width * height), queue = new Int32Array(width * height), result = [];
  for (let p = 0; p < seen.length; p++) {
    if (seen[p] || data[p*4+3] < 32) continue;
    let head = 0, tail = 1, left = width, right = 0, top = height, bottom = 0;
    queue[0] = p; seen[p] = 1;
    while (head < tail) {
      const n = queue[head++], x = n % width, y = Math.floor(n/width);
      left = Math.min(left,x); right = Math.max(right,x); top = Math.min(top,y); bottom = Math.max(bottom,y);
      for (const next of [x > 0 ? n-1 : -1, x < width-1 ? n+1 : -1, y > 0 ? n-width : -1, y < height-1 ? n+width : -1]) {
        if (next < 0 || seen[next] || data[next*4+3] < 32) continue;
        seen[next] = 1; queue[tail++] = next;
      }
    }
    result.push({left, top, width:right-left+1, height:bottom-top+1, area:tail, ...(includePixels ? {pixels:queue.slice(0,tail)} : {})});
  }
  return result.sort((a,b) => b.area-a.area);
}

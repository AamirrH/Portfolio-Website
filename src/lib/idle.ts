export function idleTask(task:()=>void,timeout=2500){if('requestIdleCallback' in window){const id=requestIdleCallback(task,{timeout});return()=>cancelIdleCallback(id);}const id=setTimeout(task,Math.min(timeout,1000));return()=>clearTimeout(id);}
export async function decodeScene(root: HTMLElement) {
  // A closed info panel can contain lazy images that won't load until it opens.
  const artwork = root.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])');
  await Promise.allSettled(Array.from(artwork, image => image.decode()));
}

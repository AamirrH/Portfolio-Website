export function idleTask(task:()=>void,timeout=2500){if('requestIdleCallback' in window){const id=requestIdleCallback(task,{timeout});return()=>cancelIdleCallback(id);}const id=setTimeout(task,Math.min(timeout,1000));return()=>clearTimeout(id);}
export async function decodeScene(root:HTMLElement){await Promise.allSettled(Array.from(root.querySelectorAll('img')).map(img=>img.decode()));}

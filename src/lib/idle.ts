export function idleTask(task:()=>void){if('requestIdleCallback' in window){const id=requestIdleCallback(task,{timeout:2500});return()=>cancelIdleCallback(id);}const id=setTimeout(task,1000);return()=>clearTimeout(id);}
export async function decodeScene(root:HTMLElement){await Promise.allSettled(Array.from(root.querySelectorAll('img')).map(img=>img.decode()));}

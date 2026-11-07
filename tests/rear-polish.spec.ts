import {test,expect} from '@playwright/test';
for(const width of [1440,390])for(const route of ['home','projects','contact'])test(`rear polish ${route} ${width}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.setViewportSize({width,height:width===390?844:900});await page.goto('/#'+route);await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
 await page.waitForTimeout(3000);await page.screenshot({path:`screenshots/rear-polish-${route}-${width}-3s.png`});
 await page.waitForTimeout(7000);await page.screenshot({path:`screenshots/rear-polish-${route}-${width}-10s.png`});
 await expect(page.locator('.city-below,.plain-city-plate,.traffic-layer')).toHaveCount(0);
 await expect(page.locator('.rear-scene .lower-facades').first()).toBeVisible();
 if(route==='projects'){await expect(page.locator('.project-gantry a')).toHaveCount(3);await expect(page.locator('.exits-panel')).toHaveCount(0);for(const id of ['roomly','swiftship','signalroute'])await expect(page.locator('.project-gantry a[href="#'+id+'"]')).toBeVisible();}
 expect(errors).toEqual([]);
});

import {test,expect} from '@playwright/test';
for(const width of [1440,390]) test(`contact highway and resume ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===390?844:900});
 await page.goto('/#contact');
 await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
 await expect(page.locator('.rear-scene')).toBeVisible();
 await expect(page.locator('.aerial-scene')).toHaveCount(0);
 await expect(page.locator('.gate')).toHaveCount(0);
 const link=page.getByRole('link',{name:'Download résumé'});
 await expect(link).toBeVisible();
 const response=await page.request.get('/assets/documents/Resume_Aamir.pdf');
 expect(response.ok()).toBe(true);
 expect((await response.body()).subarray(0,4).toString()).toBe('%PDF');
 await page.screenshot({path:`screenshots/contact-${width}.png`});
 await page.goto('/#roomly');
 await expect(page.locator('.stop-project-panel h1')).toHaveCSS('font-family','"Space Grotesk", sans-serif');
});

const puppeteer = require('puppeteer');

const months = require('./months');
const creds = require('./creds.json');
const config = require('./bot_config.json');

const url = 'https://www.empresaiformacio.org/sBid';

const startDate = config.start_date.split("-").map(it => parseInt(it));
console.log(startDate);
let days = config.duration;

const snippets = config.snippets;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']
    });
    const page = await browser.newPage();

    console.log('loading...');
    await page.goto(url);

    console.log('waiting for iframe with form to be ready.');
    await page.waitForSelector('iframe[src="/sBid/modules/Login?initial=yes"]');
    
    const elementHandle = await page.$('iframe[src="/sBid/modules/Login?initial=yes"]');
    const frame = await elementHandle.contentFrame();
    
    
    await frame.waitForSelector("input[name='username']");
    await frame.type("input[name='username']", creds.user);
    await frame.type("input[name='password']", creds.pass);
    await frame.click("[type='submit']");
    
    // After login
    await frame.waitForSelector('iframe[name="contentmain"]');
    console.log('logged');

    const handleFrame = await frame.$('iframe[name="contentmain"]');
    const innerFrame = await handleFrame.contentFrame();
    console.log("Inner iframe loaded");

    await innerFrame.waitForSelector("#popupAgenda_calHeader0");
    
   // select day
    console.log(`Starting on ${startDate[2]}-${startDate[1]}-${startDate[0]}`);
    await innerFrame.waitForSelector("#popupAgenda_calContent0");
    await innerFrame.waitForTimeout(1000);
    await innerFrame.evaluate((startDate) => {
        popupAgenda.moveAgenda(`${startDate[2]}`, `${startDate[1]}`, `${startDate[0]}`, false);
    }, startDate);

    await innerFrame.waitForTimeout(1000);
    
    // Click task
    await innerFrame.waitForSelector("#popupAgenda_calHeader0");
    const taskList = await innerFrame.$$('#tablaTasquesDia');
    taskList[0].click();
    
    //in day
    while (days > 0) {
        await innerFrame.waitForTimeout(3000);

        console.log(`New day loaded`);

        await innerFrame.waitForSelector(".panel-heading");
        const day = await innerFrame.evaluate(() => {
            const div = document.getElementsByClassName('panel-heading');
            return div[1].innerText;
        });
        console.log('Date: ', day);

        const hours = await innerFrame.evaluate(() => {
            const labels = document.querySelectorAll('label');
            for (let i = 0; i < labels.length; i++) {
                if (labels[i].innerText == 'Hores màximes:') {
                    const el = labels[i].parentElement.children[2].children[0].innerText;
                    return parseInt(el.charAt(0));
                }
            }
            return 0;
        });
        console.log('Max hours: ', hours);

        if (hours <= 4) { 
            await innerFrame.waitForSelector("#inp_13348");
            const snippet = snippets[Math.floor(Math.random() * snippets.length)];
            for (let i = 0; i < hours; i++) {
                await innerFrame.evaluate(snippetSel => {
                    const sel = document.getElementById(`inp_133${snippetSel.id}`);
                    sel.value = snippetSel.val;
                }, snippet[i]);
            }
    
            const buttonSave = await innerFrame.$('span[title=Emmagatzemar]');
            await buttonSave.click();
        
            await innerFrame.waitForTimeout(3000);
        }


        const buttonNext = await innerFrame.$('img[title=Següent]');
        await buttonNext.click();

        days--;
    }
})();
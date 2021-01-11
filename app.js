const puppeteer = require('puppeteer');

const months = require('./months');
const creds = require('./creds.json');

const url = 'https://www.empresaiformacio.org/sBid';

const startDate = [30, 9, 2020];
let days = 5;
const endDate = [1, startDate[1]+1 == 13 ? 1 : startDate[1]+1, 2020];

const snippets = [
    [
        'inp_13358',
        'inp_13359',
        'inp_13364',
        'inp_13368',
        'inp_13371'
    ],
    [
        'inp_13358',
        'inp_13360',
        'inp_13365',
        'inp_13353',
        'inp_13359',
        'inp_13371'
    ],
    [
        'inp_13353',
        'inp_13358',
        'inp_13360',
        'inp_13365',
        'inp_13359',
        'inp_13371'
    ]
];

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

        await innerFrame.waitForSelector("#inp_13348");
        const snippet = snippets[Math.floor(Math.random() * snippets.length)];
        for (let i = 0; i < hours; i++) {
            await innerFrame.evaluate(id => {
                const sel = document.getElementById(id);
                sel.value = '1.0';
            }, `${snippet[i]}`);
        }

        const buttonSave = await innerFrame.$('span[title=Emmagatzemar]');
        await buttonSave.click();
    
        await innerFrame.waitForTimeout(3000);

        const buttonNext = await innerFrame.$('img[title=Següent]');
        await buttonNext.click();

        days--;
    }
})();
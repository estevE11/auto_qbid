const puppeteer = require('puppeteer');

const months = require('./months');
const creds = require('./creds.json');

const url = 'https://www.empresaiformacio.org/sBid';

const startDate = [17, 09, 2020];

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

const getText = async (el) => {
    return text;
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']
    });
    const page = await browser.newPage();

    console.log('loading..');
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
    
    const handleFrame = await frame.$('iframe[name="contentmain"]');
    const innerFrame = await handleFrame.contentFrame();
    console.log("Inner iframe loaded");

    await innerFrame.waitForSelector("#popupAgenda_calHeader0");
    let element = await innerFrame.$("#popupAgenda_calHeader0");
    let text = await innerFrame.evaluate(element => element.textContent, element);
    let date = text.split(" ");
    
    //Get to date
    let currentM = months[date[0]];
    while(currentM != startDate[1]) {
        if(currentM > startDate[1]) {
            await innerFrame.evaluate(() => {
                popupAgenda.shiftAgenda(-1);
            });
        } else {
            await innerFrame.evaluate(() => {
                popupAgenda.shiftAgenda(1);
            });
        }
        
        await innerFrame.waitForSelector("#popupAgenda_calHeader0");
        element = await innerFrame.$("#popupAgenda_calHeader0");
        text = await innerFrame.evaluate(element => element.textContent, element);
        date = text.split(" ");
        
        //Get to date
        currentM = months[date[0]];
    }
    
    // select day
    await innerFrame.evaluate((startDate) => {
        popupAgenda.moveAgenda(`${startDate[2]}`, `${startDate[1]}`, `${startDate[0]}`, true);
    }, startDate);

    // Click task
    const taskList = await innerFrame.$$('#tablaTasquesDia');
    taskList[0].click();

    //in day

})();
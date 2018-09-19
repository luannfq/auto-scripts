const puppeteer = require('puppeteer');

const CONFIG = require('./config.json');

const LMS_URL    = CONFIG.website;
const USER_EMAIL = CONFIG.email;
const USER_PASS  = CONFIG.password;

const QUESTION_WAIT = 500;


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280, height: 720
        });

        await page.goto(LMS_URL);

        await page.click('#isFemale');

        await page.type('input[type=email].register-box__input.input-box', USER_EMAIL);

        await page.waitFor(1000);
        await page.type('input[type=password].register-box__input.input-box.margin-bottom-20', USER_PASS);

        await page.click('button[name="register-button"]');

        // await page.waitForNavigation(); 
        await page.waitFor(5000);

        await page.goto(LMS_URL + '/user/question'); await page.waitFor(3000);
        
        // 1-5 : Select radios 5 options each
        for(let i = 0; i < 5; i++) {
            await page.evaluate(selector => {
                const radios = Array.from(document.querySelectorAll(selector));
                radios.map(r => r.click());

            }, 'input.custom-radio');
            
            await page.click('button.test-question__btn-submit'); await page.waitFor(QUESTION_WAIT);
            
            console.log('Complete Question: ' + (i + 1));
        }

        // 6: select house
        await page.waitFor(QUESTION_WAIT * 2);
        await page.click('.test-question__fun-answer:first-child'); 
        await page.click('button.test-question__btn-submit'); await page.waitFor(QUESTION_WAIT);

        // 7: type textarea
        await page.type('textarea.form-control', 'blah blah blah blah xxx handsome cool sexy whatever');
        await page.click('button.test-question__btn-submit'); await page.waitFor(QUESTION_WAIT);

        // middle 26%
        await page.click('button.btn.btn-red'); await page.waitFor(QUESTION_WAIT);

        // 8-31: radios
        for(let i = 8; i < 32; i++) {
            await page.evaluate(selector => {
                const radios = Array.from(document.querySelectorAll(selector));
                radios.map(r => r.click());

            }, 'input.custom-radio');

            await page.click('button.test-question__btn-submit'); await page.waitFor(QUESTION_WAIT);

            console.log('Complete Question: ' + i);
        }

        // 32:
        await page.waitFor(QUESTION_WAIT * 2);
        await page.click('.test-question__fun-answer:first-child');
        await page.click('button.test-question__btn-submit'); await page.waitFor(QUESTION_WAIT);
        console.log('Complete Question: 32');


        // middle 75%
        await page.click('button.btn.btn-red'); await page.waitFor(QUESTION_WAIT);

        // 33-41
        for(let i = 33; i < 42; i++) {
            await page.click('.test-question__item.test-question__item--profile');
            await page.click('button.test-question__btn-submit:first-child'); await page.waitFor(QUESTION_WAIT);
            console.log('Complete Question: ' + i);
        }


        // Final check last url    
        await page.waitFor(3000);
        console.log('Current URL: ' + page.url());

        // DONE
        console.log('DONE....login using this account');
        console.log('Email    : ' + USER_EMAIL);
        console.log('Password : ' + USER_PASS);


        await browser.close();
    } catch (e) {
        await browser.close();
    }
})();

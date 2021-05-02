const db = require('../db');
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const config = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class {
    constructor() {
        this.initDate = new Date();
        this.isRunning = false;
        console.log('TestRunner Init', this.initDate);
    }
    async start() {
        if(this.isRunning) {
            return false;
        }
        this.isRunning = true;
        console.log('TestRunner Start', this.initDate);

        let nextTest;
        let nextTestResponse;

        while(true) {
            nextTestResponse = await db.getNextTest();
            if(nextTestResponse.length === 0) {
                break;
            }

            nextTest = nextTestResponse[0];

            const report = await this.generate(nextTest.url);
            const currentDate = new Date();
            const reportBasePath = `/usr/share/reports/`;
            const reportSubPath = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}/`;
            const reportFileName = `report.${nextTest.id}`;

            if (!fs.existsSync(`${reportBasePath}${reportSubPath}`)){
                await mkdirp(`${reportBasePath}${reportSubPath}`);
            }
            // nextTest.filepath = `${reportSubPath}${reportFileName}`;
            // await db.setReportGenerated(nextTest.id, currentDate);

            //Write report html to the file
            fs.writeFile(`${reportBasePath}${reportSubPath}${reportFileName}.html`, report.html, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            //Write report json to the file
            fs.writeFile(`${reportBasePath}${reportSubPath}${reportFileName}.json`, report.json, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            await db.setReportGenerated(nextTest.id, currentDate);
        }

        
        this.isRunning = false;
        return true;
    }
    async generate(url) {

        if(!url) return;
        console.log('Generate Report start', url);

        const opts = {
            logLevel: 'info',
            output: 'json',
            disableDeviceEmulation: true,
            defaultViewport: {
                width: 1200,
                height: 900
            },
            chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--max-wait-for-fcp=4500'],
        };

        // Launch chrome using chrome-launcher
        const chrome = await chromeLauncher.launch(opts);
        opts.port = chrome.port;

        // Connect to it using puppeteer.connect().
        const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
        const {webSocketDebuggerUrl} = JSON.parse(resp.body);
        const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});


        //Puppeteer
        const page = (await browser.pages())[0];
        await page.setViewport({ width: 1600, height: 1200});
        await page.goto(url);

         // await page.goto(loginURL, {waitUntil: 'networkidle2'});
        // await page.type('[id="login-username"]', 'usernature@yopmail.com');
        // await page.type('[id="login-password"]', 'password1234');
        // await page.evaluate(() => {
        //     document.querySelector('[id="login-submit"]').click();
        // });

        // await page.waitForNavigation();

        console.log(page.url());

        // Run Lighthouse.
        const report = await lighthouse(page.url(), opts, config).then(results => {
            return results;
        });
        const html = reportGenerator.generateReport(report.lhr, 'html');
        const json = reportGenerator.generateReport(report.lhr, 'json');
    
        await browser.disconnect();
        await chrome.kill();

        console.log('Generate Report end', url);
        return { html, json };
    }
}
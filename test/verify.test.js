const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the relative class', () => {
  it('should have a relative position', async () => {
    const position = await page.$eval('div[class="relative"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('position');
    });
    
    expect(position).toBe('relative');
  });
});

describe('the fixed class', () => {
  it('should have a fixed position', async () => {
    const position = await page.$eval('div[class="fixed"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('position');
    });
    
    expect(position).toBe('fixed');
  });
});

describe('the absolute class', () => {
  it('should have an absolute position', async () => {
    const position = await page.$eval('div[class="absolute"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('position');
    });
      
    expect(position).toBe('absolute');
  });
});


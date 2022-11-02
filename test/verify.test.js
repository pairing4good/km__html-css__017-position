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

describe('the absolute-units div', () => {
    it('should have an absolute margin value in pixels', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/#absolute-units.*{[\s\S][^}]*margin:.*px;/g).length;
      });
      expect(variableDefinitionCount).toEqual(1);
    });
    
    it('should have an absolute padding value in pixels', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/#absolute-units.*{[\s\S][^}]*padding:.*px;[\s\S]*#relative-units/g).length;
      });
      expect(variableDefinitionCount).toEqual(1);
    });
});

describe('the relative-units div', () => {
    it('should have margin values relative to the font-size of the element', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/#relative-units.*{[\s\S][^}]*margin:.*em;/g).length;
      });
      expect(variableDefinitionCount).toEqual(1);
    });
    
    it('should have padding values relative to the font-size of the element', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/#relative-units.*{[\s\S][^}]*padding:.*em;/g).length;
      });
      expect(variableDefinitionCount).toEqual(1);
    });
});


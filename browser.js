const pupperteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    browser = await pupperteer.launch({
      headless: false,
      args: ["--disable-setuid-sanbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.log("khong tao duoc browser " + error);
  }
  return browser;
};

module.exports = startBrowser;

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 80;
      var timer = setInterval(() => {
        //var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= 1000) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
}

const scraper_ProductCard = (browser, url) =>
  new Promise(async (res, reject) => {
    try {
      let newPage = await browser.newPage();
      await newPage.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
      await newPage.goto(url);
      console.log("vao " + url);

      await autoScroll(newPage);

      const productCard = await newPage.$$eval(
        ".ProductList__NewWrapper-sc-1dl80l2-0.jXFjHV > div",
        (els) => {
          productCard = els.map((el) => {
            let card = el.querySelector("div div a span");

            return {
              html: card?.innerHTML,
              href: el.querySelector("div div a").href,
            };
          });
          return productCard;
        }
      );

      await newPage.close();
      res(productCard);
    } catch (error) {
      console.log("loi o scraper product card " + error);
    }
  });

module.exports = scraper_ProductCard;

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 70;
      var timer = setInterval(() => {
        //var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= 2000) {
          clearInterval(timer);
          resolve();
        }
      }, 230);
    });
  });
}

const scraper_Product = (browser, url) =>
  new Promise(async (res, reject) => {
    try {
      let newPage = await browser.newPage();
      await newPage.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
      await newPage.goto(url);
      await newPage.setViewport({ width: 1080, height: 1024 });

      //console.log("vao " + url);
      await autoScroll(newPage);

      const imgs = await newPage.$$eval(
        ".style__StyledSimpleSlider-sc-7g2lnm-0.fmoWAu.children-slider > .content > span > a",
        (els) => {
          imgs = els.map((el) => {
            let img = el.querySelector("picture img").src;

            return img;
          });
          return imgs;
        }
      );

      const highlight = await newPage.$$eval(
        ".HighlightInfo__HighlightInfoContentStyled-sc-1u2vfmk-0",
        (els) => {
          highlight = els.map((el) => {
            let text = el.innerText;

            return text;
          });
          if (highlight.length !== 0) return highlight;
          return null;
        }
      );

      const brand_author = await newPage.$eval(
        ".BrandAuthor__BrandStyled-sc-95xwa5-0.kxHklt",
        (el) => {
          if (el.querySelector(".brand-and-author.no-after"))
            return el.querySelector(".brand-and-author.no-after h6 a")
              .innerText;
          return null;
        }
      );

      let others = await newPage.$eval(
        ".styles__BodyContainerStyled-sc-w4gwmz-0.coqMVo",
        (el) => {
          let other = el.querySelector(
            ".styles__ProductOptionsWrapper-sc-18rzur4-0.jZCObm"
          );
          if (other) {
            let rs = other.querySelectorAll(
              ".styles__OptionListWrapper-sc-1pikfxx-2.jgDdBJ .styles__OptionButton-sc-1ts19ms-0.iuHuWV"
            );
            let arr = [];
            for (let i = 0; i < rs.length; i++) {
              arr.push({
                title: rs[i].querySelector("span")?.innerText,
                img: rs[i].querySelector("span img")?.src,
              });
            }
            return arr;
          }
          return null;
        }
      );

      const disciption = await newPage.$eval(
        ".style__Wrapper-sc-13sel60-0.dGqjau.content",
        (el) => {
          let content = el.querySelector("div div").innerHTML;
          return content;
        }
      );

      await newPage.close();
      res({
        imgs: imgs,
        highlight: highlight,
        brand_author: brand_author,
        others: others,
        disciption: disciption,
      });
    } catch (error) {
      console.log("loi o scraper product " + error);
    }
  });

module.exports = scraper_Product;

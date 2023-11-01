const scraper_Category = (browser, url) =>
  new Promise(async (res, reject) => {
    try {
      let newPage = await browser.newPage();
      await newPage.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
      await newPage.goto(url);
      console.log("vao " + url);
      await newPage.setViewport({width: 1080, height: 1024});


      await newPage.waitForSelector(
        ".styles__StyledSideBar-sc-s7dkhn-0.jZosWU"
      );

      const categorys = await newPage.$$eval(
        ".styles__StyledSideBar-sc-s7dkhn-0.jZosWU > .styles__StyledListItem-sc-w7gnxl-0.cjqkgR > a",
        (els) => {
          categorys = els.map((el) => {
            let href = el.href;
            let title = el.title;
            let img = el
              .querySelector(
                ".styles__StyledIcon-sc-oho8ay-1 picture img"
              )
              .getAttribute("srcset");
            return {
              href: href,
              title: title,
              img: img,
            };
          });
          return categorys;
        }
      );

      //await newPage.close();
      res(categorys);
    } catch (error) {
      console.log("loi o scraper category " + error);
    }
  });

module.exports = scraper_Category;

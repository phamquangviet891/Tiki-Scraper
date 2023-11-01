let data = require("./data/index.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const scraper = require("./scraper/index");
const fs = require("fs");

const scraperController_ProductCard = async (browserInstance) => {
  try {
    let browser = await browserInstance;
    let category = data.category;
    let rs = [];
    for (let j = 0; j < 1; j++) {
      let url = category[j].href;
      let productCard = await scraper.scraper_ProductCard(browser, url);
      for (let i = 0; i < productCard.length; i++) {
        console.log("vao product " + [i + 1]);
        let dom = new JSDOM(productCard[i].html);
        let img = dom.window.document
          .querySelector(".image-wrapper picture source")
          ?.getAttribute("srcset");

        let title = dom.window.document.querySelector(
          ".style__StyledNameProduction-sc-7xd6qw-4.dDfbLj .name h3"
        );

        let sold = dom.window.document.querySelector(".quantity.has-border")
          ? dom.window.document.querySelector(".quantity.has-border").innerHTML
          : null;
        let price_discount = dom.window.document.querySelector(
          ".price-discount__price"
        )?.innerHTML;
        let discount = dom.window.document.querySelector(
          ".price-discount__discount"
        )
          ? dom.window.document.querySelector(".price-discount__discount")
              .innerHTML
          : null;
        if (discount)
          discount = discount.slice(9, discount.lastIndexOf("<!-- -->%")) + "%";

        if (img) {
          let { imgs, highlight, brand_author, disciption, others } =
            await scraper.scraper_Product(browser, productCard[i].href);

          if (brand_author)
            rs.push({
              img: img.slice(0, img.indexOf(" 1x")),
              title: title.innerHTML,
              sold: sold,
              price_discount: price_discount.slice(
                0,
                price_discount.indexOf("<sup>₫")
              ),
              discount: discount,
              imgs: imgs,
              highlight: highlight,
              brand_author: brand_author,
              disciption: disciption,
              others: others,
            });
        }
      }
    }

    await browser.close();

    return rs;
  } catch (error) {
    console.log("loi o scapercontroller " + error);
  }
};

const scraperController_Category = async (browserInstance, url) => {
  try {
    let browser = await browserInstance;

    let categorys = await scraper.scraper_Category(browser, url);

    //   for (let i = 0; i < blogs.length; i++) {
    //     let { href, img, title, author, content_trailer } = blogs[i];
    //     let url_ = href;
    //     let { content } = await scraper.scraper_Blog(browser, url_);
    //     data = [
    //       ...data,
    //       {
    //         href: href,
    //         img: img,
    //         title: title,
    //         author: author,
    //         content_trailer: content_trailer,
    //         content: content,
    //       },
    //     ];
    //   }

    //await browser.close();

    // // Lấy dữ liệu trong file json ra
    // let file =
    //   fs.readFileSync("filter.json").byteLength === 0
    //     ? []
    //     : JSON.parse(fs.readFileSync("filter.json"));

    // //// push cái list manga mới đào về đc vô
    // file.push(data);
    // //// ghi vô file lại
    // fs.writeFileSync("filter.json", JSON.stringify(data), (err) => {
    //   if (err) console.log("Đào data thất bại " + genre);
    //   else console.log("Đào data thành công " + genre);
    // });

    return categorys;
  } catch (error) {
    console.log("loi o scapercontroller category " + error);
  }
};
module.exports = {
  scraperController_ProductCard,
  scraperController_Category,
};

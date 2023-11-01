const startBrowser = require("./browser");

const express = require("express");

const controller = require("./scaperController");

const app = express();

app.use(express.json());

app.get("/category", async (req, res) => {
  const browser = startBrowser();
  const url = "https://tiki.vn/";
  const data = await controller.scraperController_Category(browser, url);
  res.status(200).json(data);
});

app.get("/product-card", async (req, res) => {
  const browser = startBrowser();
  const data = await controller.scraperController_ProductCard(browser);
  res.status(200).json(data);
});

app.listen(4000, () => {
  console.log("server listen at http://localhost:4000");
});

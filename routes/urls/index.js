import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

import Url from "../../models/Url.js";
import { validateUrl } from "../../utils/index.js";

dotenv.config({ path: "../../config/.env" });

const router = express.Router();

// Short URL Generator
router.post("/short", async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;
  const port = process.env.PORT;

  const urlId = nanoid();
  if (!validateUrl(origUrl))
    return res.status(400).json("Invalid Original Url");

  try {
    const oldUrl = await Url.findOne({ origUrl });
    if (oldUrl) return res.json(oldUrl);

    const shortUrl = `${base}:${port}/urls/${urlId}`;
    const url = new Url({
      origUrl,
      shortUrl,
      urlId,
      date: new Date(),
    });

    await url.save();
    return res.json(url);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// Recover url
router.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (!url) return res.status(404).json("Not found");

    await Url.updateOne(
      {
        urlId: req.params.urlId,
      },
      { $inc: { clicks: 1 } }
    );
    return res.redirect(url.origUrl);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

export default router;

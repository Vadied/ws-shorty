import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

import Url from "../models/Url.js";
import { validateUrl } from "../utils/utils.js";

dotenv.config({ path: "../config/.env" });

const router = express.Router();

// Short URL Generator
router.post("/short", async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid();
  if (!validateUrl(origUrl))
    return res.status(400).json("Invalid Original Url");

  try {
    const oldUrl = await Url.findOne({ origUrl });
    if (oldUrl) return res.json(oldUrl);

    const shortUrl = `${base}/${urlId}`;
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

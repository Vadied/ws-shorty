import express from "express";

import Url from "../models/Url.js";

const router = express.Router();

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

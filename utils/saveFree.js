import axios from "axios";
import cheerio, { load } from "cheerio";
import qs from "querystring";

/*
 * @param {string} url
 * @returns {Promise<{photo: string[], video: string[]}>}
 */
const saveFree = async (url) => {
  try {
    let json = await (
      await axios.post(
        "https://savefree.app/api/ajaxSearch",
        qs.stringify({ q: url, t: "media", lang: "en" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            Origin: "https://savefree.app/en",
            Referer: "https://savefree.app/en",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "User-Agent": "PostmanRuntime/7.31.1",
          },
        }
      )
    ).data;
    let $ = load(json.data);

    const photoElements = $("a[title='Download Photo']");
    const videoElements = $("a[title='Download Video']");


    const photo = photoElements
      .map((index, element) => $(element).attr("href"))
      .get();

    const video = videoElements
      .map((index, element) => {
        const parentDiv = $(element).closest(".download-items");
        const thumbnail = parentDiv.find("img[alt='SaveFree']").attr("src");
        const url = $(element).attr("href");
        return { thumbnail, url };
      })
      .get();

    return {
      photo,
      video,
    };
  } catch (error) {
    return {
      error: true,
      msg: error.message,
    };
  }
};

export default saveFree;

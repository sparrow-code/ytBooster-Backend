/*
 import snapsave from "./library/snapSave.js";
 
 (async () => {
     let URL = await snapsave("https://www.instagram.com/tv/CdmYaq3LAYo/");
     console.log(URL);
    })();
    */

/* import instagramGetUrl from "./library/instaSuperSaver.js";

(async () => {
  try {
    let links = await instagramGetUrl(
      "https://www.instagram.com/tv/CdmYaq3LAYo/"
    );
    console.log(links);
  } catch (error) {
    console.error("An error occurred:", error);
    console.error(error.message );
  }
})(); */


import instagramGetUrl from "instagram-url-direct";
let links = await instagramGetUrl("https://www.instagram.com/tv/CdmYaq3LAYo/")
console.log(links)
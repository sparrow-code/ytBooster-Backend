import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";
import url from "url";
import qs from "querystring";

import InstagramHelper from "../config/instaHelper.js";
import Session from "../utils/session.js";

import CookieReader from "../utils/cookieReader.js";

import CacheStorage from "../utils/cacheStorage.js";

async function authLogin(username, password, csrfToken) {
  try {
    console.log("Auth Login");
    const keyId = CacheStorage.get().get("keyId");
    const pubKey = CacheStorage.get().get("pubKey");

    const time = String(Math.floor(Date.now() / 1000)).padStart(10, "0");

    const encryptedPassword = encPassword(keyId, pubKey, password, time);
    console.log(encryptedPassword);

    const formParams = {
      username: username,
      enc_password: `#PWD_INSTAGRAM_BROWSER:10:${time}:${encryptedPassword}`,
    };

    console.log(formParams);

    /*
     ig_did=C11E3CAE-461C-425A-8B81-D37C2DB786AE;  ///
     mid=ZSrxkQALAAHt6cPsEJyLo4Jhh5d5; ///

     datr=kPEqZYtl2yb7L0yqC0iW9W_V;  ///
     ds_user_id=61382470161;
     sessionid=61382470161%3AWFaNp9RigxQW4k%3A19%3AAYc9XoNtCx6taTUd2yH63PKSt4DJpN7OnYecLjSGcg; rur="CCO\05461382470161\0541728852287:01f71b3b42cbd92754052158d0ed0dc36864051da4ff2d537af4077d9b640227e62f4a64
    */

    /*
    ig_did=E96DAE80-7A26-4364-ACF7-BE57B34EBFD5;
    mid=ZSsJGAALAAFrDgGhq6I2mVsrzPqG;
    datr=FwkrZR6n3L-AhnY0WOFG5VEq
    csrftoken=xDnoifMDHodaRBVloZaEjbn0tpDmkajM;
    */

    const requestHeaders = {
      cookie: `ig_cb=1; csrftoken=${csrfToken}; `,
      referer: InstagramHelper.BASE_URL,
      "X-Csrftoken": csrfToken,
      "user-agent": InstagramHelper.DEFAULT_USER_AGENT,
      "content-type": "application/x-www-form-urlencoded",
      "X-Ig-App-Id": InstagramHelper.X_Ig_App_Id,
    };

    const queryString = new url.URLSearchParams(formParams).toString();

    let loginResponse;
    let proxyUrl = CacheStorage.get().get("randomProxy");
    let proxyAgent = new HttpsProxyAgent(proxyUrl);

    var loginData = {};

    do {
      loginResponse = await axios.post(
        InstagramHelper.AUTH_URL,
        queryString /* formParams */,
        {
          headers: requestHeaders,
          httpsAgent: proxyAgent,
        }
      );

      console.log(loginResponse.data);

      if (loginResponse.data == null) {
        proxyUrl = CacheStorage.get().get("randomProxy");
        proxyAgent = new HttpsProxyAgent(proxyUrl);
      }
    } while (loginResponse.data == null);

    if (
      typeof loginResponse.data === "object" &&
      loginResponse.data.hasOwnProperty("authenticated") &&
      loginResponse.data["authenticated"]
    ) {
      if (loginResponse.headers.hasOwnProperty("set-cookie")) {
        // ? To Store Session of Login
        const sessionIdCookieLine = loginResponse.headers["set-cookie"].filter(
          (cookie) => cookie.includes("sessionid")
        )[0];
        if (!sessionIdCookieLine) {
          return {
            status: "fail",
            message:
              "Unable to find a sessionId in the cookies. Please try again.",
          };
        }

        const sessionId = await CookieReader.read(
          sessionIdCookieLine,
          "sessionid"
        );
        const expiryDate = await CookieReader.read(
          sessionIdCookieLine,
          "expires"
        );
        // const session = new Session(sessionId, new Date(expiryDate));
        loginData.session = new Session(sessionId, new Date(expiryDate));

        // ? To Store rur | mid | dsUserId | igId

        const cookies = ["rur", "mid", "ds_user_id", "ig_did", "csrftoken"];
        for (const cookie of cookies) {
          const cookieLine = loginResponse.headers["set-cookie"].filter(
            (line) => line.includes(cookie)
          )[0];
          const value = await CookieReader.read(cookieLine, cookie);
          loginData[cookie] = value;
        }

        return loginData;
      }
    }

    if (
      typeof loginResponse.data === "object" &&
      loginResponse.data.hasOwnProperty("error_type") &&
      loginResponse.data["error_type"] === "generic_request_error"
    ) {
      return {
        status: "fail",
        message: "Login Rate Limit Exceed",
      };
    }

    /* if (loginResponse.data.message.length > 0) {
      return {
        status: "fail",
        message: loginResponse.data.message,
      };
    } */
    return {
      status: "fail",
      message: "Unknown error, Report Support Team",
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error.hasOwnProperty("response") &&
      error.response.data.message ===
        "Please wait a few minutes before you try again."
    ) {
      return {
        status: "fail",
        message: "Too Many Error",
      };
    }

    console.log(error.message);
    console.log(error);

    return {
      status: "fail",
      message: `Unkown Error Message: ${error.message}`,
    };
  }
}

async function withoutLogin(parentCsrfToken) {
  try {
    console.log("Without Login");
    var loginData = {};
    const userName = ["sdworlld", "zeroxbit", "sam", "blurb", "nasa"];
    const randomIndex = Math.floor(Math.random() * userName.length);
    const selectRandomUser = userName[randomIndex];

    const request = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${selectRandomUser}`,
      {
        headers: {
          "user-agent": InstagramHelper.DEFAULT_USER_AGENT,
          "X-Csrftoken": parentCsrfToken,
          "X-Ig-App-Id": 936619743392459,
        },
      }
    );

    const cookies = ["mid", "ig_did", "csrftoken"];
    for (const cookie of cookies) {
      const cookieLine = request.headers["set-cookie"].filter((line) =>
        line.includes(cookie)
      )[0];
      const value = await CookieReader.read(cookieLine, cookie);
      loginData[cookie] = value;
    }

    return loginData;
  } catch (error) {
    console.log(error.message);
  }
}

export { authLogin, withoutLogin };

import axios from "axios";
import InstagramHelper from "../config/instaHelper.js";

async function sharedData() {
  const resp = await axios.get(InstagramHelper.SHARED_DATA_URL);
  const data = resp.data;

  const keyId = parseInt(data.encryption.key_id);
  const pubKey = data.encryption.public_key;
  const csrfToken = data.config.csrf_token;
  return { keyId, pubKey, csrfToken };
}

export { sharedData };

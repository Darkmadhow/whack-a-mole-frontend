import axios from "axios";

export default async function getScores(token, user) {
  try {
    let url = `${import.meta.env.VITE_BACKEND_API}/highscores`;
    if (user) url += "/" + user._id;
    const res = await axios.get(url, { headers: { Authorization: token } });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

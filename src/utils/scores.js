import axios from 'axios';

export default async function getHighscores(token, user, gamemode) {
  try {
    let url = `${import.meta.env.VITE_BACKEND_API}/highscores/mode/${gamemode}`;
    if (user) url = `${import.meta.env.VITE_BACKEND_API}/highscores/personal/${gamemode}`;
    const res = await axios.get(url, { headers: { Authorization: token } });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadHighScore(token, data) {
  try {
    let url = `${import.meta.env.VITE_BACKEND_API}/highscores`;
    const res = await axios.post(
      url,
      { score: data.score, gamemode: data.gamemode },
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

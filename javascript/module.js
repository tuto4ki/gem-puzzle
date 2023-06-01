function getTimeFormat (time) {
  let second = time % 60;
  let minutes = (time - second) / 60;
  return `${minutes < 10 ? `0${minutes}` : minutes}:${second < 10 ? `0${second}` : second}`;
}

export default getTimeFormat;
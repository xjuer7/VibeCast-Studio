import { removeAccountSettings } from "../elems/accountCard";
import { navigate } from "./navigate";

const favoriteBtn = document.getElementById("inp-favorite") as HTMLInputElement;
const tracksBtn = document.getElementById("inp-tracks") as HTMLInputElement;
const labelFavorite = favoriteBtn.parentElement as HTMLInputElement;
const labelTracks = tracksBtn.parentElement as HTMLInputElement;
const inputFilter = document.getElementById("search-inp") as HTMLInputElement;

export const handlerFavoriteInp = async () => {
  favoriteBtn.checked = true;
  tracksBtn.checked = false;
  labelFavorite.classList.add("radio-active");
  labelTracks.classList.remove("radio-active");
  inputFilter.value = "";
  removeAccountSettings();
  navigate(favoriteBtn.value);
};

export const handlerTracksInp = async () => {
  tracksBtn.checked = true;
  favoriteBtn.checked = false;
  labelTracks.classList.add("radio-active");
  labelFavorite.classList.remove("radio-active");
  inputFilter.value = "";
  removeAccountSettings();
  navigate(tracksBtn.value);
};

import { FavoriteTrack } from "../../api/Tracks";
import { showListTracks } from "./showListTrack";

const tableBody = document.getElementById('table-body') as HTMLElement;

export const HandlerFilter = (event: Event, data: FavoriteTrack[], favorite: boolean) => {
    const target = event.target as HTMLInputElement
    const searchValue = target.value.trim();
    tableBody!.innerHTML = '';

    let filteredData: FavoriteTrack[] = []

    if(!searchValue) {
        filteredData = data
    } else {
        filteredData = data.filter(track => 
        track.title.toLocaleLowerCase().includes(searchValue.toLowerCase()) ||
        track.artist.toLocaleLowerCase().includes(searchValue.toLowerCase()))
    }

    showListTracks(filteredData, favorite)
}
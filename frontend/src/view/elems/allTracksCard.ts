import { fetchTracks, getFavorites } from "../../api/Tracks";
import { showListTracks } from "../comps/showListTrack";
import { removeEmptyText } from "../comps/updateDataList";
import { HandlerFilter } from "../comps/HandlerFilter";

 const allTracksCard = async (token: string) => {
    let isFavorite = false
    const allData = await fetchTracks(token);
    await getFavorites(token);

    const table = document.querySelector('.content__table') as HTMLElement
    const headTable = document.querySelector('thead') as HTMLElement
    const inputFilter = document.getElementById('search-inp') as HTMLInputElement;

    if(document.querySelector('.text-none')) removeEmptyText(table, headTable)
    showListTracks(allData, isFavorite)
    inputFilter.addEventListener('input', (event: Event) => HandlerFilter(event, allData, isFavorite))

    return allData
}

export default allTracksCard
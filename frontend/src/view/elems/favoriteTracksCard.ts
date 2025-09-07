import { getFavorites } from "../../api/Tracks"
import { removeEmptyText, showEmptyText } from "../comps/updateDataList"
import { showListTracks } from "../comps/showListTrack"
import { HandlerFilter } from "../comps/HandlerFilter"

const favoriteTracksCard = async (token: string) => {
    let isFavorite = true
    const dataFavorites = await getFavorites(token);

    const table = document.querySelector('.content__table') as HTMLElement
    const headTable = document.querySelector('thead') as HTMLElement
    const inputFilter = document.getElementById('search-inp') as HTMLInputElement;
    const pagination = document.querySelector('.content__table__pagination') as HTMLElement;
     

    if(dataFavorites.length === 0) {
        const tableBody = document.getElementById('table-body') as HTMLElement;
        tableBody!.innerHTML = '';

        removeEmptyText(table, headTable)
        showEmptyText(table, headTable, 'Здесь пока пусто 😟')
        if(pagination) pagination.remove()
    } else {
        removeEmptyText(table, headTable)
        showListTracks(dataFavorites, isFavorite)
        inputFilter.addEventListener('input', (event: Event) => HandlerFilter(event, dataFavorites, isFavorite))
    }

    return dataFavorites
}
export default favoriteTracksCard
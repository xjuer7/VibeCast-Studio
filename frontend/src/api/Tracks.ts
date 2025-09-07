import { apiURL } from "./Users";
import { checkAuth } from "../view/comps/checkAuth";
import axios from "axios";

export type Track = {
    id: number,
    title: string,
    artist: string,
    duration: number,
    encoded_audio: string,
}

export type Tracks = Track[];

export type ApiResponse = {
    message: string,
}
export interface FavoriteTrack extends Track {
    addedAt?: string,
}

export const fetchTracks = (token: string): Promise<Tracks> => {
    return axios.get(`${apiURL}/tracks`, {
        headers: {
            'Authorization': `Bearer ${token}` ,
        }
    })
    .then((response) => {
        const data = response.data as Tracks;
        console.log(data);
        return data 
    })
    .catch((error) => {
        if(error.response) {
            alertUser()
            return error.response.data
        }
        throw error;
    })
}

export const getFavorites = (token: string): Promise<Tracks> => {
    return axios.get(`${apiURL}/favorites`, {
        headers: {
            'Authorization': `Bearer ${token}` ,
        }
    })
    .then((response) => {
        const data = response.data as Tracks;
        console.log(data);

        const storage = localStorage.getItem('user')
        const storageData = JSON.parse(storage!)
        const newDataStorage = {...storageData, favorites: data}
        localStorage.setItem('user', JSON.stringify(newDataStorage))

        const tracksWithDates:FavoriteTrack[] = data.map((favTrack:Track) => ({...favTrack, addedAt: formatDate(new Date())}))
        return tracksWithDates

    })
    .catch((error) => {
        if(error.response) {
            alertUser()
            return error.response.message
        }
        throw error;
    })
}


export const addFavorites = (token: string, id: number): Promise<ApiResponse> => {
    return axios.post(`${apiURL}/favorites`, {
        trackId: id,
    }, {
        headers: {
            'Authorization': `Bearer ${token}` ,
            "Content-Type": "application/json",
        },
    })
    .then((response: { data: ApiResponse}) => {
        return response.data; 
    })
    .catch((error: { response: ApiResponse }) => {
        console.error(error)
        return {message: 'ошибка добавления'}
    })
}

export const deleteFavorites = (token: string, id: number): Promise<ApiResponse> => {
    return axios.delete(`${apiURL}/favorites`,{
            headers: {
                'Authorization': `Bearer ${token}` ,
                "Content-Type": "application/json",
            },
            data: {
                trackId: id
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            return {message: 'ошибка удаления'}
        })
}

const formatDate = (date: Date) => {
    const daysBetween = new Date().getDate() - date.getDate();
    switch (daysBetween) {
        case 0:
            return 'сегодня'
            break;
    
        default:
            return `${daysBetween} дней назад`
            break;
    }
}

const alertUser = () => {
    localStorage.removeItem('user');
    checkAuth()
    alert('Токен устарел, необходимо обновить авторизацию')
}
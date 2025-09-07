import { el } from "redom";
import { Track } from "../../api/Tracks";

export function Player(track: Track) {
    const playerInfo = el('.player', [
        el('.player-info', [
            el('.player-img'), 
            el('.player-descr', [
                el('.player__wrap', [
                    el('span.player__title', track.title), 
                    el('button.content__table__button content__table__button--favorite#btn-favorite-player', {'data-id': track.id})]),
                el('.player__artist', track.artist)
            ]),
        ]), 
        el('.player-controls', [
            el('.player-controls__play', [
                el('button.player-btn__shuffle'),
                el('button.player-btn__prev'),  
                el('button.player-btn__play'),
                el('button.player-btn__next'),
                el('button.player-btn__repeat'),
            ]), 
            el('.player-controls__progress-bar', [
                el('span.player-controls__time-from',),
                el('.player-controls__progress-music'),
                el('.player-controls__progress-music-top'),
                el('input.player-controls__progress-inp', {type: 'range', step: '.05'}),
                el('span.player-controls__time-to', ),
            ]),
        ]),
        el('.player-controls__volume-block', [
            el('.player-controls__volume-img'),
            el('.player-controls__progress-volume'),
            el('.player-controls__progress-volume-top'),
            el('.player-controls__progress-volume-circle'),
            el('input.player-controls__progress-inp-volume', {type: 'range', step: '.05'}),
        ]),
    ])

    document.querySelector('#app-main')!.appendChild(playerInfo)
}
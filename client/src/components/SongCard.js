import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index ,ispublish} = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            console.log("double clicked");
            if(!ispublish){
                store.showEditSongModal(index, song);
            }
            
        }
    }
    let bc = "#d6c4d8"
    if(store.currentList.ispublish){
        if(store.selectedList!=null){
            if(index == store.songPlayNow&&store.currentList._id==store.selectedList._id){
                bc="yellow"
            }
        }
    }
    else{
        if(store.selectedList!=null){
            if(index == store.songPlayNow&&store.currentList._id==store.selectedList._id){
                bc="yellow"
            }
            else{
                bc = "#c8d4c8"
            }
        }
    }
    
    let removeb =""
    if(!store.currentList.ispublish){
        removeb=
        <Button
            sx={{transform:"translate(-5%, -90%)", width:"5px", height:"30px",backgroundColor:"pink"}}
            variant="contained"
            id={"remove-song-" + index}
            className="list-card-button"
            onClick={handleRemoveSong}>{"\u2715"}</Button>
    }
    
    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            style={{backgroundColor:bc}}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
            backgroundcolor="red"
        >
            <div
            id={'song-' + index + '-link'}>
                {index + 1}. {song.title} by {song.artist}
            </div>
            {removeb}
            
        </div>
    );
}

export default SongCard;
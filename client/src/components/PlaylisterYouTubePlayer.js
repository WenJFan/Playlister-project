import React from 'react';
import YouTube from 'react-youtube';
import GlobalStoreContext from '../store';
import { useContext ,useState} from 'react'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export default function YouTubePlayer() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    const { store } = useContext(GlobalStoreContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playCount, setPlayCount] = useState(0);
    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    function incSong() {
        let newIndex = (store.songPlayNow+1) % playlist.length;
        store.highLight(newIndex);
    }

    function decSong() {
        let newIndex = (store.songPlayNow-1) % playlist.length;
        if (newIndex>=0){
            store.highLight(newIndex);
        }
        
    }
    //let player
    function handlePlay() {
        setPlayCount(playCount+1);
        if(playCount==0){
            store.updateListens();
        }
        loadAndPlayCurrentSong(store.player)
    }

    function handlePause(){
        store.player.pauseVideo();
    }

    function handlePrevious(){
        decSong();
        loadAndPlayCurrentSong(store.player)
        //loadAndPlayCurrentSong(player)
    }

    function handleNext() {
        incSong();
        loadAndPlayCurrentSong(store.player)
        //loadAndPlayCurrentSong(player)     
    }

    let playlist = [];
    if(store.selectedList!=null){
        for (let i = 0; i < store.selectedList.songs.length; i++){
            playlist[i]=store.selectedList.songs[i].youTubeId;
            console.log(playlist[i])
        }
    }

    const playerOptions = {
        height: '400',
        width: '518',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        //store.highLight(store.songPlayNow);
        let song = playlist[store.songPlayNow];
        player.loadVideoById(song);
        player.playVideo();
       
        
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    

    function onPlayerReady(event) {
        store.updatePlayer(event.target);
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }
    
    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        store.updatePlayer(event.target);
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(store.player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }
    let Information = ""
    if(store.selectedList==null||store.selectedList.songs.length==0){
        Information=<Box style={{fontSize: '18pt',color:"black",paddingLeft:"40%"}}>Play Now</Box>
    }
    else{
        let song = <Box style={{fontSize: '18pt',color:"black"}}>Playlist:{store.selectedList.name}</Box>
        let songnum = <Box style={{fontSize: '18pt',color:"black"}}>Song #: {store.songPlayNow+1}</Box>
        let artist = <Box style={{fontSize: '18pt',color:"black"}}>Artist: {store.selectedList.songs[store.songPlayNow].artist}</Box>
        let title = <Box style={{fontSize: '18pt',color:"black"}}>Title:{store.selectedList.songs[store.songPlayNow].title}</Box>
        let bottons=<div><IconButton style={{left:"30%"}}>
            <SkipPreviousIcon  style={{fontSize: '36pt'}}onClick={handlePrevious}/>
            </IconButton>
            <IconButton style={{left:"30%"}}>
            <StopIcon  style={{fontSize: '36pt'}}onClick={handlePause}/>
            </IconButton>
            <IconButton style={{left:"30%"}}>
            <PlayArrowIcon  style={{fontSize: '36pt'}}onClick={handlePlay}/>
            </IconButton>
            <IconButton style={{left:"30%"}}>
            <SkipNextIcon  style={{fontSize: '36pt'}}onClick={handleNext}/>
            </IconButton></div>
    
        Information=<div>{song}{songnum}{title}{artist}
        <Box fontsize="42">{bottons}</Box></div>
    }
    return <div><YouTube
    videoId={playlist[store.songPlayNow]}
    opts={playerOptions}
    onReady={onPlayerReady}
    onStateChange={onPlayerStateChange} 
    />{Information}</div>
}
import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import YouTubePlayer from './PlaylisterYouTubePlayer.js'
import MUIDeleteModal from './MUIDeleteModal'
import AppBanner from './AppBanner'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Comment from './Comment';
import AuthContext from '../auth';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playerMode, setPlayerMode] = useState(true);
    const isMenuOpen = Boolean(anchorEl);
    const handleSortOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    function handleSortByCreation(){
        store.sortByCreation()
    }
    function handleSortByEdition(){
        store.sortByEdition()
    }
    function handleSortByName(){
        store.sortByName()
    }
    const menu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleSortByCreation}>Creation Date (Old-New)</MenuItem>
            <MenuItem onClick={handleSortByEdition}>By Last Edit Date (New-Old)</MenuItem>
            <MenuItem onClick={handleSortByName}>By Name (A-Z)</MenuItem>
        </Menu>
    );
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper'}}style={{top:'10%'}}>
            {
                store.idNamePairs.filter((pair)=>(pair.username==auth.user.firstName+" "+auth.user.lastName)).map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        ispublish={pair.ispublish}
                        publishDate={pair.publishDate}
                        likes={pair.likes}
                        dislikes={pair.dislikes}
                        listens={pair.listens}
                        Actions = {pair.Actions}
                        ownerEmail = {pair.ownerEmail}
                        username= {pair.username}
                    />
                ))
            }

            </List>;
    }
    let youTubePlayer = "";
    if (store) {
        youTubePlayer = 
            <YouTubePlayer />;
    }
    const handlePlayerMode = () =>{
        setPlayerMode(true);
    }
    function handleCommentMode(){
        setPlayerMode(false);
    }
    function handleHome(){
        store.HomeMode();
    }
    function handleAllList(){
        store.AllListMode();
    }
    function handleUser(){
        store.UserMode();
    }
    let bottons1= 
            <IconButton disabled="true" style={{color:"green"}} size='small'onClick={handleHome}><HomeIcon style={{fontSize: '24pt'}}/></IconButton>
    let bottons2=
            <IconButton style={{color:"black"}} size='small' onClick={handleAllList}><GroupsIcon style={{fontSize: '24pt'}}/></IconButton>
    let bottons3=
            <IconButton style={{color:"black"}} size='small'onClick={handleUser}><PersonIcon style={{fontSize: '24pt'}}/></IconButton>
    let bottons4=
            <IconButton size='small' onClick={handleSortOpen} style={{float:"right",color:"black"}}><SortIcon/></IconButton>
    let text1 = <Box position= "absolute" style={{transform:"translate(110%,-110%)",fontSize: '12pt'}}><input type="text" id="myText" value="Search..."/></Box>;
    let text2 = <Box style={{float:"right",fontSize: '18pt',color:"black"}}>Sort by</Box>
    
    let PlayerOrComment = ""
    if(playerMode||store.player==null){
        PlayerOrComment=<Box sx={{bgcolor:"background.paper"}} id = "player" >
        {youTubePlayer}
    </Box>
    }
    else{
        PlayerOrComment = 
                <Comment
                    userCommentPair={store.selectedList.comments}
                    listid={store.selectedList._id}
                />
    }
    let commentBottom=""
    if(store.selectedList!=null){
        if(store.selectedList.ispublish){
            commentBottom=<Button 
                disabled={!playerMode||store.selectedList==null}
                style={{color:"white", backgroundColor:"#4c5259",height:"5%"}}
                id='comment-mode'
                onClick={handleCommentMode}
                variant="contained">
                Comment
            </Button>
        }
        /*else{
            commentBottom=<Button 
                disabled={!playerMode||store.selectedList==null}
                style={{color:"white", backgroundColor:"#4c5259",display:"none"}}
                id='comment-mode'
                onClick={handleCommentMode}
                variant="contained">
                Comment
            </Button>
        }*/
    }
    return (
        
        <div id="playlist-selector">
            <Box sx={{bgcolor:"background.paper"}} id="Upper-banner"><AppBanner/></Box>
            <Box sx={{bgcolor:"background.paper"}} id="Lower-banner">{bottons1}{bottons2}{bottons3}{bottons4}{text1}{text2}{menu}</Box>
            <Box sx={{bgcolor:"background.paper"}} id="PlayerComment"> 
            <Button
                disabled={playerMode}
                id="player-mode"
                style={{color:"white", backgroundColor:"#4c5259",height:"5%"}}
                onClick={handlePlayerMode}
                variant="contained"
                >
                 Player
            </Button>
            {commentBottom}
            </Box>
                    <Box sx={{bgcolor:"background.paper"}} id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>  
                {PlayerOrComment}
            <div id="list-selector-heading">
            <Fab sx={{transform:"translate(-20%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
//****************************************************************************************************style={{display:"none"}}
            >
                <AddIcon />
            </Fab>
                Your Playlists
            </div>
        </div>
        
        )
}

export default HomeScreen;
/*let bottons= <div>
        <Box sx={{ p: 1, flexGrow: 1}}style={{transform:"translate(0%,0%)"}}>
            <IconButton size='small'><HomeIcon/></IconButton>
        </Box>
        <Box sx={{ p: 1, flexGrow: 1}}style={{transform:"translate(10%,0%)"}}>
            <IconButton size='small'><GroupsIcon/></IconButton>
        </Box>
        <Box sx={{ p: 1, flexGrow: 1}}style={{transform:"translate(20%,0%)"}}>
            <IconButton size='small'><PersonIcon/></IconButton>
        </Box>
    </div>
    
    return (
        
        <div id="playlist-selector">
            <Box sx={{bgcolor:"background.paper"}} id="Upper-banner"><AppBanner/></Box>
            <Box sx={{bgcolor:"background.paper"}} id="Lower-banner">{bottons}</Box>*/
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import WorkspaceScreen from './WorkspaceScreen';
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import List from '@mui/material/List';
import AppBanner from './AppBanner.js';
import EditToolbar from './EditToolbar';
import {Collapse} from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [expandActive, setExpandActive] = useState(false);
    const { idNamePair, selected, ispublish, publishDate, likes, dislikes, listens, Actions,ownerEmail,username} = props;
    
    let canlike = ""
    if(Actions.filter((useremail) => useremail==ownerEmail).length==0){
        canlike = true;
    }
    else{
        canlike = false;
    }

    function handleExpandList(event, id){
        event.stopPropagation();
        console.log("handleExpandList for " + id);
        if(store.currentList==null||store.currentList._id != idNamePair._id){
            store.expandPlayList(id);
            setExpandActive(true);
        }
        else{
            store.unexpandPlayList();
            setExpandActive(false);
        }
        
    }
    
    function handleSelectList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);
                store.selectPlayList(id);
            console.log("load " + event.target.id);
        }
    }
    function handleLikeList(event, id){
        event.stopPropagation();
        store.likeAList(id)
        
    }
    function handleDislikeList(event, id){
        event.stopPropagation();
        store.dislikeAList(id)
    }
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleClick(event){
        if(event.detail === 1){
            handleSelectList(event, idNamePair._id)
        }
        else if (event.detail === 2) {
            handleToggleEdit(event);
            
        }
        
        
    }
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    let songcard ="";
    if (store.currentList == null){
        songcard = null;
    }
    else if(store.currentList._id == idNamePair._id){
        let editToolbar = <EditToolbar 
                        idNamePair={idNamePair}
                        ownerEmail = {ownerEmail}
                        ispublish={idNamePair.ispublish}
                        />;
        songcard =
        <Box>
        <List 
        id="playlist-cards" 
        sx={{width: '100%', bgcolor: '#8000F00F'}}
        >
        {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                    ispublish = {ispublish}
                />
            ))  
        }
        </List>   
        <Box sx={{ flexGrow: 1,width: '100%', bgcolor: '#8000F00F'}}style={{paddingBottom:'10%'}}>{editToolbar}</Box>         
        { modalJSX }
        </Box>;
    }
    let publishInform ="";
    if(ispublish){
        publishInform = <div sx={{ p: 1, flexGrow: 1}} style={{ fontSize: '12pt', paddingBottom:'0%'}}>Published: {publishDate}</div>
    }
    let likeInform="";
    if(ispublish){
        likeInform=<div sx={{ p: 1, flexGrow: 1}}style={{fontSize: '12pt'}}>
            <IconButton disabled = {!canlike||!auth.loggedIn} size='small' onClick={(event) => {
                handleLikeList(event, idNamePair._id)
            }}><ThumbUpOffAltIcon/></IconButton>
            :{likes}
            </div>
    }
    let dislikeInform="";
    if(ispublish){
        dislikeInform=<div sx={{ p: 1, flexGrow: 1}}style={{fontSize: '12pt'}}>
            <IconButton disabled = {!canlike||!auth.loggedIn} size='small' onClick={(event) => {
                handleDislikeList(event, idNamePair._id)
            }} ><ThumbDownOffAltIcon/></IconButton>
            :{dislikes}
            </div>
    }
    let listensInform="";
    if(ispublish){
        listensInform=<div sx={{ p: 1, flexGrow: 1}}style={{fontSize: '12pt'}}>Listens:{listens}</div>
    }
    let bc = "#d6c4d8"
    if(ispublish){
        if(store.selectedList!=null){
            if(store.selectedList._id==idNamePair._id){
                bc="yellow"
            }
        }
    }
    else{
        bc = "#c8d4c8"
    }
    
    
    let cardElement =
        <Box style={{backgroundcolor:"pink"}}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"25px", p: "1px", bgcolor: '#8000F00F', marginTop: '1px', display: 'flex', p: 1,height:'50%'}}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '24pt', paddingBottom: '10%',backgroundColor:bc }}
            
            button
            onClick={(event) => {
                handleClick(event)
            }}
        >
            
            <div height={10}   sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</div>
            <Box style={{position:"absolute",fontSize: '12pt',width:"100px"}} height={10} width ={10} justifyContent="center"
      alignItems="center" sx={{ p: 1, flexGrow: 1,mt:8,mr:2}}>by {username}
            </Box>
            <Box style={{position:"absolute",fontSize: '12pt',width:"200px"}} height={10} width ={10} justifyContent="center"
      alignItems="center" sx={{ p: 1, flexGrow: 1,mt:15,mr:2}}>{publishInform}
            </Box>
            <Box style={{position:"absolute",fontSize: '12pt',width:"100px"}} height={10} width ={10} justifyContent="center"
      alignItems="center" sx={{ p: 1, flexGrow: 1,ml:50}}>{likeInform}
            </Box>
            <Box style={{position:"absolute",fontSize: '12pt',width:"100px"}} height={10} width ={10} justifyContent="center"
      alignItems="center" sx={{ p: 1, flexGrow: 1,ml:60}}>{dislikeInform}
            </Box>
            <Box style={{position:"absolute",fontSize: '12pt',width:"100px"}} height={10} width ={10} justifyContent="center"
      alignItems="center" sx={{ p: 1, flexGrow: 1,mt:15,ml:60}}>{listensInform}
            </Box>
            
            
            
            
            
        </ListItem>
        <IconButton
                            size="small"
                            edge="end"
                            style={{transform:"translate(1700%,-150%)"}}
                            onClick={(event) => {
                                handleExpandList(event, idNamePair._id)
                            }}
                        >
                           {expandActive?<KeyboardDoubleArrowUpIcon/>:<KeyboardDoubleArrowDownIcon/>}
                        </IconButton>
            
        
        <Collapse in = {expandActive} unmountOnExit>
        <div class = "expandform">
        {songcard}
        </div>
        </Collapse>
        
        </Box>        
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;

/*<Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>*/
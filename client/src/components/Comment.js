import React from 'react';
import GlobalStoreContext from '../store';
import Box from '@mui/material/Box';
import { useContext, useState } from 'react'
import ListItem from '@mui/material/ListItem';
export default function Comment(props) {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");
    const {userCommentPair,listid} = props;
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.comment(listid, text);
            setText("")
            event.target.value=""
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    let comments = "";
    if(userCommentPair.length!=0){
        comments = userCommentPair.map((pair) => (
            <ListItem
            
            sx={{borderRadius:"25px", p: "1px", bgcolor: '#8000F00F', marginTop: '1px', display: 'flex', p: 1,height:'50%' }}
            style={{transform:"translate(1%,0%)",   fontSize: '24pt', paddingBottom: '10%'}}
        >
            <Box sx={{ p: 1, flexGrow: 1}}>
                <div style={{fontSize: '10pt',paddingBottom: '1%'}}>{pair.username}</div>
                <div style={{fontSize: '12pt'}}>{pair.comment}</div></Box>
            
        </ListItem>
        ))
    }
    return(
        <div>
            <div id = "comment">
        {comments}
        
        </div>
        <div id = "commentPlace">
            <input type = "text" placeholder = "AddComment" onKeyPress={handleKeyPress}
                onChange={handleUpdateText}></input>
        </div>
        </div>
        
    );
}
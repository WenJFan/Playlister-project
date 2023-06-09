import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AuthContext from '../auth';


/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    const {idNamePair, ispublish, ownerEmail} = props;
    const { auth } = useContext(AuthContext);
    async function handleDeleteList(id) {
        store.markListForDeletion(id);
    }

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleDuplicate(event,id) {
        event.stopPropagation();
        store.Duplicate(id);
    }
    function handlePublish() {
        store.publishCurrentList();
    }
    let add =""
    if(!ispublish){
        add=<Button
        disabled={!store.canAddNewSong()}
        id='add-song-button'
        onClick={handleAddNewSong}
        variant="contained">
         Add
    </Button>
    }
    let undo =""
    if(!ispublish){
        undo=<Button 
        disabled={!store.canUndo()}
        id='undo-button'
        onClick={handleUndo}
        variant="contained">
        Undo
    </Button>
    }
    let redo =""
    if(!ispublish){
        redo=<Button 
        disabled={!store.canRedo()}
        id='redo-button'
        onClick={handleRedo}
        variant="contained">
        Redo
    </Button>
    }
    let pub =""
    if(!ispublish){
        pub=<Button 
        disabled={ispublish}
        id='close-button'
        onClick={handlePublish}
        variant="contained">
        Publish
    </Button>
    }
    let del =""
    if(ispublish&&auth.loggedIn){
        if(auth.user.email==ownerEmail){
            del=<Button 
                
        id='close-button'
        onClick={() => {
            handleDeleteList(idNamePair._id)
        }}
        variant="contained">
        Delete List
    </Button>
        }
    }
    else if(!ispublish&&auth.loggedIn){
        del=<Button 
                
        id='close-button'
        onClick={() => {
            handleDeleteList(idNamePair._id)
        }}
        variant="contained">
        Delete List
    </Button>
    }
    let dup =""
    if(ispublish&&auth.loggedIn){
        
            dup=<Button 
        id='close-button'
        onClick={(event) => {
            handleDuplicate(event,idNamePair._id)
        }}
        variant="contained">
        Duplicate
    </Button>
        
    }
    else if(!ispublish&&auth.loggedIn){
        dup=<Button 
        disabled={!store.canClose()}
        id='close-button'
        onClick={(event) => {
            handleDuplicate(event,idNamePair._id)
        }}
        variant="contained">
        Duplicate
    </Button>
    }

    return (
        <div id="edit-toolbar">
            {add}{undo}{redo}{pub}{del}{dup}
        </div>
    )
}

export default EditToolbar;
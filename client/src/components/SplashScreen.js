import { Link } from 'react-router-dom'
import { useContext, useState } from 'react';
import AuthContext from '../auth';
export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const handleGuestButton = () =>{
        auth.loggedIn=false
    }
    return (
        <div id="splash-screen">
            Playlister
            <div id ="description">
            The Playlister App is an easy and convenient casual social platform that help you share and enjoy music worldwide. Users can create, edit, and delete their own playlists as collections of songs from the YouTube. Once you are done with your playlist, you can then publish it so that you can be searched by other users. As a major part of social function, comment on playlists is definitely fun, please feel free to share your mood and talk about the songs, or you can thumb up or thumb down on a song to tell whether you like or dislike it. Now it's your music time! 
            </div>
            <div id ="generals">
            <p>Return User?</p>
            <p>New Here?</p>
            <p>Get Started Quickly?</p>
            </div>
            
            <Link to='/login/'>
                <div id="bottoms">Login</div>
            </Link>
            <br></br>
            
            <Link to='/register/'>
                <div id="bottoms">Create New Account</div>
            </Link>
            <br></br>
            
            <Link to='/all/list/'>
                <div id="bottoms" onClick = {handleGuestButton}>Log in as a guest</div>
            </Link>
            
            <div id = "credit">create by Wenjun Fan</div>
        </div>
    )
}

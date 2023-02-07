// client/src/App.js


import React from "react";
import img1 from './../../images/home_image.jpg'
import Puzzle from './../partials/game'
import About from "../partials/about";
function Home() {


  return (
  

     <div id="home">
            <div id="img-container">
               <div className="img-layer"></div>
               <img src={img1} alt=""/>
               
               <div id="home-banner" className="text-white">
               <p class="text-white">
                     Juventus and Ethereum fan?<br/>
                     Buy our products and get all the benefits of  Ether <br/>
                     Do not miss this opportunity and be the first
                  </p>
               </div>
               <div id="home-button">
                  <a href="#game-container">Click here to play!</a>
               </div>
            </div>
            <div className="spacerXL"></div>

            <Puzzle/>
            <div class="spacerXL"></div>

            <About/>
         </div>
        


  );
}

export default Home;
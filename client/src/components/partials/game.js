// client/src/App.js


import React  from "react";

function Game() {


  return (
  

    <div id="game-container" >
    <div className="spacerXL"></div>
    <div id="win-message">
       <h1>Congratulations!</h1>
       <h3>You completed the challange</h3>
    </div>
       <h1>Play and win amazing rewards!</h1>
     
       <div id="game">

       </div>

       <div id="game-btn">
          <button  id="btn-start" >Start</button>
       </div>
      
 </div>
        


  );
}

export default Game;
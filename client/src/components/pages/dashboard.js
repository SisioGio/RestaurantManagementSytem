// client/src/App.js

import React from "react";
import Tables from "../partials/tables";
import Table  from "../partials/table";

import { useState } from "react";



function Dashboard() {
      
  
   const[table,setTable] = useState(null)
  
   


   React.useEffect(() => {
  
     }, [table]);
  return (
  
   <div id='dashboard'>
     
         <Tables updateData={setTable}/>

        

   {table ? (
      <Table table={table} />
     
   ):
(
   <h5>You must select a table first</h5>
)} 

  
   </div>



  );
}

export default Dashboard;
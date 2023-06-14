const inventoryNotification = (inventories) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Inventory Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
        }
        h1 {
          color: #333333;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          color: #333333;
        }
        thead{
          background: #82add3;
        }
        th, td {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        .im {
            color: #333333!important;
        }

        
      </style>
    </head>
    <body>
      <h1>Inventory Notification</h1>
      <p>Dear,</p>
      <p>This is a notification regarding the inventory items that have fallen below the minimum level. Please take necessary actions to restock the following items:</p>
      
      <table>
        <thead
        >
          <tr>
          <th>#</th>
            <th>Name</th>
            <th>Unit of Measure</th>
            <th>Current Quantity</th>
            <th>Notify At</th>
          </tr>
        </thead>
        <tbody>
         
        ${inventories.map(function (item, index) {
          return `<tr>
            <td>${index}</td>
              <td>${item.name}</td>
              <td>${item.unitOfMeasure}</td>
              <td>${item.quantity}</td>
              <td>${item.notifyAt}</td>
           
              </tr>`;
        })}
       
        </tbody>
      </table>
    
      <p>Please take the necessary steps to replenish the inventory and ensure availability.</p>
      
      <p>Best regards,<br>[Your Name]</p>
    </body>
    </html>`;
};

module.exports = inventoryNotification;

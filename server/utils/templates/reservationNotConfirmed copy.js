const reservationNotConfirmed = (reservations) => {
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
      <h1>Not Confirmed Reservations Notification</h1>
      <p>Dear,</p>
      <p>Below  reservations were not confirmed:</p>
      
      <table>
        <thead
        >
          <tr>
          <th>#</th>
            <th>Date</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
         
        ${reservations.map(function (item, index) {
          return `<tr>
            <td>${index}</td>
              <td>${item.date}</td>
              <td>${item.status}</td>
           
              </tr>`;
        })}
       
        </tbody>
      </table>
    

      <p>Best regards,<br></p>
    </body>
    </html>`;
};

module.exports = reservationNotConfirmed;

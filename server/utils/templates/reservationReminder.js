const reservationReminder = (reservation) => {
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
      <h1>Reservations Notification</h1>
      <p>Dear,</p>
      <p>This is a reminder for an upcoming reservation:</p>
      
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
         

            <td>${0}</td>
              <td>${reservation.date}</td>
              <td>${reservation.status}</td>
           
              </tr>
    
       
        </tbody>
      </table>
    

      <p>Best regards,<br></p>
    </body>
    </html>`;
};

module.exports = reservationReminder;

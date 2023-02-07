// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

import TicketNewMessage from "./ticketNewMessage";
// Shows products of a selected order
function UserTicket({ ticket, closeTicket, saveTicket }) {
  const [expand, setExpand] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(apiService.isAdmin());
  }, [ticket]);
  return (
    <div
      className={
        ticket.status.toUpperCase() === "NEW"
          ? "personal-data ticket ticket-open"
          : "personal-data ticket ticket-closed"
      }
    >
      <div className="user-data-title">
        Ticket # {ticket.id} - {ticket.subject}
      </div>
      <div className="user-order-header-data bold-text upper light-text order-title status ">
        {ticket.status}
      </div>

      <div className="user-order-header-data light-text order-title  createdAt">
        Created on {moment(ticket.createdAt).format("DD MMMM yyyy HH:mm:ss")}
      </div>

      {expand && (
        <div className="ticket-chat">
          {ticket.messages.map((message) => {
            return (
              <div
                className={
                  message.user.id === apiService.getUser().id
                    ? "ticket-message sent"
                    : "ticket-message received"
                }
              >
                <div>
                  <p>
                    {message.user.id === apiService.getUser().id
                      ? "You"
                      : isAdmin
                      ? "User"
                      : "Admin"}
                  </p>
                  <p>{message.message}</p>
                  <small>
                    {moment(message.createdAt).format("DD MMMM yyyy HH:mm:ss")}
                  </small>
                </div>
              </div>
            );
          })}
          {ticket.status.toUpperCase() === "NEW" && (
            <TicketNewMessage
              id={ticket.id}
              setExpand={setExpand}
              closeTicket={closeTicket}
              saveTicket={saveTicket}
            />
          )}
        </div>
      )}

      {!expand ? (
        <a
          className="ticket-show"
          onClick={(event) => (event.preventDefault(), setExpand(true))}
        >
          See More
        </a>
      ) : (
        <a
          className="ticket-hide"
          onClick={(event) => (event.preventDefault(), setExpand(false))}
        >
          Hide
        </a>
      )}
    </div>
  );
}

export default UserTicket;

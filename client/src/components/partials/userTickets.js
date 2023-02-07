// client/src/App.js

import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
import UserTicketForm from "./userTicketForm";
import UserTicket from "./userTicket";
// Shows products of a selected order
function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [ticketsCopy, setTicketsCopy] = useState([]);
  const dispatch = dispatchFeedbackContexts();

  const getUserTickets = async () => {
    try {
      const user = apiService.getUser();

      if (!user) {
        dispatch({
          value: true,
          message: "You must be logged in",
          type: "Error",
        });
      }
      let res = [];
      if (apiService.isAdmin()) {
        res = await apiService.getAllTickets();
      } else {
        res = await apiService.getUserTickets(user.id);
      }

      const ticketsData = res.data.sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt) && a.status > b.status
          ? -1
          : 1
      );
      console.log(ticketsData);
      setTickets(ticketsData);

      setTicketsCopy(ticketsData);
    } catch (err) {
      console.log(err);
    }
  };

  const filertTickets = (status) => {
    setTickets(
      ticketsCopy.filter((x) => x.status.toUpperCase() === status.toUpperCase())
    );
  };

  const closeTicket = async (form) => {
    try {
      let res = await apiService.closeTicket(form.id);
      getUserTickets();
    } catch (err) {
      console.log(err);
    }
  };
  const saveTicket = async (form) => {
    try {
      console.log(form);
      const user = apiService.getUser();
      if (!user) {
        dispatch({
          value: true,
          message: "You must be logged in",
          type: "Error",
        });
      }
      const formData = new FormData();
      console.log("test");

      formData.append("subject", form.subject || "");

      formData.append("message", form.message || "");
      formData.append("userId", user.id || "");
      formData.append("ticketId", form.id || "");
      let res = await apiService.addTicketMessage(formData);

      getUserTickets();
      dispatch({
        value: true,
        message: "Success, ticket created!",
        type: "Success",
      });

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserTickets();
  }, []);

  useEffect(() => {}, [tickets]);
  return (
    <div className="user-ticket">
      <UserTicketForm saveTicket={saveTicket} getUserTickets={getUserTickets} />
      <div className="status-filter">
        <a
          href="#"
          onClick={(event) => (event.preventDefault(), filertTickets("NEW"))}
        >
          Open Tickets
        </a>
        <a
          href="#"
          onClick={(event) => (event.preventDefault(), filertTickets("CLOSED"))}
        >
          Closed Tickets
        </a>
      </div>
      {tickets.map((ticket) => {
        return (
          <UserTicket
            ticket={ticket}
            closeTicket={closeTicket}
            saveTicket={saveTicket}
          />
        );
      })}
    </div>
  );
}

export default UserTickets;

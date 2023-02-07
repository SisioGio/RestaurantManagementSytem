// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
import UserTicketForm from "./userTicketForm";
// Shows products of a selected order
function TicketNewMessage(props) {
  const [form, setForm] = useState({
    message: "",
    id: props.id,
    subject: "",
  });
  function handleChange(event) {
    const { value, name } = event.target;
    console.log(value);
    setForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }
  return (
    <div className="message-new">
      <textarea
        value={form.message}
        name="message"
        onChange={handleChange}
        rows={2}
      />
      <a
        onClick={(event) => (event.preventDefault(), props.saveTicket(form))}
        className="bg-black"
      >
        SEND
      </a>
      <a
        onClick={(event) => (
          event.preventDefault(),
          props.closeTicket(form),
          props.setExpand(false)
        )}
      >
        MARK AS COMPLETE
      </a>
    </div>
  );
}

export default TicketNewMessage;

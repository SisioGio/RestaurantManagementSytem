// client/src/App.js

import React, { useEffect } from "react";

import { dispatchFeedbackContexts, showFeedbackContexts } from "./../../App";

function Feedback(props) {
  const closeFeedback = () => {
    dispatch({ value: false });
  };
  const feedback = showFeedbackContexts();
  const [showElement, setShowElement] = React.useState(true);

  const dispatch = dispatchFeedbackContexts();
  useEffect(() => {
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 7500);
  }, [feedback]);
  return (
    <div>
      <div
        onClick={closeFeedback}
        id="feedback"
        class={
          feedback.type && showElement
            ? "feedback-visible "
            : "feedback-hidden "
        }
        style={{
          backgroundColor: feedback.type === "Error" ? "#ff2b2b" : "#30c31e",
        }}
      >
        <p>{feedback.message}</p>
      </div>
    </div>
  );
}

export default Feedback;

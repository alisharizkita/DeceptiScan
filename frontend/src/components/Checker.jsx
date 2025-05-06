"use client";

import React, { useState } from "react";
import CheckerResponse from "./CheckerResponse";

const Checker = ({ predict_api, feedback_api, title, resultId }) => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedbackSubmitted(false); // Reset feedbackSubmitted state

    const response = await fetch(`/api/predict/${predict_api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setResult(data);
    // console.log(data.details[0][1]);
  };

  const handleFeedback = async (review) => {
    const response = await fetch(`/api/feedback/${feedback_api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [resultId]: result[resultId], review }),
    });

    const responseData = await response.json();

    if (response.ok) {
      setFeedbackSubmitted(true);
    } else {
      console.error("Failed to submit feedback", response.status, responseData);
    }
  };

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins mt-6 sm:mt-10">
        {`Check for ${title} text messages here!`}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-6 sm:mt-8 w-full max-w-[1000px]"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="w-full h-[250px] sm:h-[300px] md:h-[400px] bg-[#DEF4F6] rounded-[5px] mt-3 text-black px-3 py-2"
          placeholder="Paste the text message you got"
        />
        <button
          type="submit"
          className="w-full sm:w-[151px] h-[50px] text-xl bg-[#1A929A] mt-4 rounded-[5px] hover:bg-[#146267] hover:transition ease-in"
        >
          Check
        </button>
      </form>
      {result && (
        <CheckerResponse
          result={result}
          feedbackSubmitted={feedbackSubmitted}
          handleFeedback={handleFeedback}
        ></CheckerResponse>
      )}
    </div>
  );
};

export default Checker;

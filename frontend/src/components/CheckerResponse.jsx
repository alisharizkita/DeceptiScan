import React from "react";

const CheckerResponse = ({ result, feedbackSubmitted, handleFeedback }) => {
  return (
    <div className="w-full max-w-3xl flex flex-col items-start justify-center text-black mt-6">
      <div className="w-full border border-black rounded-md p-4 shadow-lg">
        <div className="text-base sm:text-lg italic">
          <h1>
            Your message has been identified as{" "}
            {result.details[0][1] > 0.5
              ? `${parseFloat((result.details[0][1] * 100).toFixed(2))}% ${
                  result.prediction
                }`
              : `${parseFloat((result.details[0][0] * 100).toFixed(2))}% ${
                  result.prediction
                }`}
            {"\u00A0"}based on our AI Analysis
          </h1>
        </div>
      </div>

      <h1 className="text-base sm:text-lg mt-4">
        Do you think that our DeceptiScan AI gave you the correct answer?
      </h1>

      <div className="flex flex-wrap gap-4 mt-4">
        {!feedbackSubmitted ? (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => handleFeedback("right")}
            >
              I think the AI is right 👍
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => handleFeedback("wrong")}
            >
              I think the AI is wrong 👎
            </button>
          </>
        ) : (
          <p>Thank you for your feedback</p>
        )}
      </div>
    </div>
  );
};

export default CheckerResponse;

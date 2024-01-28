import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const dummyData = {
  data: [
    {
      _id: "1",
      ques: "Dummy Question 1",
      options: ["Option A", "Option B", "Option C", "Option D"],
      ans: "2",
    },
    {
      _id: "2",
      ques: "Dummy Question 2",
      options: ["Option X", "Option Y", "Option Z"],
      ans: "1",
    },
    {
      ques: "हाल ही में किस राज्य के काला नुनिया चावल और कोड़ियाल साड़ियां सहित 5 उत्पादकों को भौगोलिक संकेत मिला है? ",
      options: ["ओडिशा", "मणिपुर", "बिहार", "पश्चिम बंगाल"],
      ans: "4",
    },
  ],
};

export const LiveTest = () => {
  const [liveTest, setLiveTest] = useState(dummyData);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const submissionState = sessionStorage.getItem("testSubmission");
    if (submissionState === "submitted") {
      setSubmitted(true);
    }

    // Retrieve previous input data from localStorage
    const storedInputData = localStorage.getItem("userInputData");
    if (storedInputData) {
      setSelectedAnswers(JSON.parse(storedInputData));
    }
  }, []);

  

  const handleAnswerChange = (questionIndex, selectedOptionIndex, correctOptionIndex) => {
    if (!submitted) {
      const isCorrect = selectedOptionIndex.toString() === correctOptionIndex;

      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: selectedOptionIndex,
      }));

      setFeedback((prev) => ({
        ...prev,
        [questionIndex]: isCorrect ? "correct" : "incorrect",
      }));
    }
  };

  const calculateScore = () => {
    const correctAnswers = Object.values(feedback).filter((value) => value === "correct").length;
    const totalQuestions = liveTest.data.length;
    return `${correctAnswers}/${totalQuestions}`;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    sessionStorage.setItem("testSubmission", "submitted");

    // Store user input data and score in localStorage
    localStorage.setItem("userInputData", JSON.stringify(selectedAnswers));
    localStorage.setItem("userScore", calculateScore());
  };

  const handleBackToTest = () => {
    navigate("/test");
  };

  return (
    <div className="mx-auto py-[5rem] justify-center items-center md:py-[7rem] ">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 text-center">
        <span className="flex flex-col items-center justify-center">
          <span className="mb-2">BSSC 2nd इन्टर लेवल test</span>
          <span className="text-green-500 text-sm lg:text-base">
            (27 जनवरी 2024)
          </span>
        </span>
      </h1>

      <div className="faq-container rounded-lg mt-4 w-[80%]">
        {liveTest.data.map((question, index) => (
          <div key={question._id} className="faq-question">
            <h3>
              Q{index + 1}: {question.ques}
            </h3>
            <div className="mt-4">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="radio"
                    id={`question_${index}_option_${optionIndex}`}
                    name={`question_${index}`}
                    value={optionIndex + 1}
                    onChange={() =>
                      handleAnswerChange(index, optionIndex + 1, question.ans)
                    }
                  />
                  <label
                    htmlFor={`question_${index}_option_${optionIndex}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {submitted && selectedAnswers[index] !== undefined && (
              <>
                <div
                  className={`font-bold mt-2 ${
                    feedback[index] === "correct"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback[index] === "correct"
                    ? "Correct Answer!"
                    : "Wrong Answer!"}
                  <br />
                </div>
                <p>
                  {" "}
                  Correct Answer: {question.options[question.ans - 1]}{" "}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="text-center mt-4 ">
          <button className="mx-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {submitted && (
        <div className="text-center mt-4">
          Your Score: {calculateScore()}
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleBackToTest}>
            Back to Test
          </button>
        </div>
      )}
    </div>
  );
};

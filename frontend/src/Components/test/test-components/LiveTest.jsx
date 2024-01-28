import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function LiveTest() {
  const { id } = useParams();
  const [liveTest, setLiveTest] = useState(null);
  console.log("🚀 ~ LiveTest ~ liveTest:", liveTest);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Load previously stored user input data from local storage when the component mounts
  useEffect(() => {
    const storedInputData = localStorage.getItem("userInputData");
    if (storedInputData) {
      setSelectedAnswers(JSON.parse(storedInputData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/test/${id}`
        );
        setLiveTest(response.data.data.test); // Assuming response.data is the correct data structure
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerChange = (
    questionIndex,
    selectedOptionIndex,
    correctOptionIndex
  ) => {
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

      // Save selected answers to local storage
      const updatedSelectedAnswers = {
        ...selectedAnswers,
        [questionIndex]: selectedOptionIndex,
      };

      localStorage.setItem(
        "userInputData",
        JSON.stringify(updatedSelectedAnswers)
      );
    }
  };

  const calculateScore = () => {
    const correctAnswers = Object.values(feedback).filter(
      (value) => value === "correct"
    ).length;
    const totalQuestions = liveTest.data.length;
    return `${correctAnswers}/${totalQuestions}`;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    localStorage.setItem("userScore", calculateScore());
  };

  const handleBackToTest = () => {
    // Implement navigation back to the test page if needed
  };

  if (!liveTest) return <div>Loading...</div>;

  return (
    <div className="bg-[#cccccc] ">
      <div className=" py-[5rem] justify-center items-center md:py-[7rem] md:px-[20%] ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 text-center">
          <span className="flex flex-col items-center justify-center">
            <span className="mb-2">BSSC 2nd इन्टर लेवल test</span>
            <span className="text-green-500 text-sm lg:text-base">
              (27 जनवरी 2024)
            </span>
          </span>
        </h1>
        <div className="border-[5px] px-[1rem] border-red-500 rounded-xl py-[2px]">
          {" "}
          <span className="text-green-500 font-semibold ">*Note</span>
          <br />{" "}
          <p>
            You received +{liveTest.correctmark} for each right answer, -{liveTest.negativemark}  for each
            incorrect response, and 0 for each question that was not attempted.
          </p>{" "}
          <p className="text-center font-semibold mb-[1rem] ">OR</p>
          <p>
            आपको प्रत्येक सही उत्तर के लिए +{liveTest.correctmark}, प्रत्येक गलत उत्तर के लिए -{liveTest.negativemark} और प्रत्येक उस प्रश्न के लिए 0 प्राप्त होगा जिसका प्रयास
            नहीं किया गया है।
          </p>{" "}
        </div>

        <div className=" rounded-lg mt-4 w-full ">
          {liveTest.data.map((question, index) => (
            <div
              key={question._id}
              className="bg-[#FFFFFF] border rounded-xl mb-[1rem] "
            >
              <div className=" p-4 mb-4">
                <div className="flex flex-wrap">
                  <h3 className=" md:w-[90%] ">
                    सवाल {index + 1}: {question.ques}
                  </h3>
                </div>
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mt-[1rem]">
                      <input
                        type="radio"
                        id={`question_${index}_option_${optionIndex}`} // Unique id
                        name={`question_${index}`}
                        value={optionIndex + 1}
                        onChange={() =>
                          handleAnswerChange(
                            index,
                            optionIndex + 1,
                            question.ans
                          )
                        }
                        checked={selectedAnswers[index] === optionIndex + 1}
                        disabled={submitted} // Disable input after submission
                      />
                      <label
                        htmlFor={`question_${index}_option_${optionIndex}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {submitted && (
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
            </div>
          ))}
        </div>

        {!submitted && (
          <div className="text-center mt-4 ">
            <button
              className="mx-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}

        {submitted && (
          <div className="text-center mt-4">
            Your Score: {calculateScore()}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleBackToTest}
            >
              Back to Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

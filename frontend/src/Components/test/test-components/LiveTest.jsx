import { useEffect, useState,useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function addMinutesToCurrentTime(minutes) {
  const currentTime = Date.now();
  const futureTime = currentTime + minutes * 60000;
  return futureTime;
}



// eslint-disable-next-line react/prop-types
export function LiveTest({ userData }) {
  // console.log(userData.user._id,"😎😎😎😎")
  const userid = userData.user._id;

  const { id } = useParams();
  const [liveTest, setLiveTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [patchSent, setPatchSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  // const [mainend,setMainEnd]=useState(null)
  // const [userstop,setUserStop]=useState(null)
  const [newuserData, setNewUserData]=useState(null)
  const [isConditionMet, setIsConditionMet] = useState(false);
  const [storeddata,setStoredData]= useState(null)


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
        setLiveTest(response.data.data.test);
        if (!localStorage.getItem("TotalTime")) {
          localStorage.setItem("TotalTime", response.data.data.test.testtime * 60);
          setRemainingTime(response.data.data.test.testtime * 60);
      }
        // setRemainingTime(response.data.data.test.testtime * 60);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Check if liveTest state is not null and patch request has not been sent
    const existingTest = userData.user.test;
    const access = existingTest.some((item) => {
      return item.test_id.toString() === id;
    });
    if (!access) {
    if (liveTest && !patchSent) {
      // Define the setTimeout function
      const timer = setTimeout(async () => {
        try {
          const userStopTime = addMinutesToCurrentTime(liveTest.testtime);
          
          const response = await axios.patch(
            `http://localhost:3000/api/test/user/${userid}`,
            {
              test_id: id,
              userstart: Date.now(), // Corrected to call Date.now() as a function
              userstop: userStopTime,
              isSubmit: false,
              district: localStorage.getItem("selectedDistrict"),
              phoneno: localStorage.getItem("phoneNumber"),
            }
          );
          console.log(response.data); // Log the response data if needed
          setPatchSent(true);
          // Set patchSent to true after sending the patch request
        } catch (error) {
          console.error("Error sending data:", error);
        }
      }, 3000); // Set timeout for 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts or if liveTest or patchSent change
      return () => clearTimeout(timer);
    }
  }
  }, [liveTest, patchSent, id, userid]);

  useEffect(() => {
    let timer;
    // console.log("timer runs 😀😀😀")
    // Initialize remainingTime from local storage if available
    const storedRemainingTime = localStorage.getItem("remainingTime");
    if (storedRemainingTime !== null) {
        setRemainingTime(parseInt(storedRemainingTime));
    }

    if (remainingTime !== null && remainingTime > 0) {
        timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                // Save the remaining time to local storage every second
                localStorage.setItem("remainingTime", (prevTime - 1).toString());
                return prevTime - 1;
            });
        }, 1000);
    }

    return () => {
        clearInterval(timer);
    };

}, [liveTest]); // Empty dependency array to run only on mount

 

  // Function to format time in minutes:seconds
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };



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
    const obj = selectedAnswers;
    const selectedlength = Object.keys(obj).length;
    // const selectedAnswers = Object.keys(obj).length
    // console.log("🚀 ~ calculateScore ~ obj:", selectedlength)



    const notattempt = totalQuestions - selectedlength;
    
    const correctmarks =parseFloat(correctAnswers) * parseFloat(liveTest.correctmarks);
    // console.log("corectmarks",correctmarks)
    const negativemarks =
    (parseFloat(selectedlength) - parseFloat(correctAnswers)) *
    parseFloat(-liveTest.negativemarks);
    // console.log("corectmarks",negativemarks)
    console.log("🚀 ~ calculateScore ~ negativemarks:", negativemarks)
    console.log("🚀 ~ calculateScore ~ correctmarks:", correctmarks)

    const score = correctmarks + negativemarks;
    const percentage =
      (score / (totalQuestions * parseFloat(liveTest.correctmark))) * 100;
    // return [
    //   correct: correctAnswers,
    //   score,
    //   totalQuestions,
    //   notattempt,
    //   negativemarks,
    //   percentage,
    // ]; // ******************donot delete this comment ********************
    return [correctAnswers,score,totalQuestions,notattempt,negativemarks,percentage ]
  };

  const handleSubmit = useCallback(async () => {
    const calculate = calculateScore();
    localStorage.setItem("userScore", `${calculate[0]}/${calculate[2]}`);
    const totaltime = parseInt(localStorage.getItem("TotalTime"));
    const remainingTime = parseInt(localStorage.getItem("remainingTime"));
    const submittime = totaltime - remainingTime;
    
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/test/user/${userid}`,
        {
          test_id: id,
          isSubmit: true,
          submittime: submittime,
          score: calculate[1],
          correct: calculate[0],
          notattempt: calculate[3],
          totalQuestions: calculate[2],
          negativemarks: calculate[4],
          percentage: calculate[5]
        }
        );
        const username = `${userData.user.firstname} ${userData.user.lastname}`
        const useremail = userData.user.email
        const response2 =await axios.patch(`http://localhost:3000/api/test/submit/${id}`,{
          userid:userid,
          username:username,
          useremail,
          userphone:localStorage.getItem("phoneNumber"),
          correct: calculate[0],
          submittime: submittime,
          score: calculate[1],
          notattempt: calculate[3],
          totalQuestions: calculate[2],
          negativemarks: calculate[4],
          district: localStorage.getItem("selectedDistrict"),
          percentage: calculate[5],
          isSubmit: true
        }
        )
        setStoredData(calculate)
        setSubmitted(true);

        localStorage.removeItem('userInputData');
        localStorage.removeItem('TotalTime');
        localStorage.removeItem('remainingTime');
      
        
        console.log(response.data);
        console.log(response2.data);
        console.log(calculate,"calculate");
    } catch (error) {
        console.error("Error submitting test result:", error);
    }

    // console.log(submittime, "😀😀😀");
    // send a patch request to user 
});


  //   useEffect(()=>{
  //     if(liveTest){
  //       const userStopTime = addMinutesToCurrentTime(liveTest.testtime);
        

  //       console.log("🚀 ~ useEffect ~ userstop:", userStopTime)
  //       setUserStop(userStopTime)
  //   }
  
  // },[liveTest])

  
//   useEffect(()=>{
//     if(liveTest){
 
//       console.log("🚀 ~ useEffect ~ mainend:", liveTest.mainend)
      
//       setMainEnd(liveTest.mainend)
//   }

// },[liveTest])

useEffect(() => {
  const fetchData = async () => {
    console.log("fetching start user data");
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${userid}`);
      if (response.data.data.user && response.data.data.user.test) {
        const userData = response.data.data;
        console.log("new user data", userData);

        const currenttest = userData.user.test.find((item) => item.test_id === id);
        console.log("🚀 ~ currenttest ~ currenttest:", currenttest)
        
        setNewUserData(currenttest);
        if (currenttest.userstop > Date.now()) {
         const remainingTimeInSeconds = Math.floor((currenttest.userstop - Date.now()) / 1000);
         localStorage.setItem('remainingTime', remainingTimeInSeconds);
         setRemainingTime(remainingTimeInSeconds)
       }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const timeoutId = setTimeout(fetchData, 9000);

  return () => clearTimeout(timeoutId);
}, [id, liveTest, userid]); // Dependencies here trigger the effect

useEffect(() => {
  const interval = setInterval(() => {
    console.log("running");
    // Check the condition Date.now() >= newUserData.userstop
    if (!isConditionMet && newuserData && Date.now() >= newuserData.userstop) {
      // Perform your desired action when the condition is met
      console.log('The user stop condition is met.');
      setIsConditionMet(true);
      handleSubmit();
    }
  }, 900); // Run every 900ms to check the condition

  return () => clearInterval(interval);
}, [newuserData, handleSubmit, isConditionMet]);


  useEffect(() => {
    if(liveTest){
      if ( !isConditionMet && remainingTime === 0) {
        console.log("entered")
        setIsConditionMet(true);
        handleSubmit();
      }
      
    }
    
  }, [remainingTime, liveTest, handleSubmit, isConditionMet]);

  useEffect(() => {
    
    const interval = setInterval(() => {
      console.log("running")
      // Check the condition Date.now() >= test.testtime
      if (!isConditionMet && Date.now() >= liveTest.mainend  ) {
        // Perform your desired action when the condition is met
        console.log('The condition is met.');
        setIsConditionMet(true);
        handleSubmit();
      }
    }, 900); // Run every minute (60000 milliseconds)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  
  }, [handleSubmit, isConditionMet, liveTest]); 

  


  const handleBackToTest = () => {
    // Implement navigation back to the test page if needed
  };

  if (!liveTest) return <div>Loading...</div>;


 

  return (
    <div className="bg-[#cccccc]  py-[5rem]  md:py-[7rem] px-[2rem]">
      <h1 className="border p-2rem rounded-xl border-[3px] px-[10px] w-[150px] text-center h-[30px] bg-blue-300 font-semibold fixed ">Timer: {formatTime(remainingTime)}</h1>
      <div className=" justify-center items-center md:px-[20%] ">
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
            You received +{liveTest.correctmark} for each right answer, -
            {liveTest.negativemark} for each incorrect response, and 0 for each
            question that was not attempted.
          </p>{" "}
          <p className="text-center font-semibold mb-[1rem] ">OR</p>
          <p>
            आपको प्रत्येक सही उत्तर के लिए +{liveTest.correctmark}, प्रत्येक गलत
            उत्तर के लिए -{liveTest.negativemark} और प्रत्येक उस प्रश्न के लिए 0
            प्राप्त होगा जिसका प्रयास नहीं किया गया है।
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
            <p>correct answers: {`${storeddata[0]}/${storeddata[2]}`} </p>
            <p> unattempted: {`${storeddata[3]}`} </p>
            <p>Wrong answers: {`${storeddata[2] - storeddata[0] - storeddata[3]}`}</p>
            <p> Score: {`${storeddata[1]}`} </p>
            <br/>
            <p className="font-semibold">Check your rank after result declared. </p>
            <Link to="/test">
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleBackToTest}
            >
              Back to Test
            </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

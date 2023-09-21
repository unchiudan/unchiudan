import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

import "./quiz.css";

import { Link } from "react-router-dom";
function BlogsPage() {
  const { id } = useParams();

  const [affairDetails, setAffairDetails] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  // const dataLength = affairDetails.data.length;
  // console.log(dataLength); // Output: 2

  // const [showans, setShowAns] = useState(new Array(affairDetails.data.length).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ucchi-urran-backend.vercel.app/api/currentaffairs/${id}`
        );
        setAffairDetails(response.data.data.affairs);
        // console.log("🚀 ~ file: BlogsPage.jsx:29 ~ fetchData ~ response.data.affairs:", response.data.data.affairs)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!affairDetails) {
    return <div>Loading...</div>;
  }

  const handleAnswerChange = (
    questionIndex,
    selectedOptionIndex,
    correctOptionIndex
  ) => {
    const isCorrect = selectedOptionIndex.toString() === correctOptionIndex;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOptionIndex,
    }));

    setFeedback((prev) => ({
      ...prev,
      [questionIndex]: isCorrect ? "correct" : "incorrect",
    }));
  };

  return (
    <>
      <div className=" py-[8rem] ">
        <div className=" mx-6 ">
          <h1 className="text-center font-bold text-[2rem] md:text-[2.5rem] mb-6 ">
            Current Affairs UPSC title 5
          </h1>
          <div className="md:mx-12 my-12">
            <img
              alt="meow"
              src="/Images/upsc.jpeg"
              className="w-full mx-auto rounded-lg"
            />
          </div>
          <div className="flex justify-between mt-6 ">
            <span className="text-center text-md  ">Share with Friends :</span>
            <span className="flex text-gray-400 justify-center space-x-4">
              <a className=" " href="" target="_blank" rel="noreferrer">
                <FaFacebook className="text-blue-500 w-7 h-7" />
              </a>

              <a className=" " href="" target="_blank" rel="noreferrer">
                <FaTwitter className="text-blue-400 w-7 h-7" />
              </a>

              <a className=" " href="" target="_blank" rel="noreferrer">
                <FaInstagram className="text-pink-500 w-7 h-7" />
              </a>

              <a className=" " href="" target="_blank" rel="noreferrer">
                <FaLinkedin className="text-blue-600 w-7 h-7" />
              </a>
              <a className=" " href="" target="_blank" rel="noreferrer">
                <FaWhatsapp className="text-green-500 w-7 h-7" />
              </a>
            </span>
          </div>
          <h1 className="mt-10 text-[1.3rem] font-[550] text-center">
            {affairDetails.topic}
          </h1>
          <p className="mt-4 text-justify text-lg">
            Monthly Current Affairs PDFs are now available on UnchiUdaan.in.
            Stay updated with the latest happenings in various fields such as
            politics, economy, technology, and more. Download your copy today
            and get access to a curated selection of 10 questions related to the
            current affairs of the day, exclusively on the UnchiUdaan Facebook
            Page. <br /> <br /> Stay ahead in your UPSC, SSC, Railway, BPSC
            preparations with our Monthly Current Affairs PDFs, now available on
            UnchiUdaan.in. Dive into a wealth of knowledge covering the latest
            in politics, economy, technology, and more. Download your copy now
            and gain access to a specially curated set of 10 questions, tailored
            to UPSC, SSC, Railway, and BPSC exams, exclusively on the UnchiUdaan
            Facebook Page. In addition to the freshest updates, explore an
            extensive collection of previous monthly current affairs reports,
            all conveniently accessible in the Free Download section of this
            website. Stay informed about the events that hold significance for
            your competitive exams.
            <br />
            <br />
            These PDFs mark the continuation of the Unchiudaan Monthly Current
            Affairs series, a testament to Unchi Udaan&apos;s commitment to
            providing valuable insights tailored for UPSC, SSC, Railway, and
            BPSC aspirants. To further enhance your understanding, download the
            previous month&apos;s PDF for a more comprehensive view,
            specifically designed to boost your exam preparation.
            <br />
            <br />
            Expand your horizons by exploring a diverse range of PDFs, covering
            a wide spectrum of topics relevant to UPSC, SSC, Railway, and BPSC
            exams. From insightful articles to in-depth analyses, there&apos;s
            something for every dedicated aspirant.{" "}
          </p>
          <h1 className="mt-10 text-lg font-bold text-center">
            Daily Quiz / डेली प्रश्न
          </h1>
          <div className="faq-container rounded-lg mt-4 w-[100%]">
            {affairDetails.data.map((question, index) => (
              <div key={question._id} className="faq-question">
                <h3>
                  सवाल {index + 1}: {question.ques}
                </h3>
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
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
                      />
                      <label
                        htmlFor={`question_${index}_option_${optionIndex}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedAnswers[index] !== undefined && (
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
        </div>
      </div>
      <div className="flex justify-between mt-10 ">
        <span className="text-center text-md ">Share with Friends :</span>
        <span className="flex text-gray-400 justify-center space-x-4">
          <a className=" " href="" target="_blank" rel="noreferrer">
            <FaFacebook className="text-blue-500 w-7 h-7" />
          </a>

          <a className=" " href="" target="_blank" rel="noreferrer">
            <FaTwitter className="text-blue-400 w-7 h-7" />
          </a>

          <a className=" " href="" target="_blank" rel="noreferrer">
            <FaInstagram className="text-pink-500 w-7 h-7" />
          </a>

          <a className=" " href="" target="_blank" rel="noreferrer">
            <FaLinkedin className="text-blue-600 w-7 h-7" />
          </a>
          <a className=" " href="" target="_blank" rel="noreferrer">
            <FaWhatsapp className="text-green-500 w-7 h-7" />
          </a>
        </span>
      </div>

      <div className="w-full  flex justify-between mt-8">
        <Link to="/">
          <div className="flex flex-col mx-1 justify-center space-y-2 rounded-lg md:mx-10 border-2 p-2">
            <span className="flex space-x-3 justify-center">
              <span>
                <FaArrowAltCircleLeft className="w-7 h-7" />
              </span>
              <span className="text-lg">Previous Post</span>
            </span>
            <span>UPSC Notes Note Set- 4</span>
          </div>
        </Link>
        <Link to="/">
          <div className="flex flex-col  justify-center mx-1 rounded-lg space-y-2  md:mx-10 border-2 p-2">
            <span className="flex space-x-3 justify-center">
              <span className="text-lg">Next Post</span>
              <span>
                <FaArrowAltCircleRight className="w-7 h-7" />
              </span>
            </span>
            <span>UPSC Notes Note Set- 6</span>
          </div>
        </Link>
      </div>
    </>
  );
}

export default BlogsPage;

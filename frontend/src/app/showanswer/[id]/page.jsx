"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import logo from "../../../../public/uchiudan.png";
import Image from "next/image";
import ReactPrint from "react-to-print";
import TestPatchForm from "./TestPatchForm"

export default function ShowAnswer() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  
  const ref = useRef()



  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${id}`
        );
        setTest(response.data.data.test); // Assuming the response is in JSON format and contains the question data
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [id]);

  //   console.log(test, "😀😀😀😀😀😀");
  const decodeHtmlEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  return (
    <>
      <div className="py-[6rem]">
        <div className="mt-10 text-center">
          <ReactPrint trigger={() =><button className=" transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md ">Download</button>} content={() =>ref.current} />
        </div>
        <div ref={ref} className="Answer-table lg:mx-[18%] mx-[2%]">
          {test && (
            <div>
              <div className="flex mb-[1.5rem] bg-[#ebd7d7] h-[150px] ">
                <Image
                  width={150}
                  height={150}
                  src={logo}
                  alt="unchiudaan"
                  className="w-[150px] height-[150px]"
                />
                  <span
                    className="flex items-center font-semibold text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: decodeHtmlEntities(test.name),
                    }}
                  />
              </div>
              <div className="  bg-white shadow-md pb-8 px-8 rounded-md">
                <div className="mb-[1.5rem] rounded-xl p-5">
                  <hr className="h-1 rounded-xl border-none bg-black font-bold" />
                </div>

                <ul>
                  {test.data.map((item, index) => (
                    <div key={index}>
                      <h2 className="text-xl font-semibold mb-5 mt-4">
                      {index + 1}. {item.ques}
                      </h2>

                      <ul>
                        {item.options.map((option, idx) => (
                          <li key={idx} className="mb-1">
                            <div
                              className={`mb-2 ${
                                idx === parseInt(item.ans - 1) ? "bg-green-200" : ""
                              } p-[5px] pl-[25px] rounded-xl relative`}
                            >
                              <span className="mr-2 font-bold">
                                {String.fromCharCode(65 + idx)}.
                              </span>{" "}
                             
                              {option}
                              {idx === parseInt(item.ans - 1) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 absolute top-1/2 -translate-y-1/2 right-2 text-green-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
        </div>    
        {test && <TestPatchForm details={test} />}
      </div>
    </>
  );
}

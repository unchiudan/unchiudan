
"use client"
import React, { useEffect, useState } from 'react';
import he from "he";
import Image from 'next/image';

import AdBanner from '../../AdBanner';
import { SocialMedia } from "../../components/Socialmedia/socialmedia";
import { usePathname } from 'next/navigation';
import { useGetUserQuery } from "../../redux/slices/userSlices";
import PatchDailyTest from "./PatchDailyTest";

const decodeHtmlEntities = (html) => {
  return he.decode(html);
};

async function getDailyTestId(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest/${id}`,
      { cache: 'no-store' }
    );
    const data = await response.json();

    if (data.status === "success") {
      return data.data.dailytest;
    } else {
      throw new Error("Failed to fetch Dailytest ID data");
    }
  } catch (error) {
    console.error("Error fetching DailyTest:", error);
    throw error;
  }
}

export default function DailyTestPage({ params: { id } }) {
  const { data: userData } = useGetUserQuery();
  console.log("🚀 ~ DailyTestPage ~ userData:", userData)
  let role;

  if (userData) {
    role = userData.role === "admin";
  } else {
    role = false;
  }
  const [dailytest, setDailyTest] = useState(null);

  useEffect(() => {
    const fetchDailyTest = async () => {
      try {
        const dailytestData = await getDailyTestId(id);
        setDailyTest(dailytestData);
      } catch (error) {
        console.error("Error fetching daily test:", error);
      }
    };

    fetchDailyTest();
  }, [id]);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const pageUrl = `${origin}`;
  const pageFullUrl = pageUrl + usePathname();


  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

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

  if (!dailytest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-info motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[5rem] lg:py-[7rem]">
      <div className="mx-6">
        <h1 className="text-center font-bold text-[2rem] md:text-[2.5rem] mb-6" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(dailytest.name) }}></h1>
        <div className="md:mx-12 my-1">
        <Image
              width={500}
              height={500}
              alt="logo"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/dailytests/${dailytest.photo}`}
              className="w-full mx-auto rounded-lg"
            />
        </div>
        <AdBanner data-ad-slot="1848801465" data-ad-format="auto" data-full-width-responsive="true" />
        <p className="mt-4 text-justify text-lg " dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(dailytest.description) }} />

        {dailytest.data.length > 0 && (
          <div>
            <h1 className="mt-10 text-lg font-bold text-center">
              Daily Quiz / डेली प्रश्न
            </h1>

            <div className="faq-container rounded-lg mt-4 w-[100%]">
              {dailytest.data.map((question, index) => (
                <div key={question._id} className="faq-question mb-8">
                  <h3 className="text-lg font-semibold mb-4">{`सवाल ${index + 1}: ${question.ques}`}</h3>
                  <div className="flex flex-col gap-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`question_${index}_option_${optionIndex}`}
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
                          className="text-lg cursor-pointer"
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
                      </div>
                      <p className="text-sm">
                        Correct Answer: {question.options[question.ans - 1]}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          <SocialMedia url={pageFullUrl} />
        </div>
      </div>
      {role && <PatchDailyTest details={dailytest} />}
    </div>
  );
}

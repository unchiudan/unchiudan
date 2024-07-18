"use client";
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import he from "he";

import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const iso8601ToMilliseconds = (iso8601Str) => {
  try {
    // Parse the ISO 8601 string into a Date object
    const dtObj = new Date(iso8601Str);

    // Adjust for local timezone offset
    const milliseconds = dtObj.getTime() + dtObj.getTimezoneOffset() * 60000;

    return milliseconds;
  } catch (error) {
    console.error("Invalid ISO 8601 format", error);
    return null;
  }
};

const millisecondsToIso8601 = (milliseconds) => {
  try {
    // Create a new Date object using milliseconds since the epoch
    const dtObj = new Date(milliseconds);

    // Adjust for local timezone offset
    const iso8601Str = new Date(
      dtObj.getTime() - dtObj.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    return iso8601Str;
  } catch (error) {
    console.error("Invalid milliseconds format", error);
    return null;
  }
};

const patchTest = async (testData, id) => {
  console.log(testData);
  const token = localStorage.getItem("jwt_token");
  // console.log("🚀 ~ postaffairs ~ testData:", testData);
  const name = testData.name;

  const jsonData = JSON.stringify(testData.data);

  let loadingToast;
  try {
    loadingToast = toast.loading("Posting TestData...");
    const formData = new FormData();
    formData.append("correctmarks", testData.correctmarks);
    formData.append("negativemarks", testData.negativemarks);
    formData.append("name", name);
    formData.append("data", jsonData);
    formData.append("mainend", testData.mainend);
    formData.append("mainstart", testData.mainstart);
    formData.append("testtime", testData.testtime);
    formData.append("photo", testData.photo);

    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${id}`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.dismiss(loadingToast);
    toast.success("Test posted successfully!");
  } catch (error) {
    console.error(error);
    toast.dismiss(loadingToast);
    toast.error("Error posting Test. Please try again.");
  }
};

const TestPatchForm = ({ details }) => {
  console.log(details,"details")
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    name: details.name ? he.decode(details.name) : "",
    mainstart: details.mainstart || "",
    mainend: details.mainend || "",
    correctmarks: details.correctmarks || "",
    negativemarks: details.negativemarks || "0",
    testtime: details.testtime || "",
    photo: null,
    data: details.data || [{ ques: "", options: ["", "", "", ""], ans: "" }],
  });

  const handleChange = (e, questionIndex) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };

    // Check if questionIndex is undefined (Set No field)
    if (questionIndex === undefined) {
      newFormData[name] = value;
    } else {
      newFormData.data[questionIndex][name] = value;
    }

    setFormData(newFormData);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const newFormData = { ...formData };
    newFormData.data[questionIndex].options[optionIndex] = value;

    setFormData({
      ...formData,
      data: newFormData.data,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formdata = formData.data;
    if (formData.data[0].ques === "") {
      formdata = [];
    }

    // const formopen = formData.mainstart + formData.mainend;
    const mainstart = iso8601ToMilliseconds(formData.mainstart);
    const mainend = iso8601ToMilliseconds(formData.mainend);
    const testtime = parseInt(formData.testtime);

    // console.log(formData.negativemarks,"negative marks")
    // console.log(negativemarks,"fdsfsfefewf")
    const negativemarks = parseFloat(formData.negativemarks.trim().substring(1));
    const correctmarks = parseFloat(formData.correctmarks);

    try {
      await patchTest(
        {
          name: formData.name,
          mainstart,
          mainend,
          data: formdata,
          photo: formData.photo,
          correctmarks,
          negativemarks,
          testtime,
        },
        details._id
      );
    } catch (error) {
      console.error(error);
      toast.error("Error updating Test. Please try again.");
    }
  };

  const handleMainStartChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mainstart: value,
    }));
  };

  const handleMainEndChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mainend: value,
    }));
  };

  const handleCorrectMarkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNegativeMarkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTestTimeChange = (e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      testtime: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };
  const handleEditorChange = (field, newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: newContent,
    }));
  };

  return (
    <div className="p-4  ">
      <form className="max-w-2xl mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <JoditEditor
            ref={editor}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(newContent) => handleEditorChange("name", newContent)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Test start
          </label>
          <input
            type="datetime-local"
            name="mainstart"
            value={millisecondsToIso8601(formData.mainstart)}
            onChange={handleMainStartChange}
            className="border p-2 w-full text-black"
            required
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">Test End</label>
          <input
            type="datetime-local"
            name="mainend"
            value={millisecondsToIso8601(formData.mainend)}
            onChange={handleMainEndChange}
            className="border p-2 w-full text-black"
            required
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Correct Mark
          </label>
          <input
            type="string"
            name="correctmarks"
            value={formData.correctmarks}
            onChange={handleCorrectMarkChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            Negative Mark (Eg: 0.25 *Donot write (-)sign)
          </label>
          <input
            type="string"
            name="negativemarks"
            value={formData.negativemarks}
            onChange={handleNegativeMarkChange}
            className="border p-2 w-full text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-bold">
            User Test Time
          </label>
          <select
            name="testtime"
            value={formData.testtime}
            onChange={handleTestTimeChange}
            className="border p-2 w-full text-black"
            required
          >
            <option value="2">2 minutes</option>
            <option value="3">3 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="25">25 minutes</option>
            <option value="30">30 minutes</option>
            <option value="35">35 minutes</option>
            <option value="40">40 minutes</option>
            <option value="45">45 minutes</option>
            <option value="50">50 minutes</option>
            <option value="55">55 minutes</option>
            <option value="60">60 minutes</option>
            <option value="70">70 minutes</option>
            <option value="80">80 minutes</option>
            <option value="90">90 minutes</option>
            <option value="100">100 minutes</option>
            <option value="120">120 minutes</option>
            <option value="180">180 minutes</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {formData.data.map((question, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`ques${index}`}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Question {index + 1}
            </label>
            <input
              type="text"
              id={`ques${index}`}
              name="ques"
              value={question.ques}
              onChange={(e) => handleChange(e, index)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label>Option: {optionIndex}</label>
                <input
                  type="text"
                  id={`option${index}-${optionIndex}`}
                  name="option"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index, optionIndex)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            <label
              htmlFor={`ans${index}`}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Answer {index + 1} <br />
              *please put option Number only
            </label>
            <input
              type="text"
              id={`ans${index}`}
              name="ans"
              value={question.ans}
              onChange={(e) => handleChange(e, index)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              data: [
                ...formData.data,
                { ques: "", options: ["", "", "", ""], ans: "" },
              ],
            })
          }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default TestPatchForm;

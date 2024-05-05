"use client";
/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const postaffairs = async (testData) => {
  const token = localStorage.getItem("jwt_token");
  // console.log("🚀 ~ postaffairs ~ testData:", testData);
  const name = testData.name;

  const jsonData = JSON.stringify(testData.data);

  let loadingToast;
  try {
    loadingToast = toast.loading("Posting TestData...");
    const formData = new FormData();

    formData.append("name", name);
    formData.append("data", jsonData);
    formData.append("description", testData.description);
    formData.append("photo", testData.photo);

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest`,
      formData,
      {
        headers: {
          Authorization: token,
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

const DailyTest = () => {
  const topicEditor = useRef(null);
  const descriptionEditor = useRef(null);

  const initialFormData = {
    name: "",
    description: "",
    photo: null,
    data: [{ ques: "", options: ["", "", "", ""], ans: "" }],
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleEditorChange = (field, newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: newContent,
    }));
  };

  const handleChange = (e, questionIndex) => {
    const { name, value } = e.target;
    const updatedData = [...formData.data];
    updatedData[questionIndex][name] = value;

    setFormData((prevData) => ({
      ...prevData,
      data: updatedData,
    }));
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const newFormData = [...formData.data];
    newFormData[questionIndex].options[optionIndex] = value;

    setFormData({
      ...formData,
      data: newFormData,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formdata = formData.data;
    if (formData.data[0].ques === "") {
      formdata = [];
    }

    try {
      await postaffairs({
        name: formData.name,
        data: formdata,
        photo: formData.photo,
        description: formData.description,
      });
      setFormData({ ...initialFormData });
      if (topicEditor.current) {
        topicEditor.current.value = "";
      }
      if (descriptionEditor.current) {
        descriptionEditor.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Error posting Daily test. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleRemoveQuestion = (indexToRemove) => {
    const updatedQuestions = formData.data.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({
      ...formData,
      data: updatedQuestions,
    });
  };

  return (
    <div className="mx-2 mt-8">
      <h1 className="text-center font-semibold text-3xl text-blue-400 pb-2">
        Create DailyQuiz
      </h1>
      <form className="mx-auto " onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="topic"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <JoditEditor
            ref={topicEditor}
            type="text"
            id="name"
            name="name"
            onBlur={(content) => handleEditorChange("name", content)}
            onChange={(content) => {}}
            value={formData.name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="topic"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <JoditEditor
            ref={topicEditor}
            type="text"
            id="description"
            name="description"
            onBlur={(content) => handleEditorChange("description", content)}
            onChange={(content) => {}}
            value={formData.description}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
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
            <textarea
              id={`ques${index}`}
              name="ques"
              value={question.ques}
              onChange={(e) => handleChange(e, index)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              style={{ height: "auto", minHeight: "2rem" }}
            />

            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label>Option: {optionIndex + 1}</label>
                <textarea
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
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        <span className="flex space-x-6">
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
            className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </span>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default DailyTest;

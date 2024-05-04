"use client"
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import he from "he";

import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const patchAffairs = async (dailytestData, id) => {
  const token = localStorage.getItem("jwt_token");
  const formData = new FormData();

  formData.append("name", dailytestData.name);
  formData.append("description", dailytestData.description);
  formData.append("data", JSON.stringify(dailytestData.data));
  formData.append("photo", dailytestData.photo);
 

  try {
    const loadingToast = toast.loading("Updating Daily tests...");

    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest/${id}`,
      formData,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    toast.dismiss(loadingToast);

    if (!id) {
      toast.success("Daily tests posted successfully!");
    } else {
      toast.success("Daily tests updated successfully!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error updating Daily tests. Please try again.");
  }
};

const DailyTestForm = ({ details }) => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    name: details.name ? he.decode(details.name) : "",
    description: details.description ? he.decode(details.description) : "",
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

    try {
      await patchAffairs(
        {
          name: formData.name,
          data: formData.data,
          photo: formData.photo,
          description: formData.description,
        },
        details._id
      );
      window.location.reload();


    } catch (error) {
      console.error(error);
      toast.error("Error updating Daily tests. Please try again.");
    }
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
          <label className="block mb-2 text-gray-800">Description</label>
          <JoditEditor
            ref={editor}
            name="description"
            value={formData.description}
            onChange={(newContent) =>
              handleEditorChange("description", newContent)
            }
            className="border p-2 w-full h-32"
          ></JoditEditor>
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
                <label>Option: {optionIndex+1}</label>
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

export default DailyTestForm;
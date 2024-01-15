import axios from "axios";
import { useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import JoditEditor from 'jodit-react';

const posttest = async (testsData) => {
  const token = localStorage.getItem("jwt_token");
  let loadingToast;

  try {
    loadingToast = toast.loading("Posting News...");

    const formData = new FormData();
    formData.append("name", testsData.name);
    formData.append("start", testsData.start);
    formData.append("end", testsData.end);
    formData.append("formlink", testsData.formlink);
    formData.append("photo", testsData.photo);

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/test`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );

    toast.dismiss(loadingToast);
    toast.success("Tests posted successfully!");
  } catch (error) {
    console.error(error);
    if (loadingToast) {
      toast.dismiss(loadingToast);
    }
    toast.error("Error posting tests. Please try again.");
  }
};

const FormTest = () => {
  const editorHeading = useRef(null);
  const editorArticle = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    formlink:"",
    photo: null, // Initialize as null
  });

  const handleEditorChange = (field, newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: newContent,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await posttest({
        name: formData.name,
        start: formData.start,
        end: formData.end,
        formlink:formData.formlink,
        photo: formData.photo,
      });

      // Reset form fields to their initial values after submitting
      setFormData({
        name: "",
        start: "",
        end: "",
        formlink:"",
        photo: null,
      });

      // Optionally, you can clear the JoditEditor content
      if (editorHeading.current) {
        editorHeading.current.value = "";
      }
      if (editorArticle.current) {
        editorArticle.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Error posting tests. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <JoditEditor
            ref={editorHeading}
            id="name"
            name="name"
            value={formData.name}
            onChange={(newContent) => handleEditorChange("name", newContent)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="start"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Start:
          </label>
          <JoditEditor
            ref={editorArticle}
            id="start"
            name="start"
            value={formData.start}
            onChange={(newContent) => handleEditorChange("start", newContent)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="end"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            End:
          </label>
          <JoditEditor
            ref={editorArticle}
            id="end"
            name="end"
            value={formData.end}
            onChange={(newContent) => handleEditorChange("end", newContent)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="formlink"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            FormLink:
          </label>
          <JoditEditor
            ref={editorArticle}
            id="formlink"
            name="formlink"
            value={formData.formlink}
            onChange={(newContent) => handleEditorChange("formlink", newContent)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Photo:
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default FormTest;

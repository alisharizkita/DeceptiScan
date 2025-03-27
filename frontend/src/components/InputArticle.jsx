"use client";

import { useState, useRef } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Image from "next/image";

const InputArticle = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/uploadImage.png");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImage = async (file) => {
    if (!file) return;

    // Reset previous errors
    setUploadError(null);

    // Create a local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImage(file);

    // Upload to server
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      console.log("Uploading image...", file.name);

      const response = await fetch("/api/article/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        setUploadError(`Upload failed: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.imageUrl) {
        console.log("Image uploaded successfully:", data.imageUrl);
        setImagePreview(data.imageUrl);
      } else {
        console.error("Invalid response format:", data);
        setUploadError("Invalid response from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(`Upload error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Check if file is an image
      if (file.type.startsWith("image/")) {
        await uploadImage(file);
      } else {
        setUploadError("Please upload only image files (PNG, JPG, JPEG)");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUploading) {
      alert("Please wait for the image to finish uploading.");
      return;
    }

    const formattedLink =
      link && link.trim() !== "" && link.startsWith("https:")
        ? link
        : link.trim() !== ""
        ? `https://${link}`
        : ""; // If the link is empty, use an empty string

    const newArticle = {
      photo: imagePreview !== "/uploadImage.png" ? imagePreview : "", // Don't use the default image
      title,
      text: preview,
      link: formattedLink,
    };
    console.log(newArticle);
    onSubmit(newArticle);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.85)] z-10">
      <div className="w-[62.187vw] h-[40.99vw] bg-white px-[3vw] py-[1.5vw] flex flex-col items-start justify-evenly text-black relative">
        <div>
          <h1 className="text-[#146D74] text-[2.083vw] font-bold">
            Write Your Article
          </h1>
          <p className="text-[1.25vw] mt-[0.5vw]">Add the article here</p>
          <div className="w-[56.458vw] h-[0.05vw] bg-black mt-[0.85vw]"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-[2vw]">
            <label className="text-[1.25vw]">Article's Title*</label>
            <input
              type="text"
              className="text-[1vw] w-[43.49vw] h-[2.448vw] px-[1vw] py-[0.2vw] rounded-[0.52vw] border-1 border-black ml-[2vw]"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-[2vw]">
            <label className="text-[1.25vw]">Source Link*</label>
            <input
              type="text"
              className="text-[1vw] w-[43.49vw] h-[2.448vw] px-[1vw] py-[0.2vw] rounded-[0.52vw] border-1 border-black ml-[2.3vw]"
              required
              placeholder="https://google.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="mt-[2vw] flex">
            <label className="text-[1.25vw]">Preview*</label>
            <textarea
              type="text"
              className="text-[1vw] w-[43.49vw] h-[8vw] px-[1vw] py-[0.2vw] rounded-[0.52vw] border-1 border-black ml-[4.4vw]"
              required
              placeholder="Description"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
            />
          </div>
          <div className="mt-[2vw] flex">
            <label className="text-[1.25vw]">Picture*</label>
            <div className="flex items-center justify-between ml-[3.8vw]">
              <div className="relative w-[7.708vw] h-[6.927vw]">
                <Image
                  src={imagePreview}
                  width={148}
                  height={133}
                  alt="article preview"
                  className="w-[7.708vw] h-[6.927vw] object-cover"
                  priority
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
                disabled={isUploading}
                ref={fileInputRef}
              />
              <label
                htmlFor="image-upload"
                className={`w-[35vw] h-[6.927vw] px-[1vw] py-[0.2vw] rounded-[0.52vw] border-1 border-black ml-[1.8vw] flex items-center justify-center hover:cursor-pointer ${
                  isDragging ? "bg-gray-100 border-dashed" : ""
                } ${isUploading ? "opacity-50" : ""}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  "Uploading image..."
                ) : uploadError ? (
                  <span className="text-red-500">{uploadError}</span>
                ) : (
                  <div className="text-center">
                    <span className="text-[#146D74] mr-[0.4vw] font-medium">
                      Click to upload
                    </span>
                    <span className="mr-[0.4vw]">or drag and drop</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      PNG, JPG, or JPEG
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="flex mt-[2vw] ml-[9vw]">
            <button
              type="submit"
              className="w-[7.865vw] h-[2.292vw] text-[1.25vw] bg-[#146D74] rounded-[0.26vw] text-white hover:bg-[#106167] active:bg-[#0F565B] transition ease-out-300"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-[7.865vw] h-[2.292vw] text-[1.25vw] border-1 border-black rounded-[0.26vw] ml-[1vw] bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
        <button onClick={onClose} className="absolute right-[1vw] top-[1vw]">
          <IoMdCloseCircleOutline className="text-[3vw] text-red-600 hover:text-red-700 active:text-red-800" />
        </button>
      </div>
    </div>
  );
};

export default InputArticle;

"use client";

import { useState, useRef, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Image from "next/image";

const InputArticle = ({ inputOptions, onClose, onSubmit, article }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/uploadImage.png");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [articleId, setArticleId] = useState(null);
  const fileInputRef = useRef(null);

  // Load article data when in edit mode
  useEffect(() => {
    if (inputOptions === "Edit" && article) {
      setTitle(article.title || "");
      setLink(article.link || "");
      setPreview(article.text || "");
      setImagePreview(article.photo || "/uploadImage.png");
      setArticleId(article.articleID);
    }
  }, [inputOptions, article]);

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

    const articleData = {
      photo: imagePreview !== "/uploadImage.png" ? imagePreview : "", // Don't use the default image
      title,
      text: preview,
      link: formattedLink,
    };

    // When in edit mode, also include the article ID
    if (inputOptions === "Edit" && articleId) {
      articleData.articleID = articleId;
    }

    // Pass the data to the parent component's handler
    onSubmit(articleData);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/85 px-4 py-6 overflow-auto">
      <div className="relative w-full max-w-5xl bg-white p-6 sm:p-8 rounded-lg">
        <button onClick={onClose} className="absolute right-4 top-4">
          <IoMdCloseCircleOutline className="text-3xl text-red-600 hover:text-red-700" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-[#146D74]">
          {inputOptions === "Edit" ? "Edit Your Article" : "Write Your Article"}
        </h1>
        <p className="text-sm sm:text-base mb-2 text-black">{`${inputOptions} the article here`}</p>
        <hr className="border-black mb-4" />

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Title */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Article's Title*
            </label>
            <input
              type="text"
              required
              placeholder="Title"
              className="w-full rounded-md border border-black px-4 py-2 text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Source Link*
            </label>
            <input
              type="text"
              required
              placeholder="https://example.com"
              className="w-full rounded-md border border-black px-4 py-2 text-sm sm:text-base"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Preview*
            </label>
            <textarea
              required
              placeholder="Description"
              rows={4}
              className="w-full rounded-md border border-black px-4 py-2 text-sm sm:text-base"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Picture*
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-[120px] h-[110px] sm:w-[148px] sm:h-[133px]">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded border"
                  priority
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
                ref={fileInputRef}
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={handleDrop}
                className={`flex-1 min-h-[110px] border border-black rounded-md px-4 py-4 text-center text-sm sm:text-base cursor-pointer transition ${
                  isDragging ? "bg-gray-100 border-dashed" : ""
                } ${
                  isUploading
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-gray-50"
                }`}
              >
                {isUploading ? (
                  "Uploading image..."
                ) : uploadError ? (
                  <span className="text-red-500">{uploadError}</span>
                ) : (
                  <>
                    <span className="text-[#146D74] font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                    <br />
                    <span className="text-xs text-gray-500 block mt-1">
                      PNG, JPG, or JPEG
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full sm:w-auto px-6 py-2 text-white rounded-md text-sm sm:text-base transition ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#146D74] hover:bg-[#106167] active:bg-[#0F565B]"
              }`}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base border border-black rounded-md bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArticle;

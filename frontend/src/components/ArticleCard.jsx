import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import InputArticle from "@/components/InputArticle";

const ArticleCard = ({ article, isLoggedIn, onEdit }) => {
  // const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteArticle = async () => {
    const articleId = article.articleID;
    if (!articleId) {
      alert("Cannot delete article: Missing article ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/article/delete-article", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete article");
      }

      alert("Article deleted successfully");

      // Refresh the article list
      location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert(error.message || "Failed to delete article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[46%] md:w-[30%] lg:w-[20.365vw] bg-[#DEF4F6] shadow-md rounded-xl text-black p-4 flex flex-col items-center relative">
      <div className="w-full h-40 sm:h-44 md:h-[9.219vw] rounded-xl overflow-hidden">
        <Image
          src={article.photo}
          width={1000}
          height={1000}
          alt="photo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 flex flex-col items-center text-center px-1">
        <h1 className="text-base sm:text-lg md:text-[1.25vw] font-semibold line-clamp-2">
          {article.title}
        </h1>
        <p className="text-sm sm:text-xs md:text-[0.625vw] line-clamp-2 text-justify">
          {article.text}
        </p>
        <a
          href={article.link}
          target="_blank"
          className="text-blue-600 mt-1 text-sm sm:text-xs md:text-[0.625vw]"
        >
          Read More
        </a>
      </div>

      {isLoggedIn && (
        <div className="absolute bottom-3 right-3 flex gap-3 sm:gap-2">
          <button
            onClick={() => onEdit(article)}
            className="hover:cursor-pointer"
          >
            <FaPencil className="text-green-600 text-lg sm:text-base md:text-[1.3vw]" />
          </button>
          <button
            onClick={handleDeleteArticle}
            className="hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="text-xs">...</span>
            ) : (
              <FaTrashAlt className="text-red-600 text-lg sm:text-base md:text-[1.3vw]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;

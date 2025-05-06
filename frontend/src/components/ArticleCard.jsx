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
    <div className="w-[20.365vw] h-[17.552vw] bg-[#DEF4F6] drop-shadow-md rounded-[1.042vw] text-black p-[0.7vw] flex flex-col items-center relative">
      <Image
        src={article.photo}
        width={10000}
        height={10000}
        alt="photo"
        className="w-[18.438vw] h-[9.219vw] rounded-[1.042vw]"
      />
      <div className="mt-[0.3vw] flex flex-col items-center">
        <h1 className="text-[1.25vw]">{article.title}</h1>
        <p className="text-[0.625vw] line-clamp-1 text-justify">
          {article.text}
        </p>
        <a
          href={article.link}
          target="_blank"
          className="text-blue-600 ml-[0.3vw] text-[0.625vw]"
        >
          Read More
        </a>
      </div>
      {isLoggedIn && (
        <div className="absolute bottom-[1vw] right-[1vw] flex items-center gap-x-[0.8vw]">
          <button
            onClick={() => onEdit(article)}
            className="hover:cursor-pointer"
          >
            <FaPencil className="text-green-600 text-[1.3vw]" />
          </button>
          <button
            onClick={handleDeleteArticle}
            className="hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>...</span> // Simple loading indicator
            ) : (
              <FaTrashAlt className="text-red-600 text-[1.3vw]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;

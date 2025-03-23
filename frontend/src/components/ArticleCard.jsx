import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import InputArticle from "@/components/InputArticle";

const ArticleCard = ({ article, isLoggedIn }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleDeleteArticle = () => {
    console.log("article deleted");
  };

  const handleEditArticle = () => {
    console.log("article edited");
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
      <div className="mt-[0.3vw]">
        <h1 className="text-[1.25vw]">{article.title}</h1>
        <p className="text-[0.625vw] text-justify">
          {article.text}
          <a
            href={article.link}
            target="_blank"
            className="text-blue-600 ml-[0.3vw]"
          >
            Read More
          </a>
        </p>
      </div>
      {isLoggedIn && (
        <div className="absolute bottom-[1vw] right-[1vw] flex items-center gap-x-[0.8vw]">
          <button
            onClick={() => setIsEdit(true)}
            className="hover:cursor-pointer"
          >
            <FaPencil className="text-green-600 text-[1.3vw]" />
          </button>
          <button
            onClick={handleDeleteArticle}
            className="hover:cursor-pointer"
          >
            <FaTrashAlt className="text-red-600 text-[1.3vw]" />
          </button>
        </div>
      )}
      {isEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.85)] z-50">
          <InputArticle
            onClose={() => setIsEdit(false)}
            onSubmit={handleEditArticle}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleCard;

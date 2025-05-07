"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getCookie } from "@/utils/cookies";
import { FaPlus } from "react-icons/fa6";
import InputArticle from "@/components/InputArticle";
import ArticleCard from "@/components/ArticleCard";

const Articles = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getCookie("TOKEN");
      setIsLoggedIn(!!token);
    };

    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Use our API route instead of directly calling the backend
        const response = await fetch("/api/article");

        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }

        const data = await response.json();

        // Transform backend data format to match frontend components
        const formattedArticles = data.map((article) => ({
          photo: article.imageLink || "/stock.jpg",
          title: article.title,
          text: article.summary,
          link: article.link || "#",
          articleID: article.articleID,
        }));

        setArticles(formattedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
    fetchArticles();
  }, []);

  const handleAddArticle = async (newArticle) => {
    try {
      // Get admin ID from token
      const token = await getCookie("TOKEN");

      if (!token) {
        throw new Error("User not authenticated");
      }

      // Get admin ID and ensure it's parsed as an integer
      const adminIdStr = await getCookie("ADMIN_ID");
      console.log("Admin ID from cookie:", adminIdStr); // Debug log

      // Use a default admin ID if not found in cookies
      let adminID;

      if (adminIdStr && !isNaN(parseInt(adminIdStr, 10))) {
        adminID = parseInt(adminIdStr, 10);
      } else {
        console.warn("No valid admin ID found in cookies, using default ID 1");
        adminID = 1; // Default admin ID as fallback
      }

      // Ensure an image URL is provided
      if (!newArticle.photo) {
        throw new Error("An image is required for the article");
      }

      // Prepare article data for backend
      const articleData = {
        adminID: adminID,
        title: newArticle.title,
        summary: newArticle.text,
        link: newArticle.link || "",
        imageLink: newArticle.photo,
      };

      console.log("Submitting article with data:", articleData);

      // Send JSON directly
      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add article: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      const savedArticle = await response.json();

      setArticles([
        ...articles,
        {
          photo: savedArticle.imageLink || "/stock.jpg",
          title: savedArticle.title,
          text: savedArticle.summary,
          link: savedArticle.link,
        },
      ]);

      setIsClick(false);
      location.reload(); // Refresh the page to show the new article
    } catch (err) {
      console.error("Error adding article:", err);
      alert(err.message || "Failed to add article. Please try again.");
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setIsEdit(true);
  };

  const submitEditArticle = async (updatedArticle) => {
    try {
      // Get admin ID from token
      const token = await getCookie("TOKEN");
      if (!token) {
        throw new Error("User not authenticated");
      }

      // Get admin ID from cookie
      const adminIdStr = await getCookie("ADMIN_ID");
      const adminID = adminIdStr ? parseInt(adminIdStr, 10) : 1;

      // Prepare article data for backend - match the expected field names
      const articleData = {
        adminID: adminID,
        title: updatedArticle.title,
        summary: updatedArticle.text,
        link: updatedArticle.link || "",
        imageLink: updatedArticle.photo,
        articleID: updatedArticle.articleID, // Include article ID in the body
      };

      console.log("Updating article with data:", articleData);

      // Send PUT request to update the article
      const response = await fetch("/api/article/edit-article", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        // Safely handle the error response - check if it's JSON first
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            `Failed to update article: ${response.status} - ${JSON.stringify(
              errorData
            )}`
          );
        } else {
          // For non-JSON responses (like HTML error pages)
          const errorText = await response.text();
          throw new Error(
            `Failed to update article: ${response.status} - Non-JSON response received`
          );
        }
      }

      // Close the edit modal
      setIsEdit(false);

      // Refresh the page to show the updated article
      alert("Article updated successfully");
      location.reload();
    } catch (err) {
      console.error("Error updating article:", err);
      alert(err.message || "Failed to update article. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 via-white to-white">
      <Navbar />
      <div className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            Loading articles...
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-8">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No articles found.
          </div>
        ) : (
          articles.map((article, index) => (
            <ArticleCard
              article={article}
              key={index}
              isLoggedIn={isLoggedIn}
              onEdit={handleEditArticle}
            />
          ))
        )}

        {isLoggedIn && (
          <button
            onClick={() => setIsClick(true)}
            className="w-12 h-12 md:w-[4.583vw] md:h-[4.583vw] rounded-full font-bold bg-[#1A929A] hover:bg-[#166E74] active:bg-[#124D53] transition flex items-center justify-center fixed bottom-6 right-6 md:bottom-8 md:right-8 hover:rotate-[-180deg] hover:transition hover:ease-in hover:duration-300 hover:cursor-pointer"
          >
            <FaPlus className="text-xl md:text-[3vw]" />
          </button>
        )}

        {isClick && (
          <InputArticle
            onClose={() => setIsClick(false)}
            onSubmit={handleAddArticle}
            inputOptions={"Add"}
          />
        )}

        {isEdit && editingArticle && (
          <InputArticle
            onClose={() => setIsEdit(false)}
            onSubmit={submitEditArticle}
            inputOptions={"Edit"}
            article={editingArticle}
          />
        )}
      </div>
    </div>
  );
};

export default Articles;

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request) {
  try {
    // Parse the request body as JSON
    const body = await request.json();
    const articleId = body.articleID;

    // Validate article ID
    if (!articleId) {
      return NextResponse.json(
        { message: "Article ID is required" },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!body.title || !body.summary || !body.imageLink) {
      return NextResponse.json(
        { message: "Missing required fields (title, summary, imageLink)" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("TOKEN")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Prepare the backend API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${articleId}`;
    console.log(`Updating article ${articleId} with data:`, {
      title: body.title,
      summary: body.summary,
      link: body.link,
      imageLink: body.imageLink
    });
    
    // Make the request to the backend API
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({
        adminID: body.adminID || 1, // Use provided or default
        title: body.title,
        summary: body.summary,
        link: body.link || "",
        imageLink: body.imageLink
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log("Error response:", data);
      return NextResponse.json(
        { message: data.detail || "Failed to update article" },
        { status: response.status }
      );
    }

    const updatedArticle = await response.json();
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request) {
  try {
    const { articleId } = await request.json();
    
    if (!articleId) {
      return NextResponse.json(
        { message: "Article ID is required" },
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

    // Make sure you're using the correct API URL format
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${articleId}`;
    console.log("Calling API URL:", apiUrl); // For debugging
    
    // Try different authorization header format
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Try without "Bearer " prefix - some APIs expect just the token
        "Authorization": token,
      },
      // Add credentials to ensure cookies are sent with the request
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log("Error response:", data); // Add this for debugging
      return NextResponse.json(
        { message: data.detail || "Failed to delete article" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
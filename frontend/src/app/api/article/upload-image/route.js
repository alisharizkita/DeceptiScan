import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get the auth token from the request headers
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    
    // Get the form data
    const formData = await req.formData();
    const image = formData.get('image');
    
    if (!image) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Create a new FormData to forward to the backend
    const backendFormData = new FormData();
    backendFormData.append('image', image);

    // Send to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/upload-image`, {
      method: 'POST',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {},
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend upload error:', errorText);
      return NextResponse.json(
        { message: `Upload failed (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    // Return the backend response
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error handling image upload:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllBlogs, getBlogBySlug, saveBlog, deleteBlog, type BlogPost } from "@/lib/admin/blog";

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale");

    if (slug) {
      const blog = await getBlogBySlug(slug, locale || undefined);
      return NextResponse.json(blog);
    }

    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog: BlogPost = await request.json();
    await saveBlog(blog);
    
    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    await deleteBlog(blogId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}


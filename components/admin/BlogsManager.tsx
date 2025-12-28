"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import BlogEditor from "./BlogEditor";
import type { BlogPost } from "@/lib/admin/blog";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | undefined | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({}); // Store blob URLs for images

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
        
        // Pre-load image previews for blog featured images that might not be deployed yet
        data.forEach((blog: BlogPost) => {
          if (blog.featuredImage && !imagePreviews[blog.featuredImage]) {
            // Try to load the image, if it fails it's not deployed yet
            const img = new window.Image();
            img.onerror = () => {
              // Image not available yet, we'll just show broken image
              console.log(`Image not yet deployed: ${blog.featuredImage}`);
            };
            img.src = blog.featuredImage;
          }
        });
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (blog: BlogPost) => {
    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog");
      }

      await loadBlogs();
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      throw error;
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setIsDeleting(blogId);
    try {
      const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      await loadBlogs();
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post");
    } finally {
      setIsDeleting(null);
    }
  };

  // Show editor when selectedBlog is undefined (new blog) or a BlogPost object (editing)
  if (selectedBlog !== null) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedBlog(null)}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 hover:underline cursor-pointer"
          >
            ← Back to Blogs List
          </button>
        </div>
        <BlogEditor
          initialBlog={selectedBlog || undefined}
          onSave={handleSave}
          onDelete={selectedBlog && typeof selectedBlog === 'object' && 'id' in selectedBlog ? () => handleDelete(selectedBlog.id) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium text-black mb-1">Blog Management</h2>
            <p className="text-gray-500 text-sm">Create and manage blog posts</p>
          </div>
          <button
            onClick={() => setSelectedBlog(undefined)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Blog</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No blog posts yet.</p>
            <button
              onClick={() => setSelectedBlog(undefined)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Blog Post</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {blogs.map((blog) => (
               <div
                 key={blog.id}
                 className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
               >
                 {blog.featuredImage && !blog.featuredImage.startsWith('blob:') && (
                   <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg bg-gray-100">
                     <img
                       src={blog.featuredImage}
                       alt={blog.title[blog.locale] || "Blog"}
                       className="w-full h-full object-cover"
                     />
                   </div>
                 )}
                 <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                   {blog.title[blog.locale] || "Untitled"}
                 </h3>
                 <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                   {blog.excerpt[blog.locale] || "No excerpt"}
                 </p>
                 <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                   <span className="truncate">/{blog.locale}/blog/{blog.slug}</span>
                   <span className="whitespace-nowrap ml-2">
                     {new Date(blog.publishedAt).toLocaleDateString()}
                   </span>
                 </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <a
                    href={`/${blog.locale}/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={isDeleting === blog.id}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isDeleting === blog.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


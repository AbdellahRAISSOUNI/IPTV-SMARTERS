"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu } from "@tiptap/react/menus";
import { NodeSelection } from "@tiptap/pm/state";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Loader2,
} from "lucide-react";
import { BlogImage } from "./blog-image-extension";
import "./blog-rich-editor.css";

function generateId() {
  return Math.random().toString(36).slice(2, 15);
}

export interface BlogRichTextEditorProps {
  html: string;
  onHtmlChange: (html: string) => void;
  uploadImage: (file: File) => Promise<string>;
  onUploadBusyChange?: (busy: boolean) => void;
  placeholder?: string;
}

export default function BlogRichTextEditor({
  html,
  onHtmlChange,
  uploadImage,
  onUploadBusyChange,
  placeholder = "Write your article…",
}: BlogRichTextEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const onHtmlChangeRef = useRef(onHtmlChange);
  const uploadImageRef = useRef(uploadImage);
  const lastEmittedHtmlRef = useRef(html);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertImageFromFileRef = useRef<(file: File) => Promise<void>>(async () => {});

  onHtmlChangeRef.current = onHtmlChange;
  uploadImageRef.current = uploadImage;

  insertImageFromFileRef.current = async (file: File) => {
    const editor = editorRef.current;
    if (!editor) return;

    const blobUrl = URL.createObjectURL(file);
    const marker = generateId();
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: blobUrl,
          uploadMarker: marker,
          dataUploading: "true",
        },
      })
      .run();

    onUploadBusyChange?.(true);
    try {
      const finalUrl = await uploadImageRef.current(file);
      const ed = editorRef.current;
      if (!ed) return;

      const applyFinalUrl = () => {
        const latest = editorRef.current;
        if (!latest) return false;
        let posFound = -1;
        latest.state.doc.descendants((node, pos) => {
          if (node.type.name !== "image") return true;
          const srcMatch = node.attrs.src === blobUrl;
          const markerMatch = node.attrs.uploadMarker === marker;
          if (srcMatch || markerMatch) {
            posFound = pos;
            return false;
          }
          return true;
        });
        if (posFound < 0) return false;
        latest
          .chain()
          .focus()
          .setNodeSelection(posFound)
          .updateAttributes("image", {
            src: finalUrl,
            uploadMarker: null,
            dataUploading: null,
          })
          .run();
        return true;
      };

      if (!applyFinalUrl()) {
        requestAnimationFrame(() => {
          if (!applyFinalUrl()) {
            console.warn("BlogRichTextEditor: could not attach uploaded image URL to editor node.");
          }
        });
      }
    } catch (e) {
      console.error(e);
      const ed = editorRef.current;
      if (ed) {
        ed.state.doc.descendants((node, pos) => {
          if (node.type.name !== "image") return true;
          if (node.attrs.src === blobUrl || node.attrs.uploadMarker === marker) {
            ed.chain().setNodeSelection(pos).deleteSelection().run();
            return false;
          }
          return true;
        });
      }
    } finally {
      onUploadBusyChange?.(false);
      const url = blobUrl;
      setTimeout(() => URL.revokeObjectURL(url), 750);
    }
  };

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: {
            openOnClick: false,
            autolink: true,
            HTMLAttributes: {
              class: "text-violet-700 underline underline-offset-2",
              rel: "noopener noreferrer",
              target: "_blank",
            },
          },
        }),
        BlogImage,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: html || "",
      editorProps: {
        attributes: {
          class:
            "prose prose-slate max-w-none min-h-[280px] px-3 py-3 blog-rich-editor-root focus:outline-none prose-p:text-[15px] prose-p:leading-7 prose-a:text-violet-700 prose-img:rounded-lg",
        },
        handlePaste(_view, event) {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === "file" && item.type.startsWith("image/")) {
              const imageFile = item.getAsFile();
              if (imageFile) {
                event.preventDefault();
                void insertImageFromFileRef.current(imageFile);
                return true;
              }
            }
          }
          return false;
        },
      },
      onUpdate: ({ editor: ed }) => {
        const out = ed.getHTML();
        lastEmittedHtmlRef.current = out;
        onHtmlChangeRef.current(out);
      },
      onCreate: ({ editor: ed }) => {
        editorRef.current = ed;
      },
      onDestroy: () => {
        editorRef.current = null;
      },
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    if (html === lastEmittedHtmlRef.current) return;
    if (html === editor.getHTML()) {
      lastEmittedHtmlRef.current = html;
      return;
    }
    editor.commands.setContent(html || "", { emitUpdate: false });
    lastEmittedHtmlRef.current = html;
  }, [html, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[200px] border border-gray-200 rounded-lg bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <BubbleMenu
        editor={editor}
        options={{ placement: "top" }}
        shouldShow={({ editor: ed }) => {
          const { selection } = ed.state;
          if (!(selection instanceof NodeSelection)) return false;
          return selection.node.type.name === "image";
        }}
      >
        <div className="flex flex-wrap gap-1 p-1 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          {[280, 480, 720].map((w) => (
            <button
              key={w}
              type="button"
              className="px-2 py-1 text-xs text-white hover:bg-gray-700 rounded"
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { width: w, height: null }).run()
              }
            >
              {w}px
            </button>
          ))}
          <button
            type="button"
            className="px-2 py-1 text-xs text-white hover:bg-gray-700 rounded"
            onClick={() =>
              editor.chain().focus().updateAttributes("image", { width: null, height: null }).run()
            }
          >
            Full
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs text-red-300 hover:bg-gray-700 rounded"
            onClick={() => editor.chain().focus().deleteSelection().run()}
          >
            Remove
          </button>
        </div>
      </BubbleMenu>

      <div className="sticky top-0 z-40 flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>
        <span className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <span className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <span className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarBtn>
        <span className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarBtn>
        <span className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="w-4 h-4" />
        </ToolbarBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void insertImageFromFileRef.current(f);
          }}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${
        active ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

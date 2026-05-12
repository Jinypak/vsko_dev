"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { upsertDocPage, uploadDocImage } from "@/lib/actions/docs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Highlighter,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListTodo,
  Quote, Code, Minus,
  AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Link2, Undo, Redo,
  Save, Check, Palette,
} from "lucide-react";

// ── 컬러 박스 색상 정의 ─────────────────────────────────────────────────────
const CALLOUT_COLORS = {
  blue:   { swatch: "#3b82f6", bg: "#eff6ff", border: "#3b82f6", fg: "#1e3a5f" },
  green:  { swatch: "#22c55e", bg: "#f0fdf4", border: "#22c55e", fg: "#14532d" },
  yellow: { swatch: "#eab308", bg: "#fefce8", border: "#eab308", fg: "#713f12" },
  red:    { swatch: "#ef4444", bg: "#fef2f2", border: "#ef4444", fg: "#7f1d1d" },
  purple: { swatch: "#a855f7", bg: "#faf5ff", border: "#a855f7", fg: "#4a044e" },
  gray:   { swatch: "#6b7280", bg: "#f9fafb", border: "#6b7280", fg: "#111827" },
} as const;

type CalloutColor = keyof typeof CALLOUT_COLORS;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: { insertCallout: (color: CalloutColor) => ReturnType };
  }
}

// ── Callout 커스텀 노드 ───────────────────────────────────────────────────────
const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return { color: { default: "blue" } };
  },

  parseHTML() {
    return [{
      tag: "div[data-callout]",
      getAttrs: (el) => ({ color: (el as HTMLElement).dataset.callout ?? "blue" }),
    }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const color = (node.attrs.color as CalloutColor) in CALLOUT_COLORS
      ? (node.attrs.color as CalloutColor)
      : "blue";
    const c = CALLOUT_COLORS[color];
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-callout": color,
        style: `background:${c.bg};border-left:4px solid ${c.border};color:${c.fg};padding:0.75rem 1rem;border-radius:0.375rem;margin:0.5rem 0`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertCallout:
        (color: CalloutColor) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { color },
            content: [{ type: "paragraph" }],
          }),
    };
  },
});

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────
interface DocEditorProps {
  slug: string;
  title: string;
  initialContent: string;
}

export default function DocEditor({ slug, title, initialContent }: DocEditorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showCalloutPicker, setShowCalloutPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const calloutPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCalloutPicker) return;
    const close = (e: MouseEvent) => {
      if (!calloutPickerRef.current?.contains(e.target as Node)) {
        setShowCalloutPicker(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showCalloutPicker]);

  const editor = useEditor({
    immediatelyRender: false,
    enableInputRules: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline underline-offset-2" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full my-2" } }),
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CalloutNode,
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm prose-neutral max-w-none focus:outline-none min-h-[60vh] px-1",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    const { error } = await upsertDocPage(slug, title, editor.getHTML());
    setSaving(false);
    if (error) {
      setSaveError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadDocImage(formData);
    if (result.url) {
      editor.chain().focus().setImage({ src: result.url }).run();
    }
    e.target.value = "";
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("링크 URL을 입력하세요", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const tb = (active: boolean) =>
    `h-7 w-7 p-0 ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`;

  return (
    <div className="flex flex-col h-full">
      {/* 툴바 */}
      <div className="sticky top-14 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 py-1.5 flex items-center gap-0.5 flex-wrap">

          {/* 실행취소/재실행 */}
          <Button size="icon-sm" variant="ghost" className={tb(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="실행취소">
            <Undo className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="재실행">
            <Redo className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 헤딩 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="제목 1">
            <Heading1 className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="제목 2">
            <Heading2 className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="제목 3">
            <Heading3 className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 텍스트 스타일 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
            <Bold className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
            <Italic className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
            <UnderlineIcon className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
            <Strikethrough className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()} title="형광펜">
            <Highlighter className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 리스트 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 기호">
            <List className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
            <ListOrdered className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("taskList"))} onClick={() => editor.chain().focus().toggleTaskList().run()} title="체크리스트">
            <ListTodo className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 블록 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용">
            <Quote className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("code"))} onClick={() => editor.chain().focus().toggleCode().run()} title="인라인 코드">
            <Code className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
            <Minus className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 정렬 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="왼쪽 정렬">
            <AlignLeft className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="가운데 정렬">
            <AlignCenter className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="오른쪽 정렬">
            <AlignRight className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* 링크, 이미지 */}
          <Button size="icon-sm" variant="ghost" className={tb(editor.isActive("link"))} onClick={setLink} title="링크">
            <Link2 className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className={tb(false)} onClick={() => fileInputRef.current?.click()} title="이미지 업로드">
            <ImageIcon className="size-3.5" />
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          {/* 컬러 박스 */}
          <div className="relative" ref={calloutPickerRef}>
            <Button
              size="icon-sm"
              variant="ghost"
              className={tb(editor.isActive("callout"))}
              onClick={() => setShowCalloutPicker((v) => !v)}
              title="색상 박스 삽입"
            >
              <Palette className="size-3.5" />
            </Button>
            {showCalloutPicker && (
              <div className="absolute top-full left-0 mt-1.5 p-2 bg-popover border rounded-lg shadow-md z-50 flex gap-1.5">
                {(Object.keys(CALLOUT_COLORS) as CalloutColor[]).map((key) => (
                  <button
                    key={key}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    style={{ background: CALLOUT_COLORS[key].swatch }}
                    title={key}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().insertCallout(key).run();
                      setShowCalloutPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 저장 버튼 */}
          <div className="ml-auto">
            {saveError && <span className="text-xs text-destructive mr-2">{saveError}</span>}
            <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs px-3 gap-1.5">
              {saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
              {saving ? "저장 중..." : saved ? "저장됨" : "저장"}
            </Button>
          </div>
        </div>
      </div>

      {/* 에디터 본문 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  autosaveKey?: string;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function RichEditor({ value, onChange, placeholder, autosaveKey }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const lastEmitted = useRef<string>("");
  const lowlight = useMemo(() => createLowlight(common), []);

  const initial = useMemo(() => {
    if (!autosaveKey) return value;
    const draft = localStorage.getItem(autosaveKey);
    return draft ?? value;
  }, [autosaveKey, value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: placeholder ?? "Начни писать…",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initial || "<p></p>",
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastEmitted.current = html;
      onChange(html);
      if (autosaveKey) {
        localStorage.setItem(autosaveKey, html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300",
      },
      handleDrop: (view, event) => {
        const dt = event.dataTransfer;
        if (!dt?.files?.length) return false;
        const file = dt.files[0];
        if (!file.type.startsWith("image/")) return false;
        void (async () => {
          const url = await readFileAsDataUrl(file);
          const { schema } = view.state;
          const node = schema.nodes.image?.create({ src: url });
          if (!node) return;
          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
        })();
        return true;
      },
    },
  });

  // Keep in sync if parent changes value (e.g. reset or switching edited page).
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            label="B"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            label="I"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            active={editor?.isActive("strike")}
            label="S"
          />
          <Divider />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive("heading", { level: 2 })}
            label="H2"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive("heading", { level: 3 })}
            label="H3"
          />
          <Divider />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            label="• List"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            label="1. List"
          />
          <Divider />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            active={editor?.isActive("codeBlock")}
            label="Code"
          />
          <ToolbarButton
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            label="Table"
          />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Image URL");
              if (!url) return;
              editor?.chain().focus().setImage({ src: url }).run();
            }}
            label="Image"
          />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Link URL");
              if (!url) return;
              editor?.chain().focus().setLink({ href: url }).run();
            }}
            label="Link"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().unsetLink().run()}
            label="Unlink"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "edit" ? "preview" : "edit"))}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            {mode === "edit" ? "Preview" : "Edit"}
          </button>
          {autosaveKey ? <div className="text-xs text-zinc-500">Автосохранение</div> : null}
        </div>
      </div>

      <div className="min-h-[360px] rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
        {mode === "edit" ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300"
            // Admin-only preview; content is authored by trusted admin.
            dangerouslySetInnerHTML={{ __html: value || "" }}
          />
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-zinc-800" />;
}

function ToolbarButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-2 py-1.5 text-xs ring-1 transition",
        active ? "bg-zinc-800/60 text-zinc-50 ring-zinc-700" : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}


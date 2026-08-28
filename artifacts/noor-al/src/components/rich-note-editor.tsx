import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 2000;

interface RichNoteEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichNoteEditor({ content, onChange, placeholder = "Write your reflections here...", className }: RichNoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: MAX_CHARS }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[120px] px-3 py-2 focus:outline-none text-sm leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  const chars = editor.storage.characterCount.characters() as number;
  const words = editor.storage.characterCount.words() as number;
  const nearLimit = chars > MAX_CHARS * 0.9;

  const ToolBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      aria-label={title}
      title={title}
      className={cn(
        "w-7 h-7 rounded flex items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        active && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn("border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring", className)}>
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-border bg-muted/40">
        <ToolBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/20">
        <span className="text-xs text-muted-foreground">{words} word{words !== 1 ? "s" : ""}</span>
        <span className={cn("text-xs", nearLimit ? "text-destructive font-medium" : "text-muted-foreground")}>
          {chars} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}

export function RichNoteDisplay({ html, className }: { html: string; className?: string }) {
  const isHtml = html.startsWith("<");
  return isHtml ? (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <p className={cn("text-foreground whitespace-pre-wrap leading-relaxed text-sm", className)}>{html}</p>
  );
}

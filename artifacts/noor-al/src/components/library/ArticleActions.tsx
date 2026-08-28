import { useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle, Circle, FileText, Send, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const API = "/api/library";

interface LibraryRecord { id: number; articleId: string; }
interface LibraryNote { id: number; articleId: string; noteText: string; createdAt: string; }

interface Props {
  categoryId: string;
  articleId: string;
}

export function ArticleActions({ categoryId, articleId }: Props) {
  const { userId } = useAuth();
  const qc = useQueryClient();
  const [showNotes, setShowNotes] = useState(false);
  const [draft, setDraft] = useState("");

  const progressKey = ["library-progress"];
  const bookmarksKey = ["library-bookmarks"];
  const notesKey = ["library-notes", articleId];

  const { data: progress = [] } = useQuery<LibraryRecord[]>({
    queryKey: progressKey,
    queryFn: () => fetch(`${API}/progress`).then((r) => r.ok ? r.json() : []),
    enabled: !!userId,
  });

  const { data: bookmarks = [] } = useQuery<LibraryRecord[]>({
    queryKey: bookmarksKey,
    queryFn: () => fetch(`${API}/bookmarks`).then((r) => r.ok ? r.json() : []),
    enabled: !!userId,
  });

  const { data: notes = [] } = useQuery<LibraryNote[]>({
    queryKey: notesKey,
    queryFn: () => fetch(`${API}/notes?articleId=${articleId}`).then((r) => r.ok ? r.json() : []),
    enabled: !!userId && showNotes,
  });

  const isComplete = progress.some((p) => p.articleId === articleId);
  const isBookmarked = bookmarks.some((b) => b.articleId === articleId);

  const markComplete = useMutation({
    mutationFn: () =>
      isComplete
        ? fetch(`${API}/progress/${articleId}`, { method: "DELETE" })
        : fetch(`${API}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, articleId }),
          }),
    onSuccess: () => qc.invalidateQueries({ queryKey: progressKey }),
  });

  const toggleBookmark = useMutation({
    mutationFn: () =>
      isBookmarked
        ? fetch(`${API}/bookmarks/${articleId}`, { method: "DELETE" })
        : fetch(`${API}/bookmarks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, articleId }),
          }),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookmarksKey }),
  });

  const addNote = useMutation({
    mutationFn: () =>
      fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, noteText: draft }),
      }),
    onSuccess: () => {
      setDraft("");
      qc.invalidateQueries({ queryKey: notesKey });
    },
  });

  const deleteNote = useMutation({
    mutationFn: (id: number) => fetch(`${API}/notes/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notesKey }),
  });

  if (!userId) return null;

  return (
    <div className="mt-8 space-y-3">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => markComplete.mutate()}
          disabled={markComplete.isPending}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            isComplete
              ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {isComplete ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {isComplete ? "Completed" : "Mark as Complete"}
        </button>

        <button
          onClick={() => toggleBookmark.mutate()}
          disabled={toggleBookmark.isPending}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            isBookmarked
              ? "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          onClick={() => setShowNotes(!showNotes)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            showNotes
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <FileText className="w-4 h-4" />
          Notes
        </button>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">My Notes</p>
            <button onClick={() => setShowNotes(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Existing notes */}
          {notes.length > 0 && (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="flex-1 text-foreground/90 whitespace-pre-wrap">{note.noteText}</p>
                  <button
                    onClick={() => deleteNote.mutate(note.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New note input */}
          <div className="flex gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a personal note..."
              rows={2}
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => addNote.mutate()}
              disabled={!draft.trim() || addNote.isPending}
              className="self-end p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

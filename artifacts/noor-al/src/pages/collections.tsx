import { useState } from "react";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useGetCollections, useCreateCollection, useDeleteCollection } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, FolderHeart, Plus, Trash2, ChevronRight, BookOpen } from "lucide-react";
import { SignInPrompt } from "@/components/sign-in-prompt";

export default function CollectionsPage() {
  useSEO("Collections", "Your personal verse collections — group ayahs by theme, topic, or feeling.");
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: collections, isLoading, refetch } = useGetCollections({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!isSignedIn } as any,
  });

  const createCollection = useCreateCollection();
  const deleteCollection = useDeleteCollection();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createCollection.mutateAsync({ data: { name: newName.trim(), description: newDesc.trim() || undefined } });
      toast({ title: "Collection created ✓" });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      refetch();
    } catch {
      toast({ title: "Failed to create collection", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will also remove all its verses.`)) return;
    try {
      await deleteCollection.mutateAsync({ id });
      toast({ title: "Collection deleted" });
      refetch();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <SignInPrompt
          title="Sign in to use Collections"
          description="Create themed groups of verses — patience, gratitude, du'a — and access them anytime."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderHeart className="w-7 h-7 text-primary" />
            {t("collections.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("collections.subtitle")}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("collections.new")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !collections || collections.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <FolderHeart className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium text-base">{t("collections.noCollections")}</p>
          <p className="text-sm mt-1">{t("collections.subtitle")}</p>
          <Button onClick={() => setShowCreate(true)} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            {t("collections.createFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map((col) => (
            <Card key={col.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <Link href={`/collections/${col.id}`} className="flex-1 flex items-center gap-4 p-4 sm:p-5">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{col.name}</p>
                      {col.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{col.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {col.verseCount} {col.verseCount === 1 ? "verse" : "verses"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="p-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    aria-label="Delete collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Verses about patience"
                autoFocus
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What this collection is about…"
                rows={2}
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={!newName.trim() || creating} className="gap-2">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

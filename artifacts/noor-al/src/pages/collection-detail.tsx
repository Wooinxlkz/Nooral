import { useState } from "react";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useGetCollection, useUpdateCollection, useRemoveVerseFromCollection } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Loader2, FolderHeart, ArrowLeft, BookOpen, Trash2, Pencil, ExternalLink,
} from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: collection, isLoading, refetch } = useGetCollection(id, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!isSignedIn && id > 0 } as any,
  });

  useSEO(collection?.name ?? "Collection", "View and manage your verse collection.");

  const updateCollection = useUpdateCollection();
  const removeVerse = useRemoveVerseFromCollection();

  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = () => {
    setEditName(collection?.name ?? "");
    setEditDesc(collection?.description ?? "");
    setShowEdit(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateCollection.mutateAsync({ id, data: { name: editName.trim(), description: editDesc.trim() || undefined } });
      toast({ title: t("collectionDetail.updated") });
      setShowEdit(false);
      refetch();
    } catch {
      toast({ title: t("collectionDetail.updateFailed"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveVerse = async (verseKey: string) => {
    try {
      await removeVerse.mutateAsync({ id, verseKey });
      toast({ title: t("collectionDetail.verseRemoved") });
      refetch();
    } catch {
      toast({ title: t("collectionDetail.verseRemoveFailed"), variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center text-muted-foreground">
        <FolderHeart className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p>{t("collectionDetail.notFound")}</p>
        <Link href="/collections">
          <Button variant="outline" className="mt-4">{t("collectionDetail.backToCollections")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => setLocation("/collections")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("collectionDetail.allCollections")}
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{collection.name}</h1>
            {collection.description && (
              <p className="text-muted-foreground text-sm mt-1">{collection.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {collection.verses.length} {collection.verses.length === 1 ? t("collectionDetail.verse") : t("collectionDetail.verses")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5 shrink-0">
            <Pencil className="w-3.5 h-3.5" />
            {t("collectionDetail.edit")}
          </Button>
        </div>
      </div>

      {/* Verses */}
      {collection.verses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">{t("collectionDetail.noVerses")}</p>
          <p className="text-sm mt-1">{t("collectionDetail.noVersesHint")}</p>
          <Link href="/reader">
            <Button variant="outline" className="mt-4 gap-2">
              <BookOpen className="w-4 h-4" />
              {t("collectionDetail.goToReader")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {collection.verses.map((verse) => (
            <Card key={verse.verseKey} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {verse.surahNameEn} · {verse.verseKey}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Link href={`/reader?surah=${verse.surahId}&ayah=${verse.ayahNumber}`}>
                      <button className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title={t("collectionDetail.readInContext")}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveVerse(verse.verseKey)}
                      className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title={t("collectionDetail.removeFromCollection")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {verse.ayahText && (
                  <p className="font-arabic text-xl text-right leading-loose text-foreground mb-2" dir="rtl">
                    {verse.ayahText}
                  </p>
                )}
                {verse.translation && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{verse.translation}</p>
                )}
                {verse.note && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">"{verse.note}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("collectionDetail.editCollection")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("collectionDetail.name")}</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("collectionDetail.descOptional")}</label>
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>{t("common.cancel")}</Button>
              <Button type="submit" disabled={!editName.trim() || saving} className="gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

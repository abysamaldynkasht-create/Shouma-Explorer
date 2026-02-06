import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, Plus, Pencil, Trash2, Table2, AlertCircle, CheckCircle, RefreshCw, FileSpreadsheet, ExternalLink } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import shoumaLogo from "@assets/شومة_1768320219408.jpg";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SheetRow {
  id: string;
  activityName: string;
  category: string;
  state: string;
  description: string;
  googleMapsLink: string;
  images: string;
  hiddenGems: string;
}

const emptyRow: Omit<SheetRow, "id"> = {
  activityName: "",
  category: "",
  state: "",
  description: "",
  googleMapsLink: "",
  images: "",
  hiddenGems: "No",
};

const categories = [
  "Recreation", "Historical", "Nature", "Markets", "Entertainment",
  "Heritage", "Wadis", "Religious", "Cultural", "Adventure",
];

const states = [
  "Muscat", "Nizwa", "Salalah", "Sur", "Sohar", "Khasab",
  "Ibri", "Rustaq", "Bahla", "Al Hamra", "Duqm", "Ibra",
];

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === "ar" || language === "fa";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<{ id: string; data: SheetRow } | null>(null);
  const [formData, setFormData] = useState<Omit<SheetRow, "id">>(emptyRow);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const statusQuery = useQuery<{ configured: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  const sheetsQuery = useQuery<SheetRow[]>({
    queryKey: ["/api/admin/sheets"],
    enabled: statusQuery.data?.configured === true,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Omit<SheetRow, "id">) => {
      const res = await apiRequest("POST", "/api/admin/sheets", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sheets"] });
      setIsAddOpen(false);
      setFormData(emptyRow);
      toast({ title: t("adminAddSuccess") });
    },
    onError: () => {
      toast({ title: t("adminAddError"), variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SheetRow }) => {
      const res = await apiRequest("PUT", `/api/admin/sheets/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sheets"] });
      setEditingRow(null);
      toast({ title: t("adminUpdateSuccess") });
    },
    onError: () => {
      toast({ title: t("adminUpdateError"), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/sheets/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sheets"] });
      toast({ title: t("adminDeleteSuccess") });
    },
    onError: () => {
      toast({ title: t("adminDeleteError"), variant: "destructive" });
    },
  });

  const initMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/sheets/init");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sheets"] });
      toast({ title: t("adminInitSuccess") });
    },
  });

  const filteredRows = (sheetsQuery.data || []).filter((row) => {
    const matchesSearch = !searchQuery ||
      row.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || row.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  function renderForm(isEdit: boolean) {
    const currentData = isEdit && editingRow ? editingRow.data : formData;
    const setData = isEdit
      ? (updates: Partial<SheetRow>) => setEditingRow(prev => prev ? { ...prev, data: { ...prev.data, ...updates } } : null)
      : (updates: Partial<Omit<SheetRow, "id">>) => setFormData(prev => ({ ...prev, ...updates }));

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">{t("adminActivityName")}</label>
          <Input
            data-testid="input-activity-name"
            value={currentData.activityName}
            onChange={(e) => setData({ activityName: e.target.value })}
            placeholder={t("adminActivityNamePlaceholder")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t("adminCategory")}</label>
            <Select value={currentData.category} onValueChange={(v) => setData({ category: v })}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder={t("adminSelectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("adminState")}</label>
            <Select value={currentData.state} onValueChange={(v) => setData({ state: v })}>
              <SelectTrigger data-testid="select-state">
                <SelectValue placeholder={t("adminSelectState")} />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{t("adminDescription")}</label>
          <Textarea
            data-testid="input-description"
            value={currentData.description}
            onChange={(e) => setData({ description: e.target.value })}
            placeholder={t("adminDescriptionPlaceholder")}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{t("adminGoogleMapsLink")}</label>
          <Input
            data-testid="input-maps-link"
            value={currentData.googleMapsLink}
            onChange={(e) => setData({ googleMapsLink: e.target.value })}
            placeholder="https://goo.gl/maps/..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{t("adminImages")}</label>
          <Input
            data-testid="input-images"
            value={currentData.images}
            onChange={(e) => setData({ images: e.target.value })}
            placeholder={t("adminImagesPlaceholder")}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{t("adminHiddenGems")}</label>
          <Select value={currentData.hiddenGems || "No"} onValueChange={(v) => setData({ hiddenGems: v })}>
            <SelectTrigger data-testid="select-hidden-gems">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">{t("adminYes")}</SelectItem>
              <SelectItem value="No">{t("adminNo")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#EDE5DB]" dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-[1000] bg-gradient-to-r from-[#8B6914] to-[#A0841C] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="text-white"
              data-testid="button-back"
            >
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Button>
            <img src={shoumaLogo} alt="Shouma" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <h1 className="font-bold text-lg leading-tight">{t("adminPanel")}</h1>
              <p className="text-xs text-white/70">{t("adminSubtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {!statusQuery.data?.configured ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-amber-500" />
              <h2 className="text-xl font-bold text-[#5C4033]">{t("adminNotConfigured")}</h2>
              <p className="text-[#8B7355] max-w-md">{t("adminNotConfiguredDesc")}</p>
              <div className="bg-[#F5F0EB] rounded-md p-4 text-sm text-[#5C4033] max-w-lg text-start" dir="ltr">
                <p className="font-medium mb-2">{t("adminSetupSteps")}</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t("adminStep1")}</li>
                  <li>{t("adminStep2")}</li>
                  <li>{t("adminStep3")}</li>
                  <li>{t("adminStep4")}</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t("adminConnected")}
                </Badge>
                <span className="text-sm text-[#8B7355]">
                  {sheetsQuery.data?.length || 0} {t("adminRecords")}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/sheets"] })}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline ms-1">{t("adminRefresh")}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initMutation.mutate()}
                  disabled={initMutation.isPending}
                  data-testid="button-init"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ms-1">{t("adminInitSheet")}</span>
                </Button>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#8B6914] hover:bg-[#A0841C]" data-testid="button-add-new">
                      <Plus className="w-4 h-4" />
                      <span className="ms-1">{t("adminAddNew")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t("adminAddNew")}</DialogTitle>
                    </DialogHeader>
                    {renderForm(false)}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsAddOpen(false)}>{t("adminCancel")}</Button>
                      <Button
                        className="bg-[#8B6914]"
                        onClick={() => addMutation.mutate(formData)}
                        disabled={addMutation.isPending || !formData.activityName}
                        data-testid="button-save-new"
                      >
                        {addMutation.isPending ? t("adminSaving") : t("adminSave")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Input
                data-testid="input-search"
                className="max-w-xs"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40" data-testid="select-filter-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sheetsQuery.isLoading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 animate-spin text-[#8B6914]" />
              </div>
            ) : filteredRows.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <Table2 className="w-12 h-12 text-[#8B7355]/50" />
                  <p className="text-[#8B7355]">{t("noResults")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredRows.map((row, index) => {
                  return (
                    <Card key={row.id + "-" + index} className="hover-elevate" data-testid={`card-row-${row.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#5C4033]" data-testid={`text-name-${row.id}`}>
                                {row.activityName}
                              </span>
                              <Badge variant="secondary" className="text-xs">{row.category}</Badge>
                              {row.hiddenGems === "Yes" && (
                                <Badge className="bg-amber-100 text-amber-700 text-xs">{t("adminHiddenGem")}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#8B7355]">{row.state}</p>
                            <p className="text-sm text-[#5C4033]/80 line-clamp-2">{row.description}</p>
                            {row.googleMapsLink && (
                              <a
                                href={row.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#8B6914] hover:underline"
                                data-testid={`link-maps-${row.id}`}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Google Maps
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Dialog
                              open={editingRow?.id === row.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditingRow({ id: row.id, data: { ...row } });
                                } else {
                                  setEditingRow(null);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-edit-${row.id}`}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{t("adminEditRow")}</DialogTitle>
                                </DialogHeader>
                                {editingRow && renderForm(true)}
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline" onClick={() => setEditingRow(null)}>{t("adminCancel")}</Button>
                                  <Button
                                    className="bg-[#8B6914]"
                                    onClick={() => editingRow && updateMutation.mutate({ id: editingRow.id, data: editingRow.data })}
                                    disabled={updateMutation.isPending}
                                    data-testid="button-save-edit"
                                  >
                                    {updateMutation.isPending ? t("adminSaving") : t("adminSave")}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => {
                                if (confirm(t("adminDeleteConfirm"))) {
                                  deleteMutation.mutate(row.id);
                                }
                              }}
                              data-testid={`button-delete-${row.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

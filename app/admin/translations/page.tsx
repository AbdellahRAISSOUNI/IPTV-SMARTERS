"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle, Languages } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n";

type TranslationData = {
  [key: string]: any;
};

export default function TranslationsPage() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<TranslationData>({});
  const [originalTranslations, setOriginalTranslations] = useState<TranslationData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sha, setSha] = useState<string>("");

  useEffect(() => {
    loadTranslations();
  }, [selectedLocale]);

  const loadTranslations = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const path = `lib/i18n/translations/${selectedLocale}.json`;
      const response = await fetch("/api/admin/github/read-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      const data = await response.json();

      if (response.ok) {
        const parsed = JSON.parse(data.content);
        setTranslations(parsed);
        setOriginalTranslations(parsed);
        setSha(data.sha);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to load translations" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const path = `lib/i18n/translations/${selectedLocale}.json`;
      const content = JSON.stringify(translations, null, 2);
      const message = `Update ${selectedLocale} translations`;

      const response = await fetch("/api/admin/github/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, content, sha, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Translations saved! Changes will deploy automatically." });
        setOriginalTranslations(translations);
        // Reload to get new SHA
        await loadTranslations();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save translations" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const updateTranslation = (keys: string[], value: string) => {
    const newTranslations = { ...translations };
    let current: any = newTranslations;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setTranslations(newTranslations);
  };

  const renderTranslationEditor = (obj: any, prefix: string[] = []): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];

    for (const key in obj) {
      const fullKey = [...prefix, key];
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        elements.push(
          <div key={fullKey.join(".")} className="mb-6">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <div className="ml-4 space-y-4">
              {renderTranslationEditor(value, fullKey)}
            </div>
          </div>
        );
      } else {
        elements.push(
          <div key={fullKey.join(".")} className="mb-4">
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
              {fullKey.join(".")}
            </label>
            <textarea
              value={value || ""}
              onChange={(e) => updateTranslation(fullKey, e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none resize-y min-h-[60px]"
              rows={value && value.length > 50 ? 3 : 1}
            />
          </div>
        );
      }
    }

    return elements;
  };

  const hasChanges = JSON.stringify(translations) !== JSON.stringify(originalTranslations);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
              <Languages className="w-8 h-8" />
              Translations Editor
            </h1>
            <p className="text-[#1a1a1a]/70">Edit website content in all languages</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedLocale}
              onChange={(e) => setSelectedLocale(e.target.value as Locale)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none font-medium"
            >
              {locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving || loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#2563eb] text-white rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg mb-4 ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-200 text-green-700"
                : "bg-red-50 border-2 border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {hasChanges && (
          <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 p-4 rounded-lg mb-4">
            You have unsaved changes. Click "Save Changes" to commit to GitHub.
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderTranslationEditor(translations)}
        </div>
      )}
    </div>
  );
}


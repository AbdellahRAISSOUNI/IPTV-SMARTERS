"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Languages,
  Settings,
  LogOut,
  Save,
  Loader2,
  Check,
  X,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Translations {
  [locale: string]: {
    content: any;
    sha: string;
    path: string;
  };
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Translations>({});
  const [activeLocale, setActiveLocale] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
        await loadTranslations();
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Load translations
  const loadTranslations = async () => {
    try {
      const response = await fetch("/api/admin/translations");
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Save translations
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/admin/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: activeLocale,
          content: translations[activeLocale].content,
          sha: translations[activeLocale].sha,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save translations");
      }

      setSaveStatus("success");
      await loadTranslations(); // Reload to get new SHA
      
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Update translation value
  const updateTranslation = (path: string, value: string) => {
    const keys = path.split(".");
    const newTranslations = { ...translations };
    let current: any = newTranslations[activeLocale].content;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setTranslations(newTranslations);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Render translation fields recursively
  const renderFields = (obj: any, prefix = ""): React.ReactElement[] => {
    const fields: React.ReactElement[] = [];

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;
      const isExpanded = expandedSections.has(path);

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Section header
        fields.push(
          <div key={path} className="mb-4">
            <button
              onClick={() => toggleSection(path)}
              className="flex items-center gap-2 text-white font-semibold text-lg mb-2 hover:text-[#2563eb] transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>{key}</span>
            </button>
            {isExpanded && (
              <div className="ml-6 space-y-3">
                {renderFields(value, path)}
              </div>
            )}
          </div>
        );
      } else {
        // Input field
        fields.push(
          <div key={path} className="mb-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {key}
            </label>
            <textarea
              value={String(value)}
              onChange={(e) => updateTranslation(path, e.target.value)}
              rows={Math.min(5, Math.max(2, String(value).split("\n").length))}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none"
            />
          </div>
        );
      }
    });

    return fields;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">IPTV Smarters</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20 w-fit">
            {Object.keys(translations).map((locale) => (
              <button
                key={locale}
                onClick={() => setActiveLocale(locale)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeLocale === locale
                    ? "bg-[#2563eb] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{locale.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Translation Editor */}
        {translations[activeLocale] && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Edit {activeLocale.toUpperCase()} Translations
              </h2>
              <p className="text-gray-400 text-sm">
                Changes will be committed to GitHub and automatically deployed to Vercel
              </p>
            </div>

            <div className="space-y-4">
              {renderFields(translations[activeLocale].content)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


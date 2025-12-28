"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Languages,
  LogOut,
  Save,
  Loader2,
  Check,
  X,
  Globe,
  Home,
  DollarSign,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

interface Translations {
  [locale: string]: {
    content: any;
    sha: string;
    path: string;
  };
}

type Section = "hero" | "pricing" | "reseller" | "settings";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Translations>({});
  const [activeLocale, setActiveLocale] = useState("en");
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPreview, setShowPreview] = useState(false);
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
      await loadTranslations();
      
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
  const updateValue = (path: string, value: string) => {
    const keys = path.split(".");
    const newTranslations = { ...translations };
    let current: any = newTranslations[activeLocale].content;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setTranslations(newTranslations);
  };

  const getValue = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[activeLocale]?.content;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return "";
      }
    }
    
    return String(current);
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

  const currentContent = translations[activeLocale]?.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Website Editor</h1>
                <p className="text-sm text-gray-400">Edit your IPTV website visually</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? "Hide" : "Preview"}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                    <span>Save & Deploy</span>
                  </>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            {/* Language Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </h3>
              <div className="space-y-2">
                {Object.keys(translations).map((locale) => (
                  <button
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeLocale === locale
                        ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Navigator */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">Edit Section</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection("hero")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeSection === "hero"
                      ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Homepage
                </button>
                <button
                  onClick={() => setActiveSection("pricing")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeSection === "pricing"
                      ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Pricing Plans
                </button>
                <button
                  onClick={() => setActiveSection("reseller")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeSection === "reseller"
                      ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  Reseller Page
                </button>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeSection === "settings"
                      ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="col-span-9">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              {currentContent && (
                <>
                  {/* Hero Section Editor */}
                  {activeSection === "hero" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Homepage Editor</h2>
                        <p className="text-gray-400">Edit your homepage hero section</p>
                      </div>

                      <div className="space-y-4">
                        {/* Hero Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Main Heading
                          </label>
                          <input
                            type="text"
                            value={getValue("hero.title")}
                            onChange={(e) => updateValue("hero.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-lg font-semibold"
                          />
                        </div>

                        {/* Hero Subtitle Parts */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Subtitle Part 1
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart1")}
                              onChange={(e) => updateValue("hero.subtitlePart1", e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Subtitle Part 2 (Highlighted)
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart2")}
                              onChange={(e) => updateValue("hero.subtitlePart2", e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-blue-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-semibold"
                            />
                          </div>
                        </div>

                        {/* Hero Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={getValue("hero.description")}
                            onChange={(e) => updateValue("hero.description", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none"
                          />
                        </div>

                        {/* Preview Card */}
                        {showPreview && (
                          <div className="mt-6 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl">
                            <p className="text-xs text-gray-400 mb-3">PREVIEW</p>
                            <h1 className="text-3xl font-bold text-white mb-3">
                              <span className="underline decoration-blue-500">{getValue("hero.title")}</span>
                              <br />
                              <span className="mt-2 block">
                                {getValue("hero.subtitlePart1")}{" "}
                                <span className="text-blue-400">{getValue("hero.subtitlePart2")}</span>
                              </span>
                            </h1>
                            <p className="text-gray-300">{getValue("hero.description")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing Section Editor */}
                  {activeSection === "pricing" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Pricing Plans Editor</h2>
                        <p className="text-gray-400">Edit your pricing section and plan features</p>
                      </div>

                      <div className="space-y-6">
                        {/* Pricing Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={getValue("pricing.title")}
                            onChange={(e) => updateValue("pricing.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-lg font-semibold"
                          />
                        </div>

                        {/* Plan Labels */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Standard Plans Label
                            </label>
                            <input
                              type="text"
                              value={getValue("pricing.oneConnection")}
                              onChange={(e) => updateValue("pricing.oneConnection", e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Premium Plans Label
                            </label>
                            <input
                              type="text"
                              value={getValue("pricing.premiumPlans")}
                              onChange={(e) => updateValue("pricing.premiumPlans", e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Features List */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Plan Features (one per line)
                          </label>
                          <div className="space-y-2">
                            {[
                              "instantActivation",
                              "freeUpdates",
                              "liveChannels",
                              "moviesSeries",
                              "antiFreezing",
                              "quality",
                              "fastStable",
                              "formats",
                              "compatible",
                              "serverAvailable",
                              "support"
                            ].map((feature) => (
                              <input
                                key={feature}
                                type="text"
                                value={getValue(`pricing.${feature}`)}
                                onChange={(e) => updateValue(`pricing.${feature}`, e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-sm"
                                placeholder={feature}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reseller Section Editor */}
                  {activeSection === "reseller" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Reseller Page Editor</h2>
                        <p className="text-gray-400">Edit your reseller program page content</p>
                      </div>

                      <div className="space-y-4">
                        {/* Hero Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Title
                          </label>
                          <textarea
                            value={getValue("reseller.heroTitle")}
                            onChange={(e) => updateValue("reseller.heroTitle", e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none text-lg font-semibold"
                          />
                        </div>

                        {/* Hero Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Subtitle
                          </label>
                          <textarea
                            value={getValue("reseller.heroSubtitle")}
                            onChange={(e) => updateValue("reseller.heroSubtitle", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none"
                          />
                        </div>

                        {/* CTA Button */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Call-to-Action Button Text
                          </label>
                          <input
                            type="text"
                            value={getValue("reseller.heroButton")}
                            onChange={(e) => updateValue("reseller.heroButton", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Settings Section Editor */}
                  {activeSection === "settings" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Website Settings</h2>
                        <p className="text-gray-400">Edit global website settings and labels</p>
                      </div>

                      <div className="space-y-4">
                        {/* Common Labels */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Navigation Labels
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["home", "pricing", "features", "faq", "contact", "blog", "iptvReseller"].map((label) => (
                              <div key={label}>
                                <input
                                  type="text"
                                  value={getValue(`common.${label}`)}
                                  onChange={(e) => updateValue(`common.${label}`, e.target.value)}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-sm"
                                  placeholder={label}
                                />
                                <p className="text-xs text-gray-500 mt-1">{label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Button Labels */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Button Labels
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["viewOffers", "whatsapp", "email", "freeTest"].map((label) => (
                              <div key={label}>
                                <input
                                  type="text"
                                  value={getValue(`common.${label}`)}
                                  onChange={(e) => updateValue(`common.${label}`, e.target.value)}
                                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-sm"
                                  placeholder={label}
                                />
                                <p className="text-xs text-gray-500 mt-1">{label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

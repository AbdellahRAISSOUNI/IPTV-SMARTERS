"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Save,
  Loader2,
  Check,
  X,
  Home,
  DollarSign,
  Users,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentContent = translations[activeLocale]?.content;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium text-black">Website Editor</h1>
              <p className="text-sm text-gray-500 font-light mt-0.5">Edit and manage your IPTV website</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {Object.keys(translations).map((locale) => (
                  <button
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeLocale === locale
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? "Hide" : "Preview"}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
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

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black font-medium rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("hero")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                    activeSection === "hero"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Homepage
                </button>
                <button
                  onClick={() => setActiveSection("pricing")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                    activeSection === "pricing"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Pricing Plans
                </button>
                <button
                  onClick={() => setActiveSection("reseller")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                    activeSection === "reseller"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Reseller Page
                </button>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                    activeSection === "settings"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Editor */}
          <div className="col-span-9">
            {currentContent && (
              <>
                {/* Hero Section Editor */}
                {activeSection === "hero" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Homepage Hero</h2>
                      <p className="text-gray-500 text-sm mb-6">Edit your homepage hero section</p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Main Heading
                          </label>
                          <input
                            type="text"
                            value={getValue("hero.title")}
                            onChange={(e) => updateValue("hero.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle Part 1
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart1")}
                              onChange={(e) => updateValue("hero.subtitlePart1", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle Part 2 <span className="text-blue-600">(Highlighted)</span>
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart2")}
                              onChange={(e) => updateValue("hero.subtitlePart2", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={getValue("hero.description")}
                            onChange={(e) => updateValue("hero.description", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Preview</p>
                        <h1 className="text-4xl font-bold text-black mb-3">
                          <span className="underline decoration-blue-600">{getValue("hero.title")}</span>
                          <br />
                          <span className="mt-2 block">
                            {getValue("hero.subtitlePart1")}{" "}
                            <span className="text-blue-600">{getValue("hero.subtitlePart2")}</span>
                          </span>
                        </h1>
                        <p className="text-gray-600 leading-relaxed">{getValue("hero.description")}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing Section Editor */}
                {activeSection === "pricing" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Pricing Plans</h2>
                      <p className="text-gray-500 text-sm mb-6">Edit your pricing section and features</p>

                      <div className="space-y-6">
                        {/* Section Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={getValue("pricing.title")}
                            onChange={(e) => updateValue("pricing.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg font-medium"
                          />
                        </div>

                        {/* Plan Labels */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Standard Plans Label
                            </label>
                            <input
                              type="text"
                              value={getValue("pricing.oneConnection")}
                              onChange={(e) => updateValue("pricing.oneConnection", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Premium Plans Label
                            </label>
                            <input
                              type="text"
                              value={getValue("pricing.premiumPlans")}
                              onChange={(e) => updateValue("pricing.premiumPlans", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Plan Features
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { key: "instantActivation", label: "Instant Activation" },
                              { key: "freeUpdates", label: "Free Updates" },
                              { key: "liveChannels", label: "Live Channels" },
                              { key: "moviesSeries", label: "Movies & Series" },
                              { key: "adultContent", label: "Adult Content" },
                              { key: "antiFreezing", label: "Anti-Freezing" },
                              { key: "quality", label: "Quality" },
                              { key: "fastStable", label: "Fast & Stable" },
                              { key: "formats", label: "Formats" },
                              { key: "compatible", label: "Compatible" },
                              { key: "serverAvailable", label: "Server Available" },
                              { key: "support", label: "24/7 Support" },
                              { key: "freeMonth", label: "Free Month" },
                              { key: "freeMonths", label: "Free Months" },
                            ].map((feature) => (
                              <div key={feature.key}>
                                <input
                                  type="text"
                                  value={getValue(`pricing.${feature.key}`)}
                                  onChange={(e) => updateValue(`pricing.${feature.key}`, e.target.value)}
                                  placeholder={feature.label}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview - Pricing Cards */}
                    {showPreview && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Preview</p>
                        
                        {/* Standard Plans */}
                        <div className="mb-8">
                          <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg mb-4">
                            <span className="text-sm font-semibold text-gray-900">{getValue("pricing.oneConnection")}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {["3 Months - €19.99", "6 Months - €29.99", "12 Months - €39.99", "24 Months - €54.99"].map((plan, i) => (
                              <div key={i} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{plan}</h3>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.instantActivation")}</p>
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.liveChannels")}</p>
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.quality")}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Premium Plans */}
                        <div>
                          <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg mb-4">
                            <span className="text-sm font-semibold text-gray-900">{getValue("pricing.premiumPlans")}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {["3 Months - €29.99", "6 Months - €39.99", "12 Months - €59.99", "24 Months - €89.99"].map((plan, i) => (
                              <div key={i} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{plan}</h3>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.adultContent")}</p>
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.liveChannels")}</p>
                                  <p className="text-xs text-gray-600">✓ {getValue("pricing.quality")}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reseller Section Editor */}
                {activeSection === "reseller" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Reseller Page</h2>
                      <p className="text-gray-500 text-sm mb-6">Edit your reseller program page</p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Title
                          </label>
                          <textarea
                            value={getValue("reseller.heroTitle")}
                            onChange={(e) => updateValue("reseller.heroTitle", e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-lg font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Subtitle
                          </label>
                          <textarea
                            value={getValue("reseller.heroSubtitle")}
                            onChange={(e) => updateValue("reseller.heroSubtitle", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Call-to-Action Button
                          </label>
                          <input
                            type="text"
                            value={getValue("reseller.heroButton")}
                            onChange={(e) => updateValue("reseller.heroButton", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Preview</p>
                        <h1 className="text-3xl font-bold text-black mb-3">{getValue("reseller.heroTitle")}</h1>
                        <p className="text-gray-600 mb-4 leading-relaxed">{getValue("reseller.heroSubtitle")}</p>
                        <button className="px-6 py-3 bg-black text-white rounded-lg font-medium">
                          {getValue("reseller.heroButton")}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Settings Section Editor */}
                {activeSection === "settings" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Website Settings</h2>
                      <p className="text-gray-500 text-sm mb-6">Edit global labels and navigation</p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Navigation Menu
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {["home", "pricing", "features", "faq", "contact", "blog", "iptvReseller"].map((label) => (
                              <input
                                key={label}
                                type="text"
                                value={getValue(`common.${label}`)}
                                onChange={(e) => updateValue(`common.${label}`, e.target.value)}
                                placeholder={label}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Button Labels
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {["viewOffers", "whatsapp", "email", "freeTest"].map((label) => (
                              <input
                                key={label}
                                type="text"
                                value={getValue(`common.${label}`)}
                                onChange={(e) => updateValue(`common.${label}`, e.target.value)}
                                placeholder={label}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            ))}
                          </div>
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
  );
}

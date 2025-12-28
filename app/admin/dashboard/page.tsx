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
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";

interface Translations {
  [locale: string]: {
    content: any;
    sha: string;
    path: string;
  };
}

interface CarouselData {
  channels: string[];
  streaming: string[];
  content: string[];
}

type Section = "hero" | "pricing" | "carousel" | "reseller" | "settings";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Translations>({});
  const [carouselData, setCarouselData] = useState<CarouselData>({ channels: [], streaming: [], content: [] });
  const [activeLocale, setActiveLocale] = useState("en");
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [activeCarouselTab, setActiveCarouselTab] = useState<"channels" | "streaming" | "content">("channels");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
        await Promise.all([loadTranslations(), loadCarouselData()]);
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

  // Load carousel data
  const loadCarouselData = async () => {
    try {
      const response = await fetch("/api/admin/carousel");
      const data = await response.json();
      setCarouselData(data);
    } catch (error) {
      console.error("Failed to load carousel data:", error);
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

  // Upload image
  const handleImageUpload = async (file: File, folder: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Add carousel image
  const addCarouselImage = async (file: File) => {
    try {
      const folderMap = {
        channels: "carouselle-channels",
        streaming: "carouselle-streaming",
        content: "carouselle-shows",
      };
      
      const url = await handleImageUpload(file, folderMap[activeCarouselTab]);
      
      setCarouselData(prev => ({
        ...prev,
        [activeCarouselTab]: [...prev[activeCarouselTab], url],
      }));
    } catch (error) {
      console.error("Failed to add carousel image:", error);
    }
  };

  // Remove carousel image
  const removeCarouselImage = (index: number) => {
    setCarouselData(prev => ({
      ...prev,
      [activeCarouselTab]: prev[activeCarouselTab].filter((_, i) => i !== index),
    }));
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
              <p className="text-sm text-gray-500 font-light mt-0.5">Edit content, images, and settings</p>
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
                    <span>Save</span>
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
                  Pricing
                </button>
                <button
                  onClick={() => setActiveSection("carousel")}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                    activeSection === "carousel"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Carousels
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
                  Reseller
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
                    {/* Section Settings */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Pricing Section</h2>
                      <p className="text-gray-500 text-sm mb-6">Edit section title and labels</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={getValue("pricing.title")}
                            onChange={(e) => updateValue("pricing.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>

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
                      </div>
                    </div>

                    {/* Standard Plans - 4 Cards */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-black mb-4">Standard Plans (1 Connection)</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* 3 Months Standard */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">3 Months Plan</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €19.99)"
                              defaultValue="€19.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Instant Activation</p>
                              <p>✓ Free Updates</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p className="text-gray-400">+ 8 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 6 Months Standard */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">6 Months Plan</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €29.99)"
                              defaultValue="€29.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Instant Activation</p>
                              <p>✓ Free Updates</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p className="text-gray-400">+ 8 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 12 Months Standard */}
                        <div className="border border-blue-500 rounded-lg p-4 bg-blue-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">12 Months Plan</h4>
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Popular</span>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €39.99)"
                              defaultValue="€39.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-700 space-y-1">
                              <p>✓ Instant Activation</p>
                              <p>✓ Free Updates</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p className="text-gray-500">+ 8 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 24 Months Standard */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">24 Months Plan</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €54.99)"
                              defaultValue="€54.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Instant Activation</p>
                              <p>✓ Free Updates</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p className="text-gray-400">+ 8 more features...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Plans - 4 Cards */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-black mb-4">Premium Plans (Multiple Connections)</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* 3 Months Premium */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">3 Months Premium</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €29.99)"
                              defaultValue="€29.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Adult Content</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p>✓ 4K & HD Quality</p>
                              <p className="text-gray-400">+ 9 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 6 Months Premium */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">6 Months Premium</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €39.99)"
                              defaultValue="€39.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Adult Content</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p>✓ 4K & HD Quality</p>
                              <p className="text-gray-400">+ 9 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 12 Months Premium */}
                        <div className="border border-blue-500 rounded-lg p-4 bg-blue-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">12 Months Premium</h4>
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Popular</span>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €59.99)"
                              defaultValue="€59.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-700 space-y-1">
                              <p>✓ Adult Content</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p>✓ 1 Month FREE Bonus</p>
                              <p className="text-gray-500">+ 9 more features...</p>
                            </div>
                          </div>
                        </div>

                        {/* 24 Months Premium */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">24 Months Premium</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Price (e.g., €89.99)"
                              defaultValue="€89.99"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>✓ Adult Content</p>
                              <p>✓ 20,000+ Live Channels</p>
                              <p>✓ 3 Months FREE Bonus</p>
                              <p className="text-gray-400">+ 9 more features...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features Editor */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-black mb-1">Plan Features</h3>
                      <p className="text-gray-500 text-sm mb-4">Edit the feature text shown in all cards</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: "instantActivation", label: "Instant Activation" },
                          { key: "freeUpdates", label: "Free Updates" },
                          { key: "liveChannels", label: "Live Channels" },
                          { key: "moviesSeries", label: "Movies & Series" },
                          { key: "adultContent", label: "Adult Content (Premium)" },
                          { key: "antiFreezing", label: "Anti-Freezing" },
                          { key: "quality", label: "Quality" },
                          { key: "fastStable", label: "Fast & Stable" },
                          { key: "formats", label: "Formats" },
                          { key: "compatible", label: "Compatible" },
                          { key: "serverAvailable", label: "Server 99.9% Available" },
                          { key: "support", label: "24/7 Support" },
                        ].map((feature) => (
                          <div key={feature.key}>
                            <label className="text-xs text-gray-600 mb-1 block">{feature.label}</label>
                            <input
                              type="text"
                              value={getValue(`pricing.${feature.key}`)}
                              onChange={(e) => updateValue(`pricing.${feature.key}`, e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview */}
                    {showPreview && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Live Preview</p>
                        
                        {/* Standard Plans Preview */}
                        <div className="mb-8">
                          <div className="flex justify-center mb-6">
                            <div className="relative px-6 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-100">
                              <div className="absolute inset-0 bg-blue-600 rounded-lg"></div>
                              <span className="relative z-10 font-semibold text-sm text-white uppercase">
                                {getValue("pricing.oneConnection")}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {[
                              { name: "3 Months", price: "€19.99", popular: false },
                              { name: "6 Months", price: "€29.99", popular: false },
                              { name: "12 Months", price: "€39.99", popular: true },
                              { name: "24 Months", price: "€54.99", popular: false }
                            ].map((plan, i) => (
                              <div key={i} className={`border-2 rounded-xl p-4 ${
                                plan.popular ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'
                              }`}>
                                {plan.popular && (
                                  <div className="text-center mb-2">
                                    <span className="inline-block text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                                      POPULAR
                                    </span>
                                  </div>
                                )}
                                <h3 className="font-bold text-gray-900 mb-2 text-center">{plan.name}</h3>
                                <div className="text-center mb-3">
                                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.instantActivation")}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.liveChannels")}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.quality")}</span>
                                  </p>
                                </div>
                                <button className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm ${
                                  plan.popular 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}>
                                  Buy Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Premium Plans Preview */}
                        <div>
                          <div className="flex justify-center mb-6">
                            <div className="relative px-6 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-100">
                              <div className="absolute inset-0 bg-blue-600 rounded-lg"></div>
                              <span className="relative z-10 font-semibold text-sm text-white uppercase">
                                {getValue("pricing.premiumPlans")}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {[
                              { name: "3 Months", price: "€29.99", popular: false },
                              { name: "6 Months", price: "€39.99", popular: false },
                              { name: "12 Months", price: "€59.99", popular: true },
                              { name: "24 Months", price: "€89.99", popular: false }
                            ].map((plan, i) => (
                              <div key={i} className={`border-2 rounded-xl p-4 ${
                                plan.popular ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'
                              }`}>
                                {plan.popular && (
                                  <div className="text-center mb-2">
                                    <span className="inline-block text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                                      POPULAR
                                    </span>
                                  </div>
                                )}
                                <h3 className="font-bold text-gray-900 mb-2 text-center">{plan.name}</h3>
                                <div className="text-center mb-3">
                                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.adultContent")}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.liveChannels")}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <span className="text-blue-600">✓</span>
                                    <span>{getValue("pricing.quality")}</span>
                                  </p>
                                </div>
                                <button className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm ${
                                  plan.popular 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}>
                                  Buy Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Carousel Section Editor */}
                {activeSection === "carousel" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-black mb-1">Carousel Images</h2>
                      <p className="text-gray-500 text-sm mb-6">Manage carousel images - add, remove, or reorder</p>

                      {/* Carousel Type Tabs */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                          onClick={() => setActiveCarouselTab("channels")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                            activeCarouselTab === "channels"
                              ? "bg-white text-black shadow-sm"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          TV Channels ({carouselData.channels?.length || 0})
                        </button>
                        <button
                          onClick={() => setActiveCarouselTab("streaming")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                            activeCarouselTab === "streaming"
                              ? "bg-white text-black shadow-sm"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          Streaming ({carouselData.streaming?.length || 0})
                        </button>
                        <button
                          onClick={() => setActiveCarouselTab("content")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                            activeCarouselTab === "content"
                              ? "bg-white text-black shadow-sm"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          Content/Shows ({carouselData.content?.length || 0})
                        </button>
                      </div>

                      {/* Upload Button */}
                      <div className="mb-6">
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>{isUploading ? "Uploading..." : "Upload New Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) addCarouselImage(file);
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>

                      {/* Scrollable Image Grid - All images visible */}
                      <div className="max-h-[600px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {carouselData[activeCarouselTab]?.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors">
                                <img
                                  src={image}
                                  alt={`Carousel ${index + 1}`}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => removeCarouselImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Delete image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                #{index + 1}
                              </div>
                            </div>
                          ))}
                          
                          {/* Add More Placeholder */}
                          <label className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all">
                            <Plus className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 text-center px-2">Add Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) addCarouselImage(file);
                              }}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Image Count Info */}
                      <div className="mt-4 text-sm text-gray-500">
                        Total: {carouselData[activeCarouselTab]?.length || 0} images
                      </div>
                    </div>
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
                    {/* Navigation Menu */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-black mb-1">Navigation Menu</h3>
                      <p className="text-gray-500 text-sm mb-4">Edit navigation menu items</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "home", label: "Home" },
                          { key: "pricing", label: "Pricing" },
                          { key: "features", label: "Features" },
                          { key: "faq", label: "FAQ" },
                          { key: "contact", label: "Contact" },
                          { key: "blog", label: "Blog" },
                          { key: "iptvReseller", label: "IPTV Reseller" },
                        ].map((item) => (
                          <div key={item.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              {item.label}
                            </label>
                            <input
                              type="text"
                              value={getValue(`common.${item.key}`)}
                              onChange={(e) => updateValue(`common.${item.key}`, e.target.value)}
                              placeholder={item.label}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        ))}
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

"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle, Settings, Globe, Mail, MessageCircle } from "lucide-react";

type SettingsData = {
  baseUrl: string;
  contactEmail: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    baseUrl: "",
    contactEmail: "",
    whatsappNumber: "",
    whatsappMessage: "",
  });
  const [originalSettings, setOriginalSettings] = useState<SettingsData>(settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sha, setSha] = useState<string>("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Try to load from .env.local or create default
      const envPath = ".env.local";
      let envContent = "";

      try {
        const response = await fetch("/api/admin/github/read-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: envPath }),
        });

        if (response.ok) {
          const data = await response.json();
          envContent = data.content;
          setSha(data.sha);
        }
      } catch {
        // File might not exist, that's okay
      }

      // Parse environment variables
      const lines = envContent.split("\n");
      const parsed: Partial<SettingsData> = {};

      lines.forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, "");
          
          if (key === "NEXT_PUBLIC_BASE_URL") parsed.baseUrl = value;
          if (key === "NEXT_PUBLIC_CONTACT_EMAIL") parsed.contactEmail = value;
          if (key === "NEXT_PUBLIC_WHATSAPP_NUMBER") parsed.whatsappNumber = value;
          if (key === "NEXT_PUBLIC_WHATSAPP_MESSAGE") parsed.whatsappMessage = value;
        }
      });

      const loadedSettings: SettingsData = {
        baseUrl: parsed.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "",
        contactEmail: parsed.contactEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
        whatsappNumber: parsed.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
        whatsappMessage: parsed.whatsappMessage || process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "",
      };

      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);
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
      const envPath = ".env.local";
      
      // Build .env.local content
      const envContent = `NEXT_PUBLIC_BASE_URL="${settings.baseUrl}"
NEXT_PUBLIC_CONTACT_EMAIL="${settings.contactEmail}"
NEXT_PUBLIC_WHATSAPP_NUMBER="${settings.whatsappNumber}"
NEXT_PUBLIC_WHATSAPP_MESSAGE="${settings.whatsappMessage}"
`;

      const response = await fetch("/api/admin/github/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: envPath,
          content: envContent,
          sha: sha || undefined,
          message: "Update website settings",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Settings saved! Note: Environment variables require Vercel dashboard update for immediate effect.",
        });
        setOriginalSettings(settings);
        if (data.content?.sha) {
          setSha(data.content.sha);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Website Settings
            </h1>
            <p className="text-[#1a1a1a]/70">Configure website settings and environment variables</p>
          </div>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
              <Globe className="w-4 h-4" />
              Base URL
            </label>
            <input
              type="url"
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none"
              placeholder="https://yourdomain.com"
            />
            <p className="text-xs text-[#1a1a1a]/70 mt-1">Your website's base URL for SEO and metadata</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
              <Mail className="w-4 h-4" />
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none"
              placeholder="info@yourdomain.com"
            />
            <p className="text-xs text-[#1a1a1a]/70 mt-1">Email address for contact forms and footer</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Number
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none"
              placeholder="1234567890"
            />
            <p className="text-xs text-[#1a1a1a]/70 mt-1">WhatsApp number (country code + number, no + sign)</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Default Message
            </label>
            <textarea
              value={settings.whatsappMessage}
              onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2563eb] focus:outline-none resize-y min-h-[80px]"
              placeholder="Hello! I'm interested in your IPTV service."
            />
            <p className="text-xs text-[#1a1a1a]/70 mt-1">Default message when users click WhatsApp button</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#1a1a1a] mb-2">Important Notes</h3>
        <ul className="space-y-2 text-sm text-[#1a1a1a]/70">
          <li>• Environment variables saved here will be committed to GitHub</li>
          <li>• For security, sensitive values should be set in Vercel dashboard</li>
          <li>• After saving, changes will auto-deploy via Vercel</li>
          <li>• Some settings may require Vercel environment variable update for immediate effect</li>
        </ul>
      </div>
    </div>
  );
}


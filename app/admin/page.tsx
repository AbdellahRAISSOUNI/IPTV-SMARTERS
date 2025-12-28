"use client";

import { useEffect, useState } from "react";
import { Languages, Settings, GitBranch, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    translations: { total: 0, updated: 0 },
    github: { connected: false, repo: "" },
  });

  useEffect(() => {
    // Check GitHub connection
    const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || "";
    setStats({
      translations: { total: 3, updated: 0 }, // en, es, fr
      github: { connected: !!githubRepo, repo: githubRepo },
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Admin Dashboard</h1>
        <p className="text-[#1a1a1a]/70">Manage your website content and settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Languages className="w-6 h-6 text-[#2563eb]" />
            </div>
            <Link
              href="/admin/translations"
              className="text-sm text-[#2563eb] hover:underline"
            >
              Manage →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-1">
            {stats.translations.total}
          </h3>
          <p className="text-sm text-[#1a1a1a]/70">Languages</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <GitBranch className="w-6 h-6 text-green-600" />
            </div>
            {stats.github.connected ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">
            {stats.github.connected ? "Connected" : "Not Connected"}
          </h3>
          <p className="text-sm text-[#1a1a1a]/70">
            {stats.github.repo || "GitHub Repository"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <Link
              href="/admin/settings"
              className="text-sm text-[#2563eb] hover:underline"
            >
              Configure →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-1">Settings</h3>
          <p className="text-sm text-[#1a1a1a]/70">Website Configuration</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/translations"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2563eb] hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-[#2563eb]" />
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">Edit Translations</h3>
                <p className="text-sm text-[#1a1a1a]/70">Update content in all languages</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2563eb] hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#2563eb]" />
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">Configure Settings</h3>
                <p className="text-sm text-[#1a1a1a]/70">Update website settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#1a1a1a] mb-2">How it works</h3>
        <ul className="space-y-2 text-sm text-[#1a1a1a]/70">
          <li>• Make changes to translations or settings</li>
          <li>• Click "Save Changes" to commit to GitHub</li>
          <li>• Changes automatically deploy to Vercel</li>
          <li>• Your website updates within minutes</li>
        </ul>
      </div>
    </div>
  );
}


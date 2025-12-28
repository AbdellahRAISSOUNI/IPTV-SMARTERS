"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Settings, Languages, LogOut, FileText, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication
    fetch("/api/admin/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        }
      })
      .catch(() => {
        setAuthenticated(false);
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p className="text-[#1a1a1a]/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/translations", label: "Translations", icon: Languages },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Admin Panel</h1>
          <p className="text-sm text-[#1a1a1a]/70 mt-1">IPTV Smarters</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#2563eb] text-white"
                    : "text-[#1a1a1a]/70 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}


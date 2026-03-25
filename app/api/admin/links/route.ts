import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllLinks, updateLinksFile } from "@/lib/admin/links";

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await getAllLinks();
    return NextResponse.json(links);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { locale, content, sha } = await request.json();
    if (!locale || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateLinksFile(locale, content, sha || "");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update links" },
      { status: 500 }
    );
  }
}


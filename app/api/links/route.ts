import { NextRequest, NextResponse } from "next/server";
import { getLinksFile } from "@/lib/admin/links";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const links = await getLinksFile(locale);
    return NextResponse.json(links.content);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch links" },
      { status: 500 }
    );
  }
}


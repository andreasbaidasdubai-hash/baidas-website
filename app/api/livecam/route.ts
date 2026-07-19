// Live construction-cam proxy: bau-cam.ch serves the current frame under a
// timestamped filename that changes each capture. This route scrapes the
// current filename from live.php and streams the latest image back same-origin,
// so the front-end can show it full-bleed and refresh it on an interval.

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://bau-cam.ch/dba02/";

export async function GET() {
  try {
    const page = await fetch(BASE + "live.php", { cache: "no-store" });
    const html = await page.text();
    const m = html.match(/<img[^>]+src=["']([^"']*bilder\/[^"']+\.jpg)["']/i);
    if (!m) return new Response("live image not found", { status: 502 });

    const imgUrl = new URL(m[1], BASE).toString();
    const img = await fetch(imgUrl, { cache: "no-store" });
    if (!img.ok) return new Response("upstream image error", { status: 502 });

    const buf = await img.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": img.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new Response("live cam unavailable", { status: 502 });
  }
}

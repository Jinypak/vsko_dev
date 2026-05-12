import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getDocPage } from "@/lib/actions/docs";
import DocEditor from "@/components/DocEditor";
import { DOCS_META } from "@/lib/docs-meta";

export default async function DocEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = DOCS_META[slug];
  const saved = await getDocPage(slug);

  const title = meta?.title ?? slug;

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* 브레드크럼 */}
      <div className="border-b bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 h-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/docs" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronLeft className="size-3.5" />
            문서 목록
          </Link>
          {meta && (
            <>
              <span>/</span>
              <span className="text-muted-foreground/60">{meta.product}</span>
              <span>/</span>
              <span className="text-muted-foreground/60">{meta.subcategory}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium">{title}</span>
        </div>
      </div>

      {/* 제목 */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {saved?.updated_at && (
            <p className="text-xs text-muted-foreground mt-1">
              마지막 수정: {new Date(saved.updated_at).toLocaleString("ko-KR")}
            </p>
          )}
        </div>
      </div>

      {/* 에디터 */}
      <div className="flex-1">
        <DocEditor
          slug={slug}
          title={title}
          initialContent={saved?.content ?? ""}
        />
      </div>
    </div>
  );
}

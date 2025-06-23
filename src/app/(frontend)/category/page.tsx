import ListPage from "./listPage";

export default async function BlogPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | undefined }>;
}) {
  const { view } = await searchParams; // Default: "grid"
  const viewMode = view === "list" ? "list" : "grid"; // Default: "grid"

  return <ListPage viewMode={viewMode} />;
}

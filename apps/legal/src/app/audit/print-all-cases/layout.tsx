export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return just the children without NavigationBar
  return <>{children}</>;
}

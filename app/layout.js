export const metadata = {
    title: "Website Audit | America's Keswick | Online Nexus Marketing",
    description: "Full website audit report for americaskeswick.org",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }) {
    return (
          <html lang="en">
            <body style={{ margin: 0, padding: 0, background: "#000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
{children}
</body>
  </html>
  );
}

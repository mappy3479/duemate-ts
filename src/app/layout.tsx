// レイアウト作成
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body>
                {/* Layout UI */}
                {/* Place children where you want to render a page or nested layout */}
                <main>{children}</main>
            </body>
        </html>
    )
}
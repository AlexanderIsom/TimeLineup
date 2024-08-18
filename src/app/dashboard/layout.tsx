import DashboardNav from "@/components/dashboard/sideNav"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section className="grid h-full grid-cols-[auto_minmax(900px,_1fr)]">
			<DashboardNav />

			{children}
		</section>
	)
}
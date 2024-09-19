import CreateEvent from "@/components/dashboard/createEvent"
import DashboardNav from "@/components/dashboard/dashboardNav"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode,
}) {
	return (
		<section className="grid h-full grid-cols-[auto_minmax(400px,_1fr)]">
			<DashboardNav />
			<div className="min-w-full col-start-2 col-end-3">
				{children}
			</div>
			<CreateEvent />
		</section>
	)
}
export default function Loading() {
	return (
		<div className="flex max-h-full grow flex-col overflow-hidden">
			<div className="grid max-h-full grow grid-rows-[75px_minmax(0,1fr)] overflow-hidden md:grid-cols-[1fr_4fr]">
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 flex items-end overflow-hidden border-l border-gray-300">
					<div className={"h-1/2 w-full self-end border-t border-gray-300"}></div>
				</div>
				<div
					className={`col-start-1 col-end-2 row-start-2 row-end-3 flex min-h-full min-w-fit flex-col items-center overflow-hidden border-t border-gray-300`}
				></div>
				<div className="col-start-2 col-end-2 row-start-2 row-end-3 border-l border-gray-300"></div>
			</div>
		</div>
	);
}

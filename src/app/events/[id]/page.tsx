export default function Events({ params }: { params: { id: number } }) {
	return (<>
		<div>hello</div>
		<div>{params.id}</div>
	</>
	)
}
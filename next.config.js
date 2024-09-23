/** @type {import('next').NextConfig} */

module.exports = {
	async redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/dashboard/events",
				permanent: true,
			},
		];
	},
	images: {},
};

"use client";

import { OverlayScrollbarsComponent, OverlayScrollbarsComponentProps } from "overlayscrollbars-react";
export default function ScrollbarWrapper(props: OverlayScrollbarsComponentProps) {
	return <OverlayScrollbarsComponent {...props}>{props.children}</OverlayScrollbarsComponent>;
}

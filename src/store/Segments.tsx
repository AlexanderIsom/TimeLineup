import { array } from "zod";
import { create } from "zustand";

export interface TimeSegment {
	id: string,
	start: Date,
	end: Date
}

interface SegmentState {
	segments: Array<TimeSegment>,
	newSegments: Array<TimeSegment>,
	updatedSegments: Array<TimeSegment>,
	deletedSegments: Array<string>
	addSegment: (segment: TimeSegment) => void;
	updateSegment: (segment: TimeSegment) => void;
	deleteSegment: (segmentId: string) => void;
	setSegments: (segments: Array<TimeSegment>) => void;
}

export const useSegmentStore = create<SegmentState>()((set, get) => ({
	segments: [],
	newSegments: [],
	updatedSegments: [],
	deletedSegments: [],
	addSegment: (segment: TimeSegment) =>
		set((state) => ({
			segments: [...state.segments, segment],
			newSegments: [...state.newSegments, segment],
		})),
	updateSegment: (segment: TimeSegment) =>
		set((state) => {
			const updatedSegments = state.segments.map((s) =>
				s.id === segment.id ? segment : s
			);
			const isNew = state.newSegments.some((s) => s.id === segment.id);
			const updatedNewSegments = isNew
				? state.newSegments.map((s) => (s.id === segment.id ? segment : s))
				: state.newSegments;

			return {
				segments: updatedSegments,
				newSegments: updatedNewSegments,
				updatedSegments: isNew
					? state.updatedSegments
					: [...state.updatedSegments, segment],
			};
		}),
	deleteSegment: (segmentId: string) =>
		set((state) => {
			const isNew = state.newSegments.some((s) => s.id === segmentId);
			const updatedNewSegments = state.newSegments.filter(
				(s) => s.id !== segmentId
			);
			const updatedSegments = state.segments.filter((s) => s.id !== segmentId);
			const updatedUpdatedSegments = state.updatedSegments.filter((s) => s.id !== segmentId);

			return {
				segments: updatedSegments,
				newSegments: updatedNewSegments,
				updatedSegments: updatedUpdatedSegments,
				deletedSegments: isNew
					? state.deletedSegments
					: [...state.deletedSegments, segmentId],
			};
		}),
	setSegments: (segments: Array<TimeSegment>) => {
		set(() => {
			return { segments: segments, newSegments: [], deleteSegments: [], updatedSegments: [] }
		})
	},
}))
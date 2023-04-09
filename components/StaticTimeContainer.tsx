import { EventResponse } from "types/Events";
import { TimelineUtils } from 'utils/TimelineUtils'
import styles from "styles/Components/TimelineContainer.module.scss"
import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { format, roundToNearestMinutes } from "date-fns";

interface Props {
    event: EventResponse
    timeline: TimelineUtils
}

export default function StaticTimeContainer({ event, timeline }: Props) {

    const [startTime, setStartTime] = useState(new Date(event.startDateTime))
    const [endTime, setEndTime] = useState(new Date(event.endDateTime))


    return (
        <div className={styles.container}>
            <Draggable
                axis='none'
                position={{ x: timeline.toX(startTime), y: 0 }}
                disabled={true}
            >
                <ResizableBox
                    className='container'
                    width={timeline.toX(endTime) - timeline.toX(startTime)}
                    resizeHandles={[]}
                    height={50}
                >
                    <div className={styles.timeContainer} style={{ padding: "20px" }}>
                        <div className={styles.timeCue}>
                            {format(
                                roundToNearestMinutes(startTime, { nearestTo: 15 }),
                                'HH:mm'
                            )}
                        </div>
                        <div className={styles.timeCue}>
                            {format(
                                roundToNearestMinutes(endTime, { nearestTo: 15 }),
                                'HH:mm'
                            )}
                        </div>
                    </div>

                </ResizableBox>
            </Draggable>
        </div>
    )
}
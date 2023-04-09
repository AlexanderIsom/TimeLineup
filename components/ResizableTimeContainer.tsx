import { EventResponse } from 'types/Events'
import { SyntheticEvent, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'
import { TimelineUtils } from 'utils/TimelineUtils'
import {
  addSeconds,
  differenceInSeconds,
  format,
  roundToNearestMinutes,
} from 'date-fns'
import styles from 'styles/Components/TimelineContainer.module.scss'
interface Props {
  event: EventResponse
  timeline: TimelineUtils
  updateHandler: (id: string, start: Date, end: Date) => void
}

export default function ResizableTimeContainer({
  event,
  timeline,
  updateHandler,
}: Props) {
  const cellHeight = 50
  const [startTime, setStartTime] = useState(new Date(event.startDateTime))
  const [endTime, setEndTime] = useState(new Date(event.endDateTime))

  const startX = timeline.toX(startTime)
  const endX = timeline.toX(endTime)

  const [duration, setDuration] = useState(
    differenceInSeconds(endTime, startTime)
  )

  const onResize = (
    e: SyntheticEvent,
    { node, size, handle }: ResizeCallbackData
  ) => {
    const newSize = size.width
    let newStartTime = startTime
    let newEndTime = endTime

    if (handle === 'w') {
      newStartTime = timeline.toDate(startX + (endX - startX - newSize))
      setStartTime(newStartTime)
    }

    if (handle === 'e') {
      newEndTime = timeline.toDate(startX + newSize)
      setEndTime(newEndTime)
    }
  }

  const onResizeStop = (
    e: SyntheticEvent,
    { node, size, handle }: ResizeCallbackData
  ) => {
    const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
    const newEndTime = roundToNearestMinutes(endTime, { nearestTo: 15 })
    setStartTime(newStartTime)
    setEndTime(newEndTime)
    setDuration(differenceInSeconds(newEndTime, newStartTime))
    updateHandler(event.id, newStartTime, newEndTime)
  }

  const onDrag = (e: DraggableEvent, ui: DraggableData) => {
    const newStartTime = timeline.toDate(ui.x)
    const newEndTime = addSeconds(newStartTime, duration)
    setStartTime(newStartTime)
    setEndTime(newEndTime)
  }

  const onDragStopped = (e: DraggableEvent, ui: DraggableData) => {
    const newStartTime = roundToNearestMinutes(startTime, { nearestTo: 15 })
    setStartTime(newStartTime)
    setEndTime(addSeconds(newStartTime, duration))
    updateHandler(event.id, startTime, endTime)
  }

  return (
    <div className={styles.container}>
      <Draggable
        handle='.dragHandle'
        axis='x'
        position={{ x: startX, y: 0 }}
        onDrag={onDrag}
        onStop={onDragStopped}
      >
        <ResizableBox
          className='container'
          width={endX - startX}
          height={cellHeight}
          resizeHandles={['e', 'w']}
          onResize={onResize}
          onResizeStop={onResizeStop}
        >
          <div className='dragHandle'>
            <div className={styles.timeContainer}>
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
          </div>
        </ResizableBox>
      </Draggable>
    </div>
  )
}

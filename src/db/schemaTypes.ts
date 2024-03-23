import { InferQueryModel } from "./schemaInferModel";


export type EventWithRsvpAndUser = InferQueryModel<'events', { id: true, invitedUsers: true, start: true, end: true, title: true, description: true }, { host: true }>
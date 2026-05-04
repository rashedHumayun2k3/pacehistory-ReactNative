import React from "react";
import { IEvent } from "../../types/event/eventType.interface";
import EventSummery from "./EventSummery";

interface EventProps {
  event: IEvent;
  onPress?: (event: IEvent) => void;
}

const EventCard2: React.FC<EventProps> = ({ event, onPress }) => {
  return <EventSummery event={event} onPress={onPress} />;
};

export default EventCard2;

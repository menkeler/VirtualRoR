import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import client from "../../api/client";
const localizer = momentLocalizer(moment);

const CalendarInquiry = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await client.get("transactions/inquiries/accepted_donation_inquiries/");
                const transformedEvents = response.data.map(item => ({
                    id: item.id,
                    title: item.message,
                    start: new Date(item.date_preferred),
                    type:  item.inquiry_type,
                    end: new Date(item.date_preferred), // Assuming the event has no end time
                    description: item.reply,

                }));
                setEvents(transformedEvents);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
    };

    return (
        <div style={{ background: 'white' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleSelectEvent}
            />
            {selectedEvent && showModal && (
                <dialog open id="event_details" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Title: {selectedEvent.title}</h3>
                        <p className="py-4">Type:{selectedEvent.type}</p>
                        <p className="py-4">Officer Reply: {selectedEvent.description}</p>
                        
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default CalendarInquiry;

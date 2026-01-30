import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Tooltip } from "bootstrap";
import { fetchAuthActivities } from "../../api/activities-api";
import { formatTime, getCalendarMethodDetails } from "./FunctionHelper";

export default function TrackYourActivityView() {

    // STATE VARIABLES
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        document.title = "Track Your Activity | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const response = await fetchAuthActivities();

            const calendarEvents = (response.data.content || []).map((activityLog) => ({
                id: activityLog.actionLogId,
                title: formatTime(activityLog.actionLogCreatedAt),
                start: activityLog.actionLogCreatedAt,
                allDay: false,
                extendedProps: {
                    method: activityLog.actionLogMethod,
                    description: activityLog.actionLogMessage
                }
            }));

            setEvents(calendarEvents);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch activities");
        } finally {
            setLoading(false);
        }
    };

    const refreshCalendar = () => {
        setLoading(true);
        loadActivities();
    };

    return (
        <DashboardLayout>
            <main id="main" className="main">
                <div className="pagetitle d-flex justify-content-between align-items-center">
                    <h1 className="toggle-heading">Track Your Activity</h1>
                    <button className="btn btn-secondary" onClick={refreshCalendar} disabled={loading}>
                        <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                        Refresh
                    </button>
                </div>

                <div className="card shadow-sm mt-3">
                    <div className="card-body p-0">
                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin
                            ]}
                            initialView="dayGridMonth"
                            height={650}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right:
                                    "dayGridYear,dayGridMonth,timeGridWeek,timeGridDay"
                            }}
                            views={{
                                dayGridYear: {
                                    type: "dayGrid",
                                    duration: { years: 1 },
                                    buttonText: "Year"
                                }
                            }}
                            events={events}
                            eventContent={renderEventContent}
                            eventTimeFormat={{
                                hour: "numeric",
                                minute: "2-digit",
                                meridiem: "short"
                            }}
                            eventDidMount={(info) => {
                                if (
                                    info.event.extendedProps
                                        .description
                                ) {
                                    new Tooltip(info.el, {
                                        title:
                                            info.event
                                                .extendedProps
                                                .description,
                                        placement: "top",
                                        trigger: "hover",
                                        container: "body"
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}

function renderEventContent(eventInfo) {
    const { method } = eventInfo.event.extendedProps;

    return (
        <div className="fc-event-custom">
            <div className="d-flex align-items-center gap-1">
                {getCalendarMethodDetails(method)}
                <span className="fc-event-title text-truncate">
                    {eventInfo.event.title}
                </span>
            </div>
        </div>
    );
}

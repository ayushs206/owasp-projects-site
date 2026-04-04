import { Routes, Route } from "react-router-dom"
import { HomeSite } from "@/pages/Home"
import ScheduleView from "@/pages/ScheduleView"
import FreeSlotsView from "@/pages/FreeSlotsView"
import CalendarCallback from "@/pages/CalendarCallback"
import NotFound from "@/pages/NotFound"

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomeSite />} />
            <Route path="/schedule" element={<ScheduleView />} />
            <Route path="/freeslots" element={<FreeSlotsView />} />
            <Route path="/calendar" element={<CalendarCallback />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
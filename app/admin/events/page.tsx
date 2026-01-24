// // app/admin/events/page.tsx
// import { prisma } from "@/lib/prisma";
// import { finishEvent, deleteEvent } from "@/app/actions/admin";
// import Link from "next/link";
// import {
//   Plus,
//   Calendar,
//   MapPin,
//   Users,
//   Trash2,
//   Edit,
//   BarChart3,
//   Clock,
//   CheckCircle,
//   Check,
// } from "lucide-react";

// export default async function AdminEventsPage() {
//   const allEvents = await prisma.event.findMany({
//     orderBy: { date: "asc" },
//     include: {
//       _count: { select: { registrations: true } },
//     },
//   });

//   const upcomingEvents = allEvents.filter((e) => e.status !== "COMPLETED");
//   const completedEvents = allEvents.filter((e) => e.status === "COMPLETED");
//   const now = new Date(); // Get current time for comparison

//   return (
//     <div className="max-w-7xl mx-auto p-8 space-y-12">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">
//             Event Management
//           </h1>
//           <p className="text-slate-500 font-medium mt-1">
//             Create, edit, and track your events.
//           </p>
//         </div>
//         <Link
//           href="/admin/events/new"
//           className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200"
//         >
//           <Plus size={20} /> Create Event
//         </Link>
//       </div>

//       {/* === SECTION 1: UPCOMING EVENTS === */}
//       <section>
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
//             <Clock size={24} />
//           </div>
//           <h2 className="text-xl font-extrabold text-slate-700">
//             Upcoming Events
//           </h2>
//           <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
//             {upcomingEvents.length}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 gap-4">
//           {upcomingEvents.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
//               <p className="text-slate-400 font-bold">
//                 No upcoming events scheduled.
//               </p>
//             </div>
//           ) : (
//             upcomingEvents.map((event) => {
//               const fillPercent = Math.round(
//                 (event._count.registrations / event.capacity) * 100,
//               );
//               const hasStarted = now >= event.date; // Check if event has started

//               return (
//                 <div
//                   key={event.id}
//                   className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:shadow-md transition group"
//                 >
//                   {/* Date Box */}
//                   <div className="bg-slate-50 p-4 rounded-xl text-center min-w-[80px] border border-slate-100">
//                     <div className="text-xs font-bold text-slate-400 uppercase">
//                       {new Date(event.date).toLocaleString("default", {
//                         month: "short",
//                       })}
//                     </div>
//                     <div className="text-2xl font-black text-slate-700">
//                       {new Date(event.date).getDate()}
//                     </div>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-1">
//                       <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
//                         {event.title}
//                       </h3>
//                       <span
//                         className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${event.type.includes("Work") ? "bg-purple-100 text-purple-600" : "bg-emerald-100 text-emerald-600"}`}
//                       >
//                         {event.type}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
//                       <span className="flex items-center gap-1">
//                         <MapPin size={14} /> {event.location}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Users size={14} /> {event.capacity} Max
//                       </span>
//                     </div>
//                   </div>

//                   {/* Stats Mini */}
//                   <div className="w-full lg:w-48">
//                     <div className="flex justify-between text-xs font-bold mb-1">
//                       <span className="text-slate-400">Registrations</span>
//                       <span className="text-indigo-600">
//                         {event._count.registrations}/{event.capacity}
//                       </span>
//                     </div>
//                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-indigo-500 rounded-full"
//                         style={{ width: `${fillPercent}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 mt-2 lg:mt-0 border-slate-100">
//                     <Link
//                       href={`/admin/events/${event.id}`}
//                       className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                       title="View Stats"
//                     >
//                       <BarChart3 size={20} />
//                     </Link>
//                     <Link
//                       href={`/admin/events/${event.id}/edit`}
//                       className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
//                       title="Edit"
//                     >
//                       <Edit size={20} />
//                     </Link>

//                     {/* FINISH BUTTON - Only shows if event has started */}
//                     {hasStarted && (
//                       <form
//                         action={async () => {
//                           "use server";
//                           await finishEvent(event.id);
//                         }}
//                       >
//                         <button
//                           className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
//                           title="Mark Completed"
//                         >
//                           <Check size={20} strokeWidth={3} />
//                         </button>
//                       </form>
//                     )}

//                     <form
//                       action={async () => {
//                         "use server";
//                         await deleteEvent(event.id);
//                       }}
//                     >
//                       <button
//                         className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
//                         title="Delete"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </section>

//       {/* === SECTION 2: COMPLETED EVENTS (Unchanged) === */}
//       <section className="opacity-75 hover:opacity-100 transition-opacity">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
//             <CheckCircle size={24} />
//           </div>
//           <h2 className="text-xl font-extrabold text-slate-700">
//             Completed Events
//           </h2>
//           <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
//             {completedEvents.length}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 gap-4">
//           {completedEvents.length === 0 ? (
//             <p className="text-slate-400 font-medium text-sm italic ml-2">
//               No past events yet.
//             </p>
//           ) : (
//             completedEvents.map((event) => (
//               <div
//                 key={event.id}
//                 className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center gap-6 grayscale-[0.5] hover:grayscale-0 transition"
//               >
//                 <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
//                   <CheckCircle size={24} />
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="font-bold text-lg text-slate-600">
//                     {event.title}
//                   </h3>
//                   <div className="flex gap-4 text-sm text-slate-400 font-medium">
//                     <span>
//                       Ended on {new Date(event.date).toLocaleDateString()}
//                     </span>
//                     <span>•</span>
//                     <span>{event._count.registrations} Attendees</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black uppercase rounded-lg">
//                     Completed
//                   </span>
//                   <form
//                     action={async () => {
//                       "use server";
//                       await deleteEvent(event.id);
//                     }}
//                   >
//                     <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
//                       <Trash2 size={20} />
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

import { prisma } from "@/lib/prisma";
import { finishEvent, deleteEvent } from "@/app/actions/admin";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Trash2,
  Edit,
  BarChart3,
  Clock,
  CheckCircle,
  Check,
} from "lucide-react";
import EventSearch from "./EventSearch"; // Import the new component

export default async function AdminEventsPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  // 1. Fetch filtered events
  const allEvents = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { location: { contains: query } },
        // You can add description if you want deep search:
        // { description: { contains: query } }
      ],
    },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  // 2. Split into groups
  const upcomingEvents = allEvents.filter((e) => e.status !== "COMPLETED");
  const completedEvents = allEvents.filter((e) => e.status === "COMPLETED");
  const now = new Date();

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Event Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Create, edit, and track your events.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* SEARCH BOX */}
          <EventSearch />

          <Link
            href="/admin/events/new"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            <Plus size={20} /> Create Event
          </Link>
        </div>
      </div>

      {/* === SECTION 1: UPCOMING EVENTS === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Clock size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-700">
            Upcoming Events
          </h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
            {upcomingEvents.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">
                {query
                  ? `No events found matching "${query}"`
                  : "No upcoming events scheduled."}
              </p>
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const fillPercent = Math.round(
                (event._count.registrations / event.capacity) * 100,
              );
              const hasStarted = now >= event.date;

              return (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:shadow-md transition group"
                >
                  {/* Date Box */}
                  <div className="bg-slate-50 p-4 rounded-xl text-center min-w-[80px] border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(event.date).toLocaleString("default", {
                        month: "short",
                      })}
                    </div>
                    <div className="text-2xl font-black text-slate-700">
                      {new Date(event.date).getDate()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${event.type.includes("Work") ? "bg-purple-100 text-purple-600" : "bg-emerald-100 text-emerald-600"}`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {event.capacity} Max
                      </span>
                    </div>
                  </div>

                  {/* Stats Mini */}
                  <div className="w-full lg:w-48">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-400">Registrations</span>
                      <span className="text-indigo-600">
                        {event._count.registrations}/{event.capacity}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${fillPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 mt-2 lg:mt-0 border-slate-100">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View Stats"
                    >
                      <BarChart3 size={20} />
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </Link>

                    {/* FINISH BUTTON */}
                    {hasStarted && (
                      <form
                        action={async () => {
                          "use server";
                          await finishEvent(event.id);
                        }}
                      >
                        <button
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Mark Completed"
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                      </form>
                    )}

                    <form
                      action={async () => {
                        "use server";
                        await deleteEvent(event.id);
                      }}
                    >
                      <button
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* === SECTION 2: COMPLETED EVENTS === */}
      <section className="opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-700">
            Completed Events
          </h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
            {completedEvents.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {completedEvents.length === 0 ? (
            <p className="text-slate-400 font-medium text-sm italic ml-2">
              {query
                ? "No completed events match your search."
                : "No past events yet."}
            </p>
          ) : (
            completedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center gap-6 grayscale-[0.5] hover:grayscale-0 transition"
              >
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                  <CheckCircle size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-600">
                    {event.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-400 font-medium">
                    <span>
                      Ended on {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{event._count.registrations} Attendees</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black uppercase rounded-lg">
                    Completed
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await deleteEvent(event.id);
                    }}
                  >
                    <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
                      <Trash2 size={20} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

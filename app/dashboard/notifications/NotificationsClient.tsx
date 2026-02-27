"use client";

import { useState } from "react";
import { markNotificationAsRead } from "@/app/actions";
import {
  Bell,
  Calendar,
  Trophy,
  AlertCircle,
  ExternalLink,
  Clock,
  Building2,
  Search,
  Filter,
  X,
  ChevronRight,
} from "lucide-react";

export default function NotificationsClient({
  initialNotifications,
}: {
  initialNotifications: any[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // NEW: Store the selected notification for the Modal instead of expanding inline
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const parseNotification = (notif: any) => {
    let senderName = "Castpotro System";
    let displayTitle = notif.title;
    let Icon = AlertCircle;
    let iconColor = "text-slate-500 bg-slate-100 border-slate-200";

    // 1. Set the default icon and colors based on type
    if (notif.type === "EVENT") {
      senderName = "Castpotro Events";
      Icon = Calendar;
      iconColor = "text-purple-600 bg-purple-50 border-purple-100";
    } else if (notif.type === "ACHIEVEMENT" || notif.type === "QUEST") {
      senderName = "Castpotro Quests";
      Icon = Trophy;
      iconColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
    } else if (notif.type === "JOB") {
      senderName = "Castpotro Careers";
      Icon = Building2;
      iconColor = "text-blue-600 bg-blue-50 border-blue-100";
    }

    // 2. Universal check for the '::' delimiter (Applies to Jobs, Quests, and Events)
    if (notif.title?.includes("::")) {
      const parts = notif.title.split("::");
      senderName = parts[0]; // e.g., "Software Engineer at Google"
      displayTitle = parts[1]; // e.g., "Application Submitted"
    }
    // Fallback for older legacy job notifications using the '|' character
    else if (notif.title?.includes("|")) {
      const parts = notif.title.split("|");
      senderName = parts[0];
      displayTitle = parts[1];
      Icon = Building2;
      iconColor = "text-blue-600 bg-blue-50 border-blue-100";
    }

    return { senderName, displayTitle, Icon, iconColor };
  };

  const handleCardClick = async (notif: any) => {
    setSelectedNotif(notif); // Open the modal

    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
    }
  };

  // NEW LOGIC: Bulletproof Filter and Search
  const filteredNotifications = notifications.filter((notif) => {
    const { senderName, displayTitle } = parseNotification(notif);
    const query = searchQuery.trim().toLowerCase();

    // 1. Text Search Match (Safe against null/undefined values)
    const matchesSearch =
      (senderName || "").toLowerCase().includes(query) ||
      (displayTitle || "").toLowerCase().includes(query) ||
      (notif.message || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // 2. Category Filter Match
    switch (activeFilter) {
      case "JOBS":
        // Match the new JOB type AND older legacy notifications using '|'
        return notif.type === "JOB" || (notif.title || "").includes("|");
      case "QUESTS":
        return (
          (notif.type === "ACHIEVEMENT" || notif.type === "QUEST") &&
          !(notif.title || "").includes("|")
        );
      case "EVENTS":
        return notif.type === "EVENT" && !(notif.title || "").includes("|");
      default:
        return true; // "ALL"
    }
  });

  const filters = [
    { id: "ALL", label: "All" },
    { id: "JOBS", label: "Jobs" },
    { id: "QUESTS", label: "Quests" },
    { id: "EVENTS", label: "Events" },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* SEARCH & FILTER HEADER */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search companies, roles, or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm text-slate-700"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 text-slate-400 pr-2 border-r border-slate-200">
            <Filter size={16} />
          </div>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATION LIST (Now consistently sized) */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Bell size={24} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-slate-700">
            No Results Found
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notif) => {
            const { senderName, displayTitle, Icon, iconColor } =
              parseNotification(notif);

            return (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  notif.isRead
                    ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                    : "bg-blue-50/30 border-blue-200 shadow-sm ring-2 ring-blue-50 hover:bg-blue-50"
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-sm md:hidden"></div>
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`hidden sm:flex shrink-0 w-10 h-10 rounded-xl border items-center justify-center ${iconColor}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <div className="hidden md:block w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                      )}
                      <span
                        className={`text-sm uppercase tracking-wider truncate ${notif.isRead ? "font-bold text-slate-600" : "font-black text-slate-900"}`}
                      >
                        {senderName}
                      </span>
                    </div>

                    <h3
                      className={`text-xs mt-0.5 truncate ${notif.isRead ? "font-medium text-slate-500" : "font-bold text-slate-700"}`}
                    >
                      {displayTitle}
                    </h3>
                  </div>

                  {/* Right side arrow to indicate clickability */}
                  <div className="flex items-center gap-4 shrink-0 pr-6 md:pr-2">
                    <span className="hidden md:flex text-[11px] font-bold text-slate-400 items-center gap-1.5">
                      <Clock size={12} />
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* THE MODAL (Pop-up for full message) */}
      {selectedNotif && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${parseNotification(selectedNotif).iconColor}`}
                  >
                    {(() => {
                      const { Icon } = parseNotification(selectedNotif);
                      return <Icon size={24} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-black text-slate-900 text-lg">
                      {parseNotification(selectedNotif).senderName}
                    </h2>
                    <p className="font-bold text-slate-500 text-sm">
                      {parseNotification(selectedNotif).displayTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable if too long) */}
              <div className="prose prose-slate max-w-none text-slate-600 font-medium text-[15px] leading-relaxed whitespace-pre-wrap bg-slate-50/80 p-5 rounded-xl border border-slate-100 mb-6 max-h-[50vh] overflow-y-auto">
                {selectedNotif.message}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(selectedNotif.createdAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  )}
                </span>

                {/* UPDATE THIS BLOCK: Only show link if it exists AND the type is NOT "QUEST" */}
                {selectedNotif.link && selectedNotif.type !== "QUEST" && (
                  <a
                    href={selectedNotif.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                  >
                    <ExternalLink size={16} /> Open Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

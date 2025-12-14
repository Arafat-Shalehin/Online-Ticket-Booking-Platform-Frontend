import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import useAuth from "../../../Hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

const perksOptions = [
  "AC",
  "Non-AC",
  "Breakfast",
  "Wi-Fi",
  "Sleeper",
  "Snacks",
];

const MyAddedTickets = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    ticketQuantity: "",
    departureDateTime: "",
    perks: [],
  });

  // 1) Fetch this vendor's tickets
  const {
    data: tickets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(
    ["vendorTickets", user?.email],
    `/tickets/vendor?email=${user?.email}`,
    {
      enabled: !!user?.email,
    }
  );

  // Loader Logic
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  // Mutations
  const { mutate: deleteTicket, isPending: isDeleting } = useApiMutation();
  const { mutate: updateTicket, isPending: isUpdating } = useApiMutation();

  // Delete Function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTicket(
          { url: `/tickets/${id}`, method: "delete" },
          {
            onSuccess: () => {
              console.log("OnSuccess");
              toast.success("Ticket has been deleted.");
              refetch();
            },
            onError: (err) => {
              console.error(err);
              alert("Failed to delete ticket. Please try again.");
            },
          }
        );
      }
    });
  };

  // Open modal
  const openEditModal = (ticket) => {
    // datetime-local needs "YYYY-MM-DDTHH:mm"
    const departureInputValue = ticket.departureDateTime
      ? ticket.departureDateTime.slice(0, 16)
      : "";

    setEditingTicket(ticket);
    setEditForm({
      title: ticket.title || "",
      from: ticket.from || "",
      to: ticket.to || "",
      transportType: ticket.transportType || "",
      price: ticket.price || "",
      ticketQuantity: ticket.ticketQuantity || "",
      departureDateTime: departureInputValue,
      perks: ticket.perks || [],
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePerkToggle = (perk) => {
    setEditForm((prev) => {
      const exists = prev.perks.includes(perk);
      return {
        ...prev,
        perks: exists
          ? prev.perks.filter((p) => p !== perk)
          : [...prev.perks, perk],
      };
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingTicket) return;

    const payload = {
      title: editForm.title,
      from: editForm.from,
      to: editForm.to,
      transportType: editForm.transportType,
      price: Number(editForm.price),
      ticketQuantity: Number(editForm.ticketQuantity),
      departureDateTime: new Date(editForm.departureDateTime).toISOString(),
      perks: editForm.perks,
    };

    updateTicket(
      { url: `/tickets/${editingTicket._id}`, method: "patch", body: payload },
      {
        onSuccess: () => {
          toast.success("You have successfully edited your tickets.");
          closeEditModal();
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to update ticket. Please try again."
          );
        },
      }
    );
  };

  // 3) Loading & error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Finding Your added Tickets..."
          subMessage="It may take a while..."
          progress={progress}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">
          Failed to load your added tickets.
        </p>
        <p className="text-sm text-slate-500 mb-4">
          {error?.message || "Something went wrong."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
            My Added Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage all tickets you have created. You can update or remove them
            anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Pending
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Approved
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Rejected
          </span>
        </div>
      </div>

      {/* Empty state */}
      {tickets.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-3xl">🚌</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No tickets added yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Start by adding your first ticket. Once approved by the admin, it
            will be visible to users on the platform.
          </p>
        </div>
      )}

      {/* Tickets grid */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const isRejected = ticket.verificationStatus === "rejected";
            const isApproved = ticket.verificationStatus === "approved";
            const statusClass =
              statusStyles[ticket.verificationStatus] || statusStyles.pending;

            return (
              <article
                key={ticket._id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Transport type badge */}
                  <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide bg-white/90 text-slate-700 shadow-sm">
                    {ticket.transportType}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusClass}`}
                  >
                    {ticket.verificationStatus}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1 line-clamp-2">
                    {ticket.title}
                  </h3>

                  {/* Route */}
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                    {ticket.from} → {ticket.to}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                    <span>
                      Price:{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        <strong>{ticket.price}</strong> ৳
                      </span>
                    </span>
                    <span>|</span>
                    <span>
                      Quantity:{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        <strong>
                          {ticket.ticketQuantity || ticket.quantity}
                        </strong>
                      </span>
                    </span>
                  </div>

                  {/* Departure */}
                  <p className="text-xs text-slate-500 mb-3">
                    Departure:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      <strong>
                        {ticket.departureDateTime || ticket.departureTime
                          ? new Date(
                              ticket.departureDateTime || ticket.departureTime
                            ).toLocaleString()
                          : "N/A"}
                      </strong>
                    </span>
                  </p>

                  {/* Perks */}
                  {ticket.perks && ticket.perks.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        Perks:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.perks.map((perk) => (
                          <span
                            key={perk}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(ticket)}
                    disabled={isRejected}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      isRejected
                        ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
                        : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ticket._id)}
                    disabled={isRejected || isDeleting}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      isRejected
                        ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
                        : "border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white"
                    }`}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {isModalOpen && editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Update Ticket
              </h3>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="px-5 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ticket Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* From & To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={editForm.from}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={editForm.to}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Transport, Price, Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Transport Type
                  </label>
                  <select
                    name="transportType"
                    value={editForm.transportType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Launch">Launch</option>
                    <option value="Plane">Plane</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Price (per unit)
                  </label>
                  <input
                    type="number"
                    name="price"
                    min={0}
                    step="0.01"
                    value={editForm.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Ticket Quantity
                  </label>
                  <input
                    type="number"
                    name="ticketQuantity"
                    min={1}
                    value={editForm.ticketQuantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Departure Date & Time */}
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Departure Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  name="departureDateTime"
                  value={editForm.departureDateTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Perks */}
              <div>
                <p className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Perks
                </p>
                <div className="flex flex-wrap gap-2">
                  {perksOptions.map((perk) => {
                    const active = editForm.perks.includes(perk);
                    return (
                      <button
                        key={perk}
                        type="button"
                        onClick={() => handlePerkToggle(perk)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {perk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedTickets;

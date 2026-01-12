import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format, isValid } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import useCountdown from "../../Hooks/useCountdown";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import BookNowModal from "../../Components/Common/BookNowModal";
import TicketDetailsSkeleton from "../../Components/skeletons/TicketDetailsSkeleton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { Separator } from "../../Components/ui/separator";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../../Components/ui/tooltip";

import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Tag,
  Usb,
  Wifi,
  Coffee,
  Airplay,
  ArrowLeft,
} from "lucide-react";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='1200' height='675' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-size='32' font-family='Arial'%3ETwitter image unavailable%3C/text%3E%3C/svg%3E";

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
};

const perkIcon = (perk) => {
  const lower = (perk || "").toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="h-4 w-4" />;
  if (lower.includes("ac") || lower.includes("air"))
    return <Airplay className="h-4 w-4" />;
  if (lower.includes("snack") || lower.includes("coffee"))
    return <Coffee className="h-4 w-4" />;
  if (lower.includes("usb")) return <Usb className="h-4 w-4" />;
  return <Tag className="h-4 w-4" />;
};

const StatusPill = ({ tone = "neutral", children }) => {
  const classes =
    tone === "success"
      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
      : tone === "danger"
      ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
      : tone === "warning"
      ? "bg-chart-3/15 text-foreground ring-1 ring-border"
      : "bg-muted text-muted-foreground ring-1 ring-border";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {children}
    </span>
  );
};

const MiniTimeBox = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <div className="min-w-[2.4rem] rounded-md bg-foreground text-background px-2 py-1 text-center text-xs font-semibold tabular-nums">
      {String(value).padStart(2, "0")}
    </div>
    <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  </div>
);

const TicketDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const query = useQuery({
    queryKey: ["ticket", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/ticket/${id}`);
      return res.data;
    },
    staleTime: 30_000,
    retry: 1,
  });

  const ticket = query.data ?? null;
  const isInitialLoading = query.isPending ?? query.isLoading;

  const countdown = useCountdown(ticket?.departureDateTime);

  const derived = useMemo(() => {
    const departure = new Date(ticket?.departureDateTime);
    const hasDeparture = isValid(departure);

    const hasDeparted = hasDeparture && departure.getTime() <= Date.now();

    const qty = Number(ticket?.ticketQuantity);
    const hasQty = Number.isFinite(qty);
    const isSoldOut = hasQty && qty <= 0;

    const perks = Array.isArray(ticket?.perks) ? ticket.perks : [];

    return {
      title: ticket?.title || "Ticket",
      from: ticket?.from || "—",
      to: ticket?.to || "—",
      transportType: ticket?.transportType || "Travel",
      vendorName: ticket?.vendorName || "—",
      vendorEmail: ticket?.vendorEmail || "—",
      verificationStatus: ticket?.verificationStatus || "unknown",
      adminApprove: !!ticket?.adminApprove,
      advertised: !!ticket?.advertised,

      qty,
      hasQty,
      isSoldOut,
      hasDeparted,

      departureDate: hasDeparture ? format(departure, "PPP") : "N/A",
      departureTime: hasDeparture ? format(departure, "p") : "N/A",
      perks,

      price: formatMoney(ticket?.price),
    };
  }, [ticket]);

  const isBookNowDisabled = derived.hasDeparted || derived.isSoldOut;

  if (isInitialLoading) return <TicketDetailsSkeleton />;

  if (query.isError || !ticket) {
    return (
      <div className="min-h-screen bg-background py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket not available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-destructive">
                {query.error?.message || "Ticket not found."}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => query.refetch()}>
                  Retry
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/all-tickets">Back to all tickets</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const verificationTone =
    derived.verificationStatus === "approved"
      ? "success"
      : derived.verificationStatus === "rejected"
      ? "danger"
      : "warning";

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link
              to="/all-tickets"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all tickets
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {derived.title}
              </h1>

              <StatusPill tone="neutral">{derived.transportType}</StatusPill>
              {derived.advertised ? (
                <StatusPill tone="success">Advertised</StatusPill>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground">
              <MapPin className="inline-block mr-2 -mt-1 h-4 w-4 align-text-bottom" />
              {derived.from} → {derived.to}
            </p>
          </div>

          {/* Countdown */}
          <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            {countdown?.isExpired || derived.hasDeparted ? (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-semibold text-destructive">
                  Departure time has passed
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Departure in
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MiniTimeBox label="D" value={countdown?.days ?? 0} />
                  <span className="text-muted-foreground">:</span>
                  <MiniTimeBox label="H" value={countdown?.hours ?? 0} />
                  <span className="text-muted-foreground">:</span>
                  <MiniTimeBox label="M" value={countdown?.minutes ?? 0} />
                  <span className="text-muted-foreground">:</span>
                  <MiniTimeBox label="S" value={countdown?.seconds ?? 0} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative">
                <img
                  src={ticket?.image || FALLBACK_IMAGE}
                  alt={derived.title}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
              </div>
            </div>

            {/* Route & schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Route & Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      From
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {derived.from}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      To
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {derived.to}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Departure Date
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {derived.departureDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Departure Time
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {derived.departureTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perks */}
            <Card>
              <CardHeader>
                <CardTitle>Perks</CardTitle>
              </CardHeader>
              <CardContent>
                {derived.perks.length ? (
                  <TooltipProvider>
                    <div className="flex flex-wrap gap-2">
                      {derived.perks.map((perk, i) => (
                        <Tooltip key={`${perk}-${i}`}>
                          <TooltipTrigger asChild>
                            <Badge className="inline-flex items-center gap-2 rounded-full px-3 py-1">
                              {perkIcon(perk)}
                              <span className="max-w-[12rem] truncate">
                                {perk}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{perk}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No extras listed for this ticket.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:sticky lg:top-6 space-y-4">
            {/* Purchase panel */}
            <Card className="overflow-hidden">
              <div className="bg-muted/30 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Price (per ticket)
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-foreground">
                        {derived.price === "—" ? "—" : `$${derived.price}`}
                      </span>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {derived.hasQty ? derived.qty : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsModalOpen(true)}
                    disabled={isBookNowDisabled}
                  >
                    {derived.hasDeparted
                      ? "Departure Passed"
                      : derived.isSoldOut
                      ? "Sold Out"
                      : "Book Now"}
                  </Button>

                  {isBookNowDisabled && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {derived.hasDeparted
                        ? "Bookings are closed for this trip."
                        : "This trip is currently sold out."}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Verification
                    </span>
                  </div>
                  <StatusPill tone={verificationTone}>
                    {derived.verificationStatus}
                  </StatusPill>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Vendor</span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {derived.vendorName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Vendor Email
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {derived.vendorEmail}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Admin Approved
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {derived.adminApprove ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Meta */}
            <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <p>
                Created:{" "}
                {ticket?.createdAt && isValid(new Date(ticket.createdAt))
                  ? format(new Date(ticket.createdAt), "PPP p")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BookNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={ticket}
      />
    </div>
  );
};

export default TicketDetails;

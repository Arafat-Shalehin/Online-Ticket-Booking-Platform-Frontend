import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import useCountdown from "../../Hooks/useCountdown";
import BookNowModal from "../../Components/Common/BookNowModal";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Components/Common/Loader";
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
import { ScrollArea } from "../../Components/ui/scroll-area";

// icons
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Tag,
  Usb,
  Wifi,
  Coffee,
  Airplay,
} from "lucide-react";

const TicketDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Data of specific id
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/ticket/${id}`);
        setTicket(res.data);
      } catch (err) {
        setError(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (!id) return;
    fetchTicket();
  }, [id, axiosSecure]);

  // loading progress
  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        return p + Math.floor(Math.random() * 12) + 6; // organic progress
      });
    }, 180);
    return () => clearInterval(interval);
  }, [loading]);

  const countdown = useCountdown(ticket?.departureTime);

  const hasDeparted =
    ticket && new Date(ticket.departureTime).getTime() <= Date.now();
  const isSoldOut = ticket && ticket.quantity <= 0;
  const isBookNowDisabled = hasDeparted || isSoldOut;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader
          message="Loading Ticket Details..."
          subMessage="Fetching schedule, seats and vendor data"
          progress={Math.min(progress, 100)}
        />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket not available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">
                {error || "Ticket not found."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // derived formatted dates
  const departureDateObj = new Date(ticket.departureTime);
  const departureDate = format(departureDateObj, "PPP");
  const departureTime = format(departureDateObj, "p");

  // small helper to map common perk keywords to icons
  const perkIcon = (perk) => {
    const lower = (perk || "").toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="mr-2 h-4 w-4" />;
    if (lower.includes("ac") || lower.includes("air"))
      return <Airplay className="mr-2 h-4 w-4" />;
    if (lower.includes("snack") || lower.includes("coffee"))
      return <Coffee className="mr-2 h-4 w-4" />;
    if (lower.includes("usb")) return <Usb className="mr-2 h-4 w-4" />;
    return <Tag className="mr-2 h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              {ticket.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <MapPin className="inline-block mr-2 -mt-1 h-4 w-4 align-text-bottom" />
              {ticket.from} → {ticket.to} • {ticket.transportType}
            </p>
          </div>

          {/* Countdown (compact) */}
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-card px-4 py-3 shadow-sm sm:mt-0">
            {countdown?.isExpired || hasDeparted ? (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-semibold text-red-600">
                  Departure time has passed
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Departure in
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-sm">
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
            {/* hero image */}
            <div className="overflow-hidden rounded-2xl bg-muted shadow">
              <img
                src={ticket.image}
                alt={ticket.title}
                className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Route & Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      From
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {ticket.from}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      To
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {ticket.to}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Departure Date
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {departureDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Departure Time
                    </p>
                    <p className="mt-1 text-base text-foreground">
                      {departureTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perks</CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.perks?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ticket.perks.map((perk, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Badge className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
                                {perkIcon(perk)}
                                <span className="truncate max-w-[10rem]">
                                  {perk}
                                </span>
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{perk}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No extras listed for this ticket.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Sticky purchase panel */}
          <div className="lg:sticky lg:top-6">
            <Card className="overflow-hidden">
              <div className="bg-linear-to-b from-white to-muted/40 p-6 dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Price (per ticket)
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-foreground">
                        ${ticket.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <div
                      className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                        isSoldOut
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>{ticket.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsModalOpen(true)}
                    disabled={isBookNowDisabled}
                  >
                    {hasDeparted
                      ? "Departure Passed"
                      : isSoldOut
                      ? "Sold Out"
                      : "Book Now"}
                  </Button>

                  {isBookNowDisabled && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {hasDeparted
                        ? "Bookings are closed for this trip."
                        : "This trip is currently sold out."}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-0" />

              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-muted-foreground">
                        Verification
                      </span>
                    </div>
                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ticket.verificationStatus === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {ticket.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Vendor
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {ticket.vendorName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Vendor Email
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {ticket.vendorEmail}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Admin Approved
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {ticket.adminApprove ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
              <p>
                Created:{" "}
                {ticket.createdAt
                  ? format(new Date(ticket.createdAt), "PPP p")
                  : "N/A"}
              </p>
              {ticket.advertised && <p>Currently advertised ticket.</p>}
            </div>
          </div>
        </div>
      </div>

      <BookNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={ticket}
      />
    </div>
  );
};

const MiniTimeBox = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <div className="min-w-[2.2rem] rounded-md bg-foreground text-background px-2 py-1 text-center text-xs font-semibold">
      {String(value).padStart(2, "0")}
    </div>
    <span className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  </div>
);

export default TicketDetails;

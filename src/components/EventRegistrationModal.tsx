import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { eventApi, Event } from "@/services/eventApi";
import { toast } from "sonner";

interface EventRegistrationModalProps {
  event: Event;
  children: React.ReactNode;
}

export const EventRegistrationModal = ({
  event,
  children,
}: EventRegistrationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"details" | "ticket">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accessibilityNeeds: "",
  });
  const [ticketId, setTicketId] = useState<string | null>(null);

  const spotsLeft = event.spotsLeft;
  const isSoldOut = event.isSoldOut || false;

  const handleRegister = async () => {
    setIsProcessing(true);
    try {
      const response = await eventApi.registerForEvent(event.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        accessibilityNeeds: formData.accessibilityNeeds || undefined,
      });
      
      if (response.data.ticketId) {
        setTicketId(response.data.ticketId);
      }
      setStep("ticket");
      toast.success(response.message || "Registration successful!");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep("details");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      accessibilityNeeds: "",
    });
    setTicketId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetModal, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Event Header */}
              <div className="relative -mt-6 -mx-6 p-6 mb-4 rounded-t-xl pride-gradient-subtle">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h2 className="text-xl font-heading font-bold mb-2">
                  {event.title}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.location}
                  </div>
                </div>
              </div>

              <DialogHeader className="pb-2">
                <DialogTitle>Register for Event</DialogTitle>
                <DialogDescription>
                  Fill in your details to secure your spot.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Attendee Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessibility">Accessibility Needs (optional)</Label>
                  <Input
                    id="accessibility"
                    placeholder="Any accommodations you need..."
                    value={formData.accessibilityNeeds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accessibilityNeeds: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-lg bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket size={18} className="text-primary" />
                    <span className="font-medium">
                      {event.isFree ? "Free Event" : `₹${event.price.toFixed(2)}`}
                    </span>
                  </div>
                  {spotsLeft !== null && (
                    <span className="text-sm text-muted-foreground">
                      {isSoldOut ? "Sold Out" : `${spotsLeft} spots left`}
                    </span>
                  )}
                </div>

                <Button
                  className="w-full btn-pride"
                  size="lg"
                  onClick={handleRegister}
                  disabled={
                    isSoldOut ||
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    isProcessing
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isSoldOut ? (
                    "Sold Out"
                  ) : event.isFree ? (
                    "Register Free"
                  ) : (
                    `Pay ₹${event.price.toFixed(2)} & Register`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By registering, you agree to our terms and conditions.
                </p>
              </div>
            </motion.div>
          )}

          {step === "ticket" && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
              >
                <Check size={40} className="text-green-500" />
              </motion.div>

              <h3 className="text-xl font-heading font-bold mb-1">You're Registered!</h3>
              <p className="text-muted-foreground mb-6">
                Check your email for confirmation and event details.
              </p>

              {/* Ticket Card */}
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 border-2 border-dashed border-primary/30 mb-6">
                <div className="absolute top-1/2 left-0 w-6 h-6 rounded-full bg-background -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-6 h-6 rounded-full bg-background translate-x-1/2 -translate-y-1/2" />

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {event.organizer?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{event.organizer?.name || "PrideVoice"}</p>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-3">{event.title}</h4>

                <div className="grid grid-cols-2 gap-2 text-sm text-left mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={14} />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={14} />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                    <MapPin size={14} />
                    {event.location}
                  </div>
                </div>

                <div className="pt-3 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                  <p className="font-mono font-bold text-lg">{ticketId}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
                <Button
                  className="flex-1 btn-pride"
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(resetModal, 300);
                  }}
                >
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

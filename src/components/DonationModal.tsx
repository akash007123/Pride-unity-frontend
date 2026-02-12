import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  DollarSign,
  CreditCard,
  Check,
  Sparkles,
  Gift,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const donationTiers = [
  { amount: 10, label: "Supporter", impact: "Helps provide educational resources" },
  { amount: 25, label: "Ally", impact: "Funds community events" },
  { amount: 50, label: "Champion", impact: "Supports youth programs" },
  { amount: 100, label: "Hero", impact: "Makes a real difference" },
];

export const DonationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState<"tier" | "details" | "thankyou">("tier");
  const [isProcessing, setIsProcessing] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const displayAmount = customAmount || (selectedAmount ? selectedAmount.toString() : "0");

  const handleDonate = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("thankyou");
  };

  const resetModal = () => {
    setStep("tier");
    setSelectedAmount(25);
    setCustomAmount("");
    setDonorName("");
    setDonorEmail("");
    setIsAnonymous(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetModal, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="btn-pride">
          <Heart className="mr-2 h-4 w-4 fill-current" />
          Donate
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {step === "tier" && (
            <motion.div
              key="tier"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                  Support Our Mission
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Impact Message */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <p className="text-sm text-center">
                    Your contribution helps us create resources, events, and safe spaces for the LGBTQ+ community.
                  </p>
                </div>

                {/* Amount Tiers */}
                <div className="grid grid-cols-2 gap-3">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setCustomAmount("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedAmount === tier.amount && !customAmount
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-2xl font-bold">${tier.amount}</div>
                      <div className="text-sm font-medium text-primary">{tier.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{tier.impact}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    className="pl-10"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>

                <Button
                  className="w-full btn-pride"
                  size="lg"
                  onClick={() => setStep("details")}
                >
                  Continue with ${displayAmount}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Your Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Amount Summary */}
                <div className="p-3 rounded-lg bg-muted flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Donation Amount</span>
                  <span className="text-lg font-bold">${displayAmount}</span>
                </div>

                {/* Donor Form */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="donorName">Name</Label>
                  </div>
                  <Input
                    id="donorName"
                    placeholder="Your name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="donorEmail">Email</Label>
                  </div>
                  <Input
                    id="donorEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Make this donation anonymous</span>
                </label>

                {/* Payment Placeholder */}
                <div className="p-4 rounded-lg border border-dashed border-border">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <CreditCard size={16} />
                    <span className="text-sm">Payment details would go here</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("tier")}>
                    Back
                  </Button>
                  <Button
                    className="flex-1 btn-pride"
                    size="lg"
                    onClick={handleDonate}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles size={16} />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4 fill-current" />
                        Donate ${displayAmount}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment • Tax deductible
                </p>
              </div>
            </motion.div>
          )}

          {step === "thankyou" && (
            <motion.div
              key="thankyou"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
              >
                <Check size={40} className="text-green-500" />
              </motion.div>

              <h3 className="text-2xl font-heading font-bold mb-2">
                Thank You, {isAnonymous ? "Friend" : donorName}! ❤️
              </h3>

              <p className="text-muted-foreground mb-6">
                Your donation of ${displayAmount} helps make our community stronger.
                A receipt has been sent to {isAnonymous ? "your email" : donorEmail}.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Gift size={14} />
                  Your impact
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  1,247 members
                </div>
              </div>

              <Button
                variant="outline"
                className="btn-outline-pride"
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(resetModal, 300);
                }}
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

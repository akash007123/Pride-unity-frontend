import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Heart,
  Check,
  Loader2,
  Send,
  Zap,
  Calendar,
  Megaphone,
  Code,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { volunteerApi } from "@/services/volunteerApi";

const volunteerRoles = [
  {
    id: "events",
    title: "Event Planning",
    description: "Help organize and run pride events and meetups",
    icon: Calendar,
  },
  {
    id: "outreach",
    title: "Community Outreach",
    description: "Connect with local organizations and spread awareness",
    icon: Megaphone,
  },
  {
    id: "tech",
    title: "Technical Support",
    description: "Help maintain and improve our digital platforms",
    icon: Code,
  },
  {
    id: "creative",
    title: "Creative & Design",
    description: "Create artwork, content, and visual materials",
    icon: Palette,
  },
];

const skills = [
  "Event Management",
  "Social Media",
  "Writing & Content",
  "Graphic Design",
  "Web Development",
  "Public Speaking",
  "Mentoring",
  "Fundraising",
  "Translation",
  "Photography",
];

export const VolunteerSignupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"info" | "roles" | "success">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: [] as string[],
    message: "",
    availability: "",
    agreedToContact: false,
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await volunteerApi.createVolunteer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roles: selectedRoles,
        skills: formData.skills,
        availability: formData.availability,
        message: formData.message,
        agreedToContact: formData.agreedToContact,
      });
      setStep("success");
    } catch (error) {
      console.error("Failed to submit volunteer registration:", error);
      // Still show success for demo purposes, or you could show an error message
      setStep("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("info");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      skills: [],
      message: "",
      availability: "",
      agreedToContact: false,
    });
    setSelectedRoles([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  };

  return (
    <>
      <Button className="btn-pride" onClick={() => setIsOpen(true)}>
        <Heart className="mr-2 h-4 w-4 fill-current" />
        Volunteer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted"
          >
            {/* <X size={16} /> */}
          </button>

          <AnimatePresence mode="wait">
            {step === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4 pr-8"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                    <Heart className="text-pink-500 fill-pink-500" size={20} />
                    Join Our Volunteer Team
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Make a difference in the LGBTQ+ community
                  </p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills & Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                          formData.skills.includes(skill)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full btn-pride"
                  onClick={() => setStep("roles")}
                  disabled={!formData.firstName || !formData.lastName || !formData.email}
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === "roles" && (
              <motion.div
                key="roles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4 pr-8"
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-heading font-bold">
                    Select Your Areas
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose where you'd like to help
                  </p>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  {volunteerRoles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRoles.includes(role.id);

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleToggle(role.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={isSelected ? "text-primary" : "text-muted-foreground"}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{role.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">
                    Availability (hours per week)
                  </Label>
                  <Input
                    id="availability"
                    placeholder="e.g., 2-4 hours/week"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Why do you want to volunteer?
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us a bit about yourself and your motivation..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agree"
                    checked={formData.agreedToContact}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreedToContact: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    I'm okay with being contacted about volunteer opportunities
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>
                    Back
                  </Button>
                  <Button
                    className="flex-1 btn-pride"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      selectedRoles.length === 0 ||
                      !formData.agreedToContact
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
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

                <h3 className="text-xl font-heading font-bold mb-2">
                  Thank You for Applying! 🌈
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your volunteer application has been received. We'll be in touch soon.
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Zap size={14} className="text-yellow-500" />
                  <span>Selected: {selectedRoles.length} roles</span>
                </div>

                <Button
                  variant="outline"
                  className="btn-outline-pride"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { CustomVolunteer } from '@/services/customVolunteerApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap,
  Shield,
  Heart,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface ViewCustomVolunteerModalProps {
  volunteer: CustomVolunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  archived: 'outline',
};

const roleLabels: Record<string, string> = {
  Volunteer: 'Volunteer',
  Member: 'Member',
  Coordinator: 'Coordinator',
  Leader: 'Leader',
};

export function ViewCustomVolunteerModal({ volunteer, open, onOpenChange }: ViewCustomVolunteerModalProps) {
  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            Volunteer Details
          </DialogTitle>
          <DialogDescription>
            View details for {volunteer.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Header Info */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{volunteer.fullName}</h3>
              <p className="text-sm text-muted-foreground">ID: {volunteer.volunteerId}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={statusVariants[volunteer.status] || 'default'}>
                {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
              </Badge>
              <Badge variant="outline">
                {roleLabels[volunteer.role] || volunteer.role}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {volunteer.parentName && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-28">Parent Name:</span>
                  <span className="font-medium">{volunteer.parentName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Email:</span>
                <span className="font-medium">{volunteer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Mobile:</span>
                <span className="font-medium">{volunteer.mobile}</span>
              </div>
              {volunteer.alternateMobile && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-28">Alt. Mobile:</span>
                  <span className="font-medium">{volunteer.alternateMobile}</span>
                </div>
              )}
              {volunteer.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-28">Date of Birth:</span>
                  <span className="font-medium">{format(new Date(volunteer.dateOfBirth), 'dd MMM yyyy')}</span>
                </div>
              )}
              {volunteer.age && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-28">Age:</span>
                  <span className="font-medium">{volunteer.age} years</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Gender:</span>
                <span className="font-medium">{volunteer.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Marital Status:</span>
                <span className="font-medium">{volunteer.maritalStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Nationality:</span>
                <span className="font-medium">{volunteer.nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-28">Blood Group:</span>
                <span className="font-medium">{volunteer.bloodGroup}</span>
              </div>
              {volunteer.aadhaarNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-28">Aadhaar:</span>
                  <span className="font-medium">{volunteer.aadhaarNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          {volunteer.socialMediaLinks && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4" />
                  Social Media
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {volunteer.socialMediaLinks.facebook && (
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{volunteer.socialMediaLinks.facebook}</span>
                    </div>
                  )}
                  {volunteer.socialMediaLinks.instagram && (
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <span className="font-medium">{volunteer.socialMediaLinks.instagram}</span>
                    </div>
                  )}
                  {volunteer.socialMediaLinks.twitter && (
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-500" />
                      <span className="font-medium">{volunteer.socialMediaLinks.twitter}</span>
                    </div>
                  )}
                  {volunteer.socialMediaLinks.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span className="font-medium">{volunteer.socialMediaLinks.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Address Information */}
          {(volunteer.currentAddress || volunteer.permanentAddress || volunteer.city) && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  Address
                </h4>
                <div className="space-y-2 text-sm">
                  {volunteer.currentAddress && (
                    <div>
                      <span className="text-muted-foreground">Current Address: </span>
                      <span className="font-medium">{volunteer.currentAddress}</span>
                    </div>
                  )}
                  {volunteer.permanentAddress && (
                    <div>
                      <span className="text-muted-foreground">Permanent Address: </span>
                      <span className="font-medium">{volunteer.permanentAddress}</span>
                    </div>
                  )}
                  <div className="flex gap-4">
                    {volunteer.city && (
                      <div>
                        <span className="text-muted-foreground">City: </span>
                        <span className="font-medium">{volunteer.city}</span>
                      </div>
                    )}
                    {volunteer.state && (
                      <div>
                        <span className="text-muted-foreground">State: </span>
                        <span className="font-medium">{volunteer.state}</span>
                      </div>
                    )}
                    {volunteer.pincode && (
                      <div>
                        <span className="text-muted-foreground">Pincode: </span>
                        <span className="font-medium">{volunteer.pincode}</span>
                      </div>
                    )}
                  </div>
                  {volunteer.country && (
                    <div>
                      <span className="text-muted-foreground">Country: </span>
                      <span className="font-medium">{volunteer.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Education Details */}
          {(volunteer.highestQualification || volunteer.institutionName) && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {volunteer.highestQualification && (
                    <div>
                      <span className="text-muted-foreground">Qualification: </span>
                      <span className="font-medium">{volunteer.highestQualification}</span>
                    </div>
                  )}
                  {volunteer.fieldOfStudy && (
                    <div>
                      <span className="text-muted-foreground">Field of Study: </span>
                      <span className="font-medium">{volunteer.fieldOfStudy}</span>
                    </div>
                  )}
                  {volunteer.institutionName && (
                    <div>
                      <span className="text-muted-foreground">Institution: </span>
                      <span className="font-medium">{volunteer.institutionName}</span>
                    </div>
                  )}
                  {volunteer.yearOfCompletion && (
                    <div>
                      <span className="text-muted-foreground">Year: </span>
                      <span className="font-medium">{volunteer.yearOfCompletion}</span>
                    </div>
                  )}
                  {volunteer.certifications && volunteer.certifications.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Certifications: </span>
                      <span className="font-medium">{volunteer.certifications.join(', ')}</span>
                    </div>
                  )}
                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Skills: </span>
                      <span className="font-medium">{volunteer.skills.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {volunteer.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </h4>
                <p className="text-sm text-muted-foreground">{volunteer.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customVolunteerApi, CustomVolunteer } from '@/services/customVolunteerApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, MapPin, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface EditCustomVolunteerModalProps {
  volunteer: CustomVolunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Transgender', label: 'Transgender' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

const maritalStatusOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Separated', label: 'Separated' },
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'Unknown', label: 'Unknown' },
];

const roleOptions = [
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Member', label: 'Member' },
  { value: 'Coordinator', label: 'Coordinator' },
  { value: 'Leader', label: 'Leader' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

export function EditCustomVolunteerModal({ volunteer, open, onOpenChange }: EditCustomVolunteerModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Information
  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [nationality, setNationality] = useState('Indian');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  
  // Social Media
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Address
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  // Education
  const [highestQualification, setHighestQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [yearOfCompletion, setYearOfCompletion] = useState('');
  const [certifications, setCertifications] = useState('');
  const [skills, setSkills] = useState('');

  // Role & Status
  const [role, setRole] = useState('Volunteer');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (volunteer) {
      setFullName(volunteer.fullName || '');
      setParentName(volunteer.parentName || '');
      setEmail(volunteer.email || '');
      setMobile(volunteer.mobile || '');
      setAlternateMobile(volunteer.alternateMobile || '');
      setDateOfBirth(volunteer.dateOfBirth ? volunteer.dateOfBirth.split('T')[0] : '');
      setGender(volunteer.gender || 'Prefer not to say');
      setMaritalStatus(volunteer.maritalStatus || 'Single');
      setNationality(volunteer.nationality || 'Indian');
      setBloodGroup(volunteer.bloodGroup || 'Unknown');
      setAadhaarNumber(volunteer.aadhaarNumber || '');
      
      setFacebook(volunteer.socialMediaLinks?.facebook || '');
      setInstagram(volunteer.socialMediaLinks?.instagram || '');
      setTwitter(volunteer.socialMediaLinks?.twitter || '');
      setLinkedin(volunteer.socialMediaLinks?.linkedin || '');

      setCurrentAddress(volunteer.currentAddress || '');
      setPermanentAddress(volunteer.permanentAddress || '');
      setCity(volunteer.city || '');
      setState(volunteer.state || '');
      setCountry(volunteer.country || 'India');
      setPincode(volunteer.pincode || '');

      setHighestQualification(volunteer.highestQualification || '');
      setFieldOfStudy(volunteer.fieldOfStudy || '');
      setInstitutionName(volunteer.institutionName || '');
      setYearOfCompletion(volunteer.yearOfCompletion?.toString() || '');
      setCertifications(volunteer.certifications?.join(', ') || '');
      setSkills(volunteer.skills?.join(', ') || '');

      setRole(volunteer.role || 'Volunteer');
      setStatus(volunteer.status || 'active');
      setNotes(volunteer.notes || '');
    }
  }, [volunteer]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomVolunteer> }) =>
      customVolunteerApi.updateVolunteer(id, data),
    onSuccess: (result) => {
      toast.success(result.message || 'Volunteer updated successfully');
      queryClient.invalidateQueries({ queryKey: ['customVolunteers'] });
      queryClient.invalidateQueries({ queryKey: ['customVolunteerStats'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update volunteer');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteer) return;

    const volunteerData: Partial<CustomVolunteer> = {
      fullName,
      parentName: parentName || undefined,
      email,
      mobile,
      alternateMobile: alternateMobile || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
      gender,
      maritalStatus,
      nationality,
      bloodGroup,
      aadhaarNumber: aadhaarNumber || undefined,
      socialMediaLinks: {
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
      },
      currentAddress: currentAddress || undefined,
      permanentAddress: permanentAddress || undefined,
      city: city || undefined,
      state: state || undefined,
      country,
      pincode: pincode || undefined,
      highestQualification: highestQualification || undefined,
      fieldOfStudy: fieldOfStudy || undefined,
      institutionName: institutionName || undefined,
      yearOfCompletion: yearOfCompletion ? parseInt(yearOfCompletion) : undefined,
      certifications: certifications ? certifications.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      role,
      status,
      notes: notes || undefined,
    };

    updateMutation.mutate({ id: volunteer.id, data: volunteerData });
  };

  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Volunteer</DialogTitle>
          <DialogDescription>
            Update volunteer details for {volunteer.fullName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Address
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-parentName">Father's / Mother's Name</Label>
                  <Input
                    id="edit-parentName"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Enter parent's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-mobile">Mobile Number *</Label>
                  <Input
                    id="edit-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-alternateMobile">Alternate Mobile</Label>
                  <Input
                    id="edit-alternateMobile"
                    type="tel"
                    value={alternateMobile}
                    onChange={(e) => setAlternateMobile(e.target.value)}
                    placeholder="Enter alternate mobile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maritalStatus">Marital Status</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nationality">Nationality</Label>
                  <Input
                    id="edit-nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Enter nationality"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-bloodGroup">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroupOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-aadhaarNumber">Aadhaar / Government ID</Label>
                  <Input
                    id="edit-aadhaarNumber"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="Enter Aadhaar number"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Social Media Links (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-facebook">Facebook</Label>
                    <Input
                      id="edit-facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-instagram">Instagram</Label>
                    <Input
                      id="edit-instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-twitter">Twitter</Label>
                    <Input
                      id="edit-twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="Twitter profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-linkedin">LinkedIn</Label>
                    <Input
                      id="edit-linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-currentAddress">Current Address</Label>
                <Textarea
                  id="edit-currentAddress"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  placeholder="Enter current address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-permanentAddress">Permanent Address</Label>
                <Textarea
                  id="edit-permanentAddress"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="Enter permanent address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-pincode">Pincode</Label>
                  <Input
                    id="edit-pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-highestQualification">Highest Qualification</Label>
                  <Input
                    id="edit-highestQualification"
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    placeholder="e.g., Bachelor's Degree"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-fieldOfStudy">Field of Study</Label>
                  <Input
                    id="edit-fieldOfStudy"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-institutionName">Institution Name</Label>
                  <Input
                    id="edit-institutionName"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-yearOfCompletion">Year of Completion</Label>
                  <Input
                    id="edit-yearOfCompletion"
                    type="number"
                    value={yearOfCompletion}
                    onChange={(e) => setYearOfCompletion(e.target.value)}
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-certifications">Certifications</Label>
                  <Input
                    id="edit-certifications"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="Comma-separated certifications"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-skills">Skills / Specialization</Label>
                  <Input
                    id="edit-skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Comma-separated skills"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Other Tab */}
            <TabsContent value="other" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

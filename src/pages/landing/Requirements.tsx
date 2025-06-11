import { Award, BookOpen, Building, Calendar, FileText, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Requirements = () => {
  return (
    <section className="py-16 bg-white" id="requirements">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Permit Requirements</h2>
        <p className="text-center mb-12 max-w-3xl mx-auto">
          The following documents and information may be required depending on the type of permit you&apos;re applying for:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Users size={20} className="text-primary" />
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Government-issued photo ID</li>
                <li>Proof of Hawaii residency</li>
                <li>Business license (for commercial permits)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Building size={20} className="text-primary" />
              <CardTitle className="text-lg">Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Site plan or diagram</li>
                <li>Property owner authorization</li>
                <li>Adjacent property notification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Award size={20} className="text-primary" />
              <CardTitle className="text-lg">Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Pyrotechnician certification</li>
                <li>Safety training documentation</li>
                <li>Experience verification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Calendar size={20} className="text-primary" />
              <CardTitle className="text-lg">Event Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Date and time of display</li>
                <li>Rain date (if applicable)</li>
                <li>Expected attendance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FileText size={20} className="text-primary" />
              <CardTitle className="text-lg">Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Certificate of liability insurance</li>
                <li>Minimum $1,000,000 coverage</li>
                <li>State as additional insured</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <BookOpen size={20} className="text-primary" />
              <CardTitle className="text-lg">Safety Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Emergency procedures</li>
                <li>Fire prevention measures</li>
                <li>Crowd control plan</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">License Requirements</h2>
        <p className="text-center mb-12 max-w-3xl mx-auto">
          The following documents and information may be required depending on the type of License you&apos;re applying for:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Users size={20} className="text-primary" />
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Government-issued photo ID</li>
                <li>Proof of Hawaii residency</li>
                <li>Business license (for commercial permits)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Building size={20} className="text-primary" />
              <CardTitle className="text-lg">Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Site plan or diagram</li>
                <li>Property owner authorization</li>
                <li>Adjacent property notification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Award size={20} className="text-primary" />
              <CardTitle className="text-lg">Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Pyrotechnician certification</li>
                <li>Safety training documentation</li>
                <li>Experience verification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Calendar size={20} className="text-primary" />
              <CardTitle className="text-lg">Federal Import license</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Government-issued License</li>
                <li>Clearly state the importing Entity&apos;s name and address</li>
                <li>Must be valid and unexpired.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FileText size={20} className="text-primary" />
              <CardTitle className="text-lg">Federal Strorage license</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Government-issued License</li>
                <li>Clearly state the importing Entity&apos;s name and address</li>
                <li>Must be valid and unexpired.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Requirements;

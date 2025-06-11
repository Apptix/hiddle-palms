import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Alerts = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Important Updates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="text-yellow-500" size={20} />
              <CardTitle className="text-lg">New Year&apos;s Deadline Approaching</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Applications for New Year&apos;s fireworks permits must be submitted by December 10th to ensure processing.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="text-blue-500" size={20} />
              <CardTitle className="text-lg">Updated Certificate Format</CardTitle>
            </CardHeader>
            <CardContent>
              <p>New security features added to digital permits. All permits issued after July 1st will use the new format.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="text-green-500" size={20} />
              <CardTitle className="text-lg">Fee Structure Update</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Updated fee structure for commercial display permits effective October 1st. Please review the new rates before applying.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <CardTitle className="text-lg">Regulation Change</CardTitle>
            </CardHeader>
            <CardContent>
              <p>New safety regulations for commercial displays near coastal areas. Additional documentation may be required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Alerts;

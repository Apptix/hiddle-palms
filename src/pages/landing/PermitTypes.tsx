import { Flame } from "lucide-react";
import { Link } from "react-router";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LicenseDocuments, PermitDocuments } from "@/constants";

const PermitTypes = () => {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Permit/License Types</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Display Fireworks Permit */}
          <Card className="hover:shadow-lg transition-shadow lg:col-start-1 lg:col-end-3">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Flame size={24} className="text-primary" />
                Display Fireworks Permit
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Required for public fireworks displays operated by licensed pyrotechnicians.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Driving License</li>
                <li>Certificate of Fitness</li>
                {
                  PermitDocuments?.map(( document, index ) => (
                    <li key={index}>{document?.name}</li>
                  ))
                }
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/register" className="w-full">
                <Button variant="outline" className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Importer Fireworks License */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col lg:col-start-3 lg:col-end-5">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Flame size={24} className="text-primary" />
                Importer Fireworks License
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Required for Importer fireworks license displays operated by licensed pyrotechnicians.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Driving License</li>
                <li>Certificate of Fitness</li>
                {
                  LicenseDocuments?.map(( document, index ) => (
                    <li key={index}>{document?.name}</li>
                  ))
                }
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link to="/register" className="w-full">
                <Button variant="outline" className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Storage Fireworks License */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col lg:col-start-5 lg:col-end-7">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Flame size={24} className="text-primary" />
                Storage Fireworks License
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Required for Storage fireworks license displays operated by licensed pyrotechnicians.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Driving License</li>
                <li>Certificate of Fitness</li>
                {
                  LicenseDocuments?.map(( document, index ) => (
                    <li key={index}>{document?.name}</li>
                  ))
                }
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link to="/register" className="w-full">
                <Button variant="outline" className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Wholesale Fireworks License */}
          <Card className="hover:shadow-lg transition-shadow lg:col-start-2 lg:col-end-4">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Flame size={24} className="text-primary" />
                Wholesale Fireworks License
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Required for Wholesale fireworks license displays operated by licensed pyrotechnicians.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Driving License</li>
                <li>Certificate of Fitness</li>
                {
                  LicenseDocuments?.map(( document, index ) => (
                    <li key={index}>{document?.name}</li>
                  ))
                }
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/register" className="w-full">
                <Button variant="outline" className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Retail Fireworks License */}
          <Card className="hover:shadow-lg transition-shadow lg:col-start-4 lg:col-end-6">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Flame size={24} className="text-primary" />
                Retail Fireworks License
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Required for Retail fireworks license displays operated by licensed pyrotechnicians.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Driving License</li>
                <li>Certificate of Fitness</li>
                {
                  LicenseDocuments?.map(( document, index ) => (
                    <li key={index}>{document?.name}</li>
                  ))
                }
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/register" className="w-full">
                <Button variant="outline" className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        </div> */}
      </div>
    </section>
  );
};

export default PermitTypes;

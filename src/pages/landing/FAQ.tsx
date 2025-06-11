import { HAWAII_CONTACT_INFO } from "@/constants";
import { BadgeHelp } from "lucide-react";

const FAQ = () => {
  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <BadgeHelp size={20} className="text-primary" />
                When should I apply for a fireworks permit?
              </h3>
              <p className="text-muted-foreground">
                Applications should be submitted at least 30 days before the intended use date to allow sufficient time for processing and approval.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <BadgeHelp size={20} className="text-primary" />
                Can I get a refund if my application is denied?
              </h3>
              <p className="text-muted-foreground">Application fees are non-refundable. However, if your application is denied,
                you may be able to reapply with corrections without paying an additional fee.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <BadgeHelp size={20} className="text-primary" />
                How do I check the status of my application?
              </h3>
              <p className="text-muted-foreground">Log in to your account to view the status of your application. You will also
                receive email notifications about any status changes.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <BadgeHelp size={20} className="text-primary" />
                Who can I contact if I have more questions?
              </h3>
              <p className="text-muted-foreground">Contact Email - {HAWAII_CONTACT_INFO.email} for additional assistance with permit or license applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

const HowItWorks = () => {
  return (
    <section className="bg-hawaii-lightGray py-16" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="flex justify-center">
          <img
            src="/images/0facb159-139d-4218-8339-f6bf95d2fb88.png"
            alt="Steps to obtain a permit/license infographic
            showing: 1. Register, 2. Submit Application, 3. Upload Documents, 4. Make Payment, 5. Download Permit/License"
            className="w-full max-w-4xl"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-800 max-w-3xl mx-auto font-medium">
            Our streamlined process ensures you can obtain your fireworks permit or license with minimal hassle.
            Follow the steps above to complete your application quickly and efficiently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

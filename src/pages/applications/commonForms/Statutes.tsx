/* eslint-disable max-lines */
/* eslint-disable @stylistic/max-len */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export const Statutes = ({ onAcknowledge, acknowledged }: { onAcknowledge: ()=> void, acknowledged: boolean }) => {
  const [ isAtBottom, setIsAtBottom ] = useState( false );
  const [ open, setOpen ] = useState( false );

  useEffect(() => {
    setIsAtBottom( false );
  }, [open]);

  const handleScroll = ( e ) => {
    if ( isAtBottom ) {
      return;
    }
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    setIsAtBottom( bottom );
  };

  const handleAcknowledge = () => {
    setOpen( false );
    onAcknowledge();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span id="hrs-statutes" className="text-primary cursor-pointer">
          Click to view HRS (Hawaii Revised Statutes)
        </span>
      </DialogTrigger>
      <DialogContent className="!max-w-5xl h-[90vh] bg-muted" aria-describedby="Hawaii Revised Statutes">
        <DialogTitle className="text-2xl font-medium text-center uppercase">
          Hawaii Revised Statutes
        </DialogTitle>
        <div className="h-[calc(90vh-10rem)] w-full overflow-y-auto" onScroll={handleScroll}>
          <Card className="p-6">
            <HtmlText />
          </Card>
        </div>
        <div className="justify-center items-center flex">
          {!acknowledged &&
          <Button
            // disabled={!isAtBottom}
            onClick={handleAcknowledge}>
            Acknowledge
          </Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HtmlText = () => {
  return (
    <div className="text-[13pt] font-['Arial',sans-serif]">
      <div className="space-y-2">
        <p className="">
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0002.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-2
          </a> Definitions
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0003.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-3
          </a> Permissible uses of consumer fireworks
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0004.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-4
          </a> Permissible uses of display fireworks, articles pyrotechnic, and aerial devices
        </p>
        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0005.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-5
          </a> General prohibitions
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0006.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-6
          </a> Exceptions
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0007.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-7
          </a> License or permit required
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0008.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-8
          </a> Application for license
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0008_0005.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-8.5
          </a> Importation of aerial devices, display fireworks, or articles pyrotechnic for display
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0008_0006.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-8.6
          </a> Requirements of licensee
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0009.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-9
          </a> Application for permit
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0010.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-10
          </a> Permits
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0011.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-11
          </a> Fee
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0012.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-12
          </a> Sale to minors; sale by minors; prohibited
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0013.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-13
          </a> Liability of parents or guardians
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0014.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-14
          </a> Penalty
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0014_0005.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-14.5
          </a> Liability of homeowner, renter, or person otherwise responsible for real property
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0015.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-15
          </a> Notice requirements
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0016.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-16
          </a> Permit for display
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0016_0005.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-16.5
          </a> Labeling of display fireworks
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0016_0006.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-16.6
          </a> Display site inspection
        </p>

        <p >
          <a
            href="https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0132D/HRS_0132D-0016_0007.htm"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            132D-16.7
          </a> Display stop order
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <h2 className="text-[16pt] font-['Arial',sans-serif] font-bold text-center">
          COUNTY ORDINANCES - HONOLULU
        </h2>

        <h3 className="text-[15pt] font-['Arial',sans-serif] font-bold text-center">
          ARTICLE 6: REGULATION OF FIREWORKS
        </h3>

        <h4 className="text-[14pt] font-['Arial',sans-serif] font-bold">
          Sections
        </h4>

        <div className="space-y-2">
          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18642#JD_20-6.1"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.1
            </a>
            {"   "}Definitions
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18668#JD_20-6.2"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.2
            </a>
            {"   "}Prohibitions—Permitted uses
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18694#JD_20-6.3"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.3
            </a>
            {"   "}Exceptions
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18681#JD_20-6.4"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.4
            </a>
            {"   "}License to import, store, and sell display fireworks or firecrackers
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18689#JD_20-6.5"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.5
            </a>
            {"   "}Requirements of licensee
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18705#JD_20-6.6"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.6
            </a>
            {"   "}Fees—Use of revenues
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18711#JD_20-6.7"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.7
            </a>
            {"   "}Minors
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18714#JD_20-6.8"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.8
            </a>
            {"   "}Liability of parents or guardians
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18717#JD_20-6.9"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.9
            </a>
            {"   "}Penalty
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18722#JD_20-6.10"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.10
            </a>
            {"   "}Notice requirements
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18725#JD_20-6.11"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.11
            </a>
            {"   "}Forfeiture
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18728#JD_20-6.12"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.12
            </a>
            {"   "}Permit for display fireworks
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18744#JD_20-6.13"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.13
            </a>
            {"   "}Permit for firecrackers
          </p>

          <p className="">
            <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18757#JD_20-6.14"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.14
            </a>
            {"   "}Severability
          </p>
        </div>
      </div>
      <div className="mt-8 space-y-2">
        <p className=" font-bold">
          § 20-6.1 Definitions.
        </p>

        <p className="">
          For the purposes of this article, the following definitions apply unless the context clearly indicates or requires a different meaning.
        </p>

        <p className="">
          <span className="font-bold">Aerial Device.</span> Any fireworks containing 130 milligrams or less of explosive materials that produce an audible or visible effect and is designed to rise into the air and explode or detonate in the air or to fly about above the ground.
          Aerial devices classified as fireworks under UN0336 and UN0337 by the United States Department of Transportation as set forth in CFR Title 49 include firework items commonly known as bottle rockets, sky rockets, missile-type rockets, helicopters, torpedoes, daygo bombs, Roman candles, flying pigs, and jumping jacks that move about the ground farther than a circle with a radius of 12 feet as measured from the point where the item was placed and ignited, aerial shells, and mines.
        </p>

        <p className="">
          <span className="font-bold">Articles Pyrotechnic.</span> Pyrotechnic devices for professional use similar to consumer fireworks in chemical composition and construction, but not intended for consumer use that meet the weight limits for consumer fireworks, but are not labeled as such, and that are classified as UN0431 or UN0432 by the United States Department of Transportation.
        </p>

        <p>
          <span className="font-bold">Consignee.</span>
          A merchant to which goods are delivered in a consignment.
        </p>
        <p>
          <span className="font-bold">Consignment.</span>
          A transaction, regardless of its form, in which a person delivers goods to a merchant for the purpose of sale and:
        </p>

        (1)   The merchant:
        <br />

        (A)   Deals in goods of that kind under a name other than the name of the person making delivery;
        <br />

        (B)   Is not an auctioneer; and
        <br />

        (C)   Is not generally known by its creditors to be substantially engaged in selling the goods of others.
        <br />

        (2)   With respect to each delivery, the aggregate value of the goods is $1,000 or more at the time of delivery;
        <br />

        (3)   The goods are not consumer goods immediately before delivery; and
        <br />

        (4)   The transaction does not create a security interest that secures an obligation.
        <br />

        <p className="">
          <span className="font-bold">Consumer Fireworks.</span> Any fireworks designed primarily for retail sale to the public during authorized dates and times, that produce visible or audible effects by combustion, and that is designed to remain on or near the ground and, while stationary or spinning rapidly on or near the ground, emit smoke, a shower of colored sparks, whistling effects, flitter sparks, or balls of colored sparks, and include combination items that contain one or more of these effects.
          Consumer fireworks include firecrackers, snakes, sparklers, fountains, and cylindrical or cone fountains that emit effects up to a height not greater than 12 feet above the ground, illuminating torches, bamboo cannons, whistles, toy smoke devices, wheels, and ground spinners that when ignited remain within a circle with a radius of 12 feet as measured from the point where the item was placed and ignited, novelty or trick items, combination items, paperless firecrackers, and other fireworks of like construction that are designed to produce the same or similar effects.
        </p>

        <p className="">
          <span className="font-bold">Display Fireworks.</span> Includes:
          <p>1) any fireworks used for exhibition display by producing visible or audible effects and classified as display fireworks or contained in the regulations of the United States Department of Transportation and designated as UN0333, UN0334, or UN0335, and includes salutes containing more than 2 grains (130 milligrams) of explosive materials, aerial shells containing more than 40 grams of pyrotechnic compositions, and other display pieces that exceed the limits of explosive materials for classification as &quot;consumer fireworks&quot;;
          </p>
          <p>2) any fireworks or articles pyrotechnic used for movie or television production activities; and
          </p>
          <p>3) any fireworks or articles pyrotechnic used for a theatrical production or sporting event.
          </p>
          <p>This term also includes fused set pieces containing components, which together exceed 50 milligrams of salute power.</p>
        </p>

        <p className="">
          <span className="font-bold">Firecracker.</span> Single paper cylinders not exceeding 1.5 inches in length excluding the fuse and 0.25 of an inch in diameter and containing a charge of not more than 50 milligrams of pyrotechnic composition.
        </p>

        <p className="">
          <span className="font-bold">Fireworks.</span> Any combustible or explosive composition, or any substance or combination of substances, or article prepared for the purpose of producing a visible or audible effect by combustion, explosion, deflagration, or detonation including but not limited to aerial devices, articles pyrotechnic, or consumer or display fireworks as defined by this article or contained in the regulations of the United States Department of Transportation as set forth in CFR Title 49.
          The term fireworks shall not include any explosives or pyrotechnics regulated under HRS Chapter 396 or automotive safety flares, nor shall the term be construed to include toy pistols, toy cannons, toy guns, party poppers, pop-its, or other devices that contain 25/100ths of a grain or less of explosive substance.
        </p>

        <p className="">
          <span className="font-bold">Import.</span> To transport or attempt to transport fireworks into the city or to cause fireworks to be transported into the city.
        </p>

        <p className="">
          <span className="font-bold">License.</span> A formal authorization issued by the fire chief pursuant to this chapter to engage in the specifically designated act or acts.
        </p>

        <p className="">
          <span className="font-bold">Permit.</span> A formal authorization issued by the fire chief to engage in the specifically designated act or acts.
        </p>

        <p className="">
          <span className="font-bold">Place of Entertainment.</span> A theater, dinner theater, hall, coliseum, convention center, arena, auditorium, stadium, concert hall, garden, outdoor space, or other place of amusement at which theatrical productions, sporting events, or other events are presented.
        </p>

        <p className="">
          <span className="font-bold">Pyrotechnic Composition or Pyrotechnic Contents.</span> The combustible or explosive component of fireworks.
        </p>

        <p className="">
          <span className="font-bold">Sporting Event.</span> Those contests, games, or other events involving athletic or physical skills that are shown to the public in a place of entertainment.
        </p>

        <p className="">
          <span className="font-bold">Theatrical Production.</span> Live-staged dramatic productions, musical productions, and concerts, which are shown to the public at a place of entertainment as defined in this section.
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.1) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.2 Prohibitions—Permitted uses.
        </p>

        <p className="">
          Except as otherwise provided in this article:
        </p>

        <div className=" space-y-2">
          <p className="">
            (1)   It shall be unlawful for any person to possess, use, explode, or cause to explode any consumer fireworks within the city;
          </p>

          <p className="">
            (2)   It shall be unlawful for any person to possess, use, explode, or cause to explode any aerial device, articles pyrotechnic, or display fireworks within the city; and
          </p>

          <p className="">
            (3)   It shall be unlawful for any person to import, store, sell, keep or offer for sale, expose for sale any fireworks within the city.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.2) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.3 Exceptions.
        </p>

        <p className="">
          The prohibitions in § <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18668#JD_20-6.2"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >20-6.2</a> shall not apply to:
        </p>

        <div className=" space-y-2">
          <p className="">
            (1)   The import, storage, sale, and use by a person having obtained a license or permit for display fireworks pursuant to §§ <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18681#JD_20-6.4"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.4
            </a> and <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18728#JD_20-6.12"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.12
            </a>;
          </p>

          <p className="">
            (2)   The import, storage, sale, and use by a person having obtained a license or permit for firecrackers pursuant to §§ <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18681#JD_20-6.4"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.4
            </a> and  <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18744#JD_20-6.13"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.13
            </a>;
          </p>

          <p className="">
            (3)   The use of flares, noisemakers, or signals for warning, pest control, or illumination purposes by the police and fire departments, utility companies, transportation agencies, and other governmental or private agencies or persons, including agricultural operations, in connection with emergencies, their duties, or business; or
          </p>

          <p className="">
            (4)   The sale or use of blank cartridges for a show or theater, or for signal, commercial, or institutional purposes in athletics or sports.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.3) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.4 License to import, store, and sell display fireworks or firecrackers.
        </p>

        <div className="space-y-2">
          <p className="">
            (a)   License required. It shall be unlawful for any person to import, store, offer to sell, sell, at wholesale or retail, for use in the city, any display fireworks or firecrackers, unless such person shall first secure a license.
          </p>

          <p className="">
            (b)   The licenses shall be issued by the fire chief and shall be nontransferable. Licenses shall specify the date of issuance or effect and the date of expiration, which shall be March 31 of each year. The application shall be made on a form setting forth the date upon which the importations are to begin, the address of the importer, and the name of the proprietor or, if a partnership, the name of the partnership and the names of all partners or, if a corporation, the name of the corporation and the names of its officers. If the fire chief discovers at a later date that a licensee has been convicted of a violation of this article, the licensee&apos;s license shall be revoked and no new license shall be issued to the licensee for two years.
          </p>

          <p className="">
            (c)   Each storage, wholesaling, and retailing facility or site shall be required to obtain a separate license. Any license issued pursuant to this article may be revoked by the fire chief if the licensee violates this article or if the licensee stores or handles the fireworks in such a manner as to present an unreasonable safety hazard.
          </p>

          <p className="">
            (d)   Display fireworks or firecrackers shall only be sold or transferred by a seller to a person with a valid permit under § <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18728#JD_20-6.12"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.12
            </a> or <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18744#JD_20-6.13"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.13
            </a>. No person with a valid permit under § <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18728#JD_20-6.12"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.12
            </a> or <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18744#JD_20-6.13"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.13
            </a> shall sell or transfer display fireworks or firecrackers to any other person.
          </p>

          <p className="">
            (e)   Any license issued pursuant to this article shall be prominently displayed in public view at each licensed location.
          </p>

          <p className="">
            (f)   Display fireworks or firecrackers shall only be imported and stored, if necessary, in an amount sufficient for an anticipated three-month inventory; provided that if a licensee provides display fireworks, firecrackers, or articles pyrotechnic more than once a month, the licensee may import or store, if necessary, sufficient display fireworks, firecrackers, or articles pyrotechnic for a six-month inventory.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.4) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.5 Requirements of licensee.
        </p>

        <div className="space-y-2">
          <p className="">
            (a)   Any person who has obtained a license under § <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18681#JD_20-6.4"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.4
            </a> and imports display fireworks or firecrackers into the city or transports such items within the city shall:
          </p>

          <div className=" space-y-2">
            <p className="">
              (1)   Clearly designate the types of display fireworks or firecrackers in each shipment on the bill of lading or shipping manifest with specificity;
            </p>

            <p className="">
              (2)   Declare on the bill of lading or shipping manifest the gross weight of display fireworks or firecrackers to be imported in each shipment and the location of the storage facility, if applicable, in which the display fireworks or firecrackers are to be stored;
            </p>

            <p className="">
              (3)   Before shipment and when booking each shipment of display fireworks or firecrackers notify the fire chief regarding whether the shipment will be distributed from:
            </p>

            <div className=" space-y-2">
              <p className="">
                (A)   Pier to pier;
              </p>

              <p className="">
                (B)   Pier to warehouse or storage facility; or
              </p>

              <p className="">
                (C)   Pier to redistribution;
              </p>
            </div>

            <p className="">
              (4)   When shipping is booked, the licensee shall notify the fire chief in writing of the expected shipment&apos;s landing date.
            </p>
          </div>

          <p className="">
            (b)   The fire chief may inspect any shipment declared on the shipping manifest as fireworks or articles pyrotechnic.
          </p>

          <p className="">
            (c)   The facility in which display fireworks or firecrackers are to be stored shall have received approval 15 days before the shipment&apos;s arrival from the fire chief and meet all State and city fire and safety codes.
          </p>

          <p className="">
            (d)   Any shipping company that receives fireworks that are imported into the city shall notify the fire chief as to whether the shipment will be distributed from:
          </p>

          <div className=" space-y-2">
            <p className="">
              (1)   Pier to pier;
            </p>

            <p className="">
              (2)   Pier to warehouse or storage facility; or
            </p>

            <p className="">
              (3)   Pier to redistribution.
            </p>
          </div>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.5) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.6 Fees—Use of revenues.
        </p>

        <p className="">
          The fee for the license required under § <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18681#JD_20-6.4"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.4
          </a> shall be $3,000 for importers, $2,000 for each wholesaler&apos;s site, $1,000 for each storage site, and $500 for each retailer&apos;s site for each year or fraction of a year in which the licensee plans to conduct business and shall be payable to the city. The license fees shall be used solely by the fire department to pay for:
        </p>

        <div className=" space-y-2">
          <p className="">
            (1)   Expenses relating to the audit of fireworks, including the inspection of inventory and storage facilities, maintenance of required records, and the training of auditors;
          </p>

          <p className="">
            (2)   Expenses relating to education regarding compliance with this article; and
          </p>

          <p className="">
            (3)   Expenses relating to the enforcement of this article.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.6) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.7 Minors.
        </p>

        <p className="">
          It shall be unlawful for any person to offer for sale, sell, or give any display fireworks or firecrackers to minors, and for any minor to possess, purchase, sell, or set off, ignite, or otherwise cause to explode any display fireworks or firecrackers.
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.7) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.8 Liability of parents or guardians.
        </p>

        <p className="">
          The parents, guardian, and other persons having the custody or control of any minor, who knowingly permit the minor to possess, purchase, or set off, ignite, or otherwise cause to explode any fireworks or articles pyrotechnic, shall be in violation of this article and shall be subject to the penalties in § <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18717#JD_20-6.9"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.9
          </a>.
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.8) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.9 Penalty.
        </p>

        <div className="space-y-2">
          <p className="">
            (a)   Any person violating § <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18668#JD_20-6.2"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.2
            </a>(1) shall be sentenced to a fine of not less than $200 and not more than $1,000 or by imprisonment of not more than 30 days, or by both such fine and imprisonment.
          </p>

          <p className="">
            (b)   Any person violating this article, other than § <a
              href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18668#JD_20-6.2"
              target="_blank"
              rel="noreferrer"
              className="text-primary cursor-pointer"
            >
              20-6.2
            </a>(1) shall be sentenced to a fine of not less than $250 and not more than $2,000 or by imprisonment of not more than one year, or by both such fine and imprisonment.
          </p>

          <p className="">
            (c)   In addition to the penalties provided in subsections (a) and (b), if the person is licensed to sell fireworks, the court may, in addition to the foregoing penalties, revoke or suspend such license. No license shall be issued to any person whose license has been so revoked or suspended until the expiration of two years after such revocation or suspension.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.9) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.10 Notice requirements.
        </p>

        <p className="">
          Each licensed retail outlet shall post adequate notice that clearly cautions each person purchasing display fireworks or firecrackers of the prohibitions, liabilities, and penalties set forth in §§ <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18711#JD_20-6.7"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.7
          </a>
          , <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18714#JD_20-6.8"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.8
          </a> and <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18717#JD_20-6.9"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.9
          </a>
          .
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.10) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.11 Forfeiture.
        </p>

        <p className="">
          Any property used or intended for use in the commission of, attempt to commit, or conspiracy to commit any violation of this article, or that facilitated or assisted such activity, and any proceeds or other property acquired or maintained with the proceeds from the violation of this article may be subject to forfeiture pursuant to HRS Chapter 712A.
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.11) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.12 Permit for display fireworks.
        </p>

        <div className="space-y-2">
          <p className="">
            (a)   Any person desiring to set off, ignite, or discharge display fireworks for a display shall apply to, and obtain a permit from the fire chief not less than 20 days before the date of the display.
          </p>

          <p className="">
            (b)   The application shall state, among other things:
          </p>

          <div className=" space-y-2">
            <p className="">
              (1)   The name, age, and address of the applicant;
            </p>

            <p className="">
              (2)   The name, age, and address of the person who will operate the display fireworks, and verification that the person is a licensed pyrotechnic operator;
            </p>

            <p className="">
              (3)   The time, date, and place of the use of the display fireworks;
            </p>

            <p className="">
              (4)   The type and quantity of aerial devices, display fireworks, or articles pyrotechnic to be used; and
            </p>

            <p className="">
              (5)   The purpose or occasion for which the display fireworks will be presented.
            </p>
          </div>

          <p className="">
            (c)   Liability coverage required.
          </p>

          <div className=" space-y-2">
            <p className="">
              (1)   In addition to any other requirements, an applicant for a display fireworks permit must submit to the fire chief evidence of a general liability insurance policy in an amount of not less than $1,000,000. A display fireworks permit may not be issued without evidence of general liability insurance as required by this section.
            </p>

            <p className="">
              (2)   The general liability insurance policy shall cover bodily injury and property damage caused by an occurrence involving the insured or the insured&apos;s servant, officer, agent, or employee in the use of display fireworks. The policy must continue to be in full force and effect for not less than 10 days after the date of the display.
            </p>

            <p className="">
              (3)   Evidence of the liability insurance policy required by this section must be in the form of a certificate of insurance issued by an insurer authorized to do business in the State and countersigned by an insurance agent licensed in the State of Hawaii.
            </p>
          </div>

          <p className="">
            The fire chief may require coverage in amounts larger than the minimum amounts set forth in subdivision (1) above if the chief deems it necessary or desirable in consideration of such factors as the location and scale of the display, the type of fireworks to be used and the number of spectators expected.
          </p>

          <p className="">
            (d)   The fire chief, pursuant to duly adopted rules, shall issue the permit after being satisfied that the requirements of subsection (c) have been met, the display will be handled by a pyrotechnic operator duly licensed by the State, the display will not be hazardous to property, and the display will not endanger human life. The permit shall authorize the holder to display aerial devices, display fireworks, or articles pyrotechnic only at the place and during the time set forth therein, and to acquire and possess the specified aerial devices, display fireworks, or articles pyrotechnic between the date of the issuance of the permit and the time during which the display of those aerial devices, display fireworks, or articles pyrotechnic is authorized.
          </p>

          <p className="">
            (e)   The fee for the permit to use display fireworks shall be $110.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.12) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.13 Permit for firecrackers.
        </p>

        <div className="space-y-2">
          <p className="">
            (a)   Any person desiring to set off, ignite, discharge, or otherwise cause to explode firecrackers on New Year&apos;s Eve, New Year&apos;s Day, Fourth of July, Chinese New Year&apos;s Day, or for cultural uses, such as, but not limited to, births, deaths, weddings, grand openings, blessings, anniversaries, and other cultural uses shall apply to and obtain a permit from the fire chief.
          </p>

          <p className="">
            (b)   The permit application shall be submitted to the fire chief not less than 10 days before the date of the use of the firecrackers, and shall state, among other things:
          </p>

          <div className=" space-y-2">
            <p className="">
              (1)   The name, age, and address of the applicant;
            </p>

            <p className="">
              (2)   The purpose of the event or celebration for which the permit is requested; and
            </p>

            <p className="">
              (3)   The date, time, and location of the use of the firecrackers.
            </p>
          </div>

          <p className="">
            (c)   No permit shall be allowed at any location where the fire chief deems that use of the firecrackers will pose a threat to public health or safety.
          </p>

          <p className="">
            (d)   The permit shall allow the use of firecrackers from 9:00 p.m. on New Year&apos;s Eve to 1:00 a.m. on New Year&apos;s Day; from 7:00 a.m. to 7:00 p.m. on Chinese New Year&apos;s Day; or from 1:00 p.m. to 9:00 p.m. on the Fourth of July. A permit for a cultural use shall allow use from 9:00 a.m. to 9:00 p.m. on the day of the requested use.
          </p>

          <p className="">
            (e)   Each permit shall allow the purchase and use of up to 5,000 individual firecrackers.
          </p>

          <p className="">
            (f)   The fee for the permit to use firecrackers shall be $25.
          </p>

          <p className="">
            (g)   The permit shall be nontransferrable, and the permittee shall have the permit available for inspection at the location where the firecrackers are to be used.
          </p>

          <p className="">
            (h)   The fire chief shall adopt rules for the administration and implementation of the permit program.
          </p>
        </div>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § 20-6.13) (Added by Ord. 10-25)
        </p>

        <p className=" font-bold">
          § 20-6.14 Severability.
        </p>

        <p className="">
          If any section, subsection, paragraph, sentence, clause, or phrase of this article is declared unconstitutional or invalid for any reason, such decision shall not affect the validity of the remaining portions of this article.
        </p>

        <p className=" italic">
          (1990 Code, Ch. 20, Art. 6, § <a
            href="https://codelibrary.amlegal.com/codes/honolulu/latest/honolulu/0-0-0-18757#JD_20-6.14"
            target="_blank"
            rel="noreferrer"
            className="text-primary cursor-pointer"
          >
            20-6.14
          </a>
          ) (Added by Ord. 10-25)
        </p>
      </div>
    </div>
  );
};

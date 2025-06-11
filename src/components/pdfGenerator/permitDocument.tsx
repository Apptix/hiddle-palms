/* eslint-disable max-lines */
import { formatDateTime } from "@/utils/index";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { counties, eventType, formatPhoneNumber, HAWAII_PAYMENT_INSTRUCTIONS } from "@/constants/index";

// Create component mappings based on cssMode
const getComponents = ( cssMode: boolean ) => {
  const components = {
    Document: cssMode ? "div" : Document,
    Page: cssMode ? "div" : Page,
    View: cssMode ? "div" : View,
    Text: cssMode ? "div" : Text
  };

  // Special handling for Image component to switch between source and src props
  const ImageComponent = cssMode
    ? ({ source, style, ...props }) => <img src={source} style={style} {...props} />
    : ({ source, style, ...props }) => <Image source={source} style={style} {...props} />;

  return { ...components, Image: ImageComponent };
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    fontSize: 10,
    lineHeight: 1.2
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottom: "1px solid black",
    paddingBottom: 5
  },
  left: {
    flexDirection: "column",
    width: "65%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "stretch"
  },
  right: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "flex-end",
    display: "flex",
    width: "35%"
  },
  title: {
    fontSize: 9,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 15
  },
  underline: {
    fontWeight: "bold",
    textDecoration: "underline"
  },
  section: {
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: "1px solid black"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  label: {
    width: "30%"
  },
  valueBox: {
    width: "70%",
    borderBottom: "1px solid black"
  },
  value: {
    fontWeight: "normal",
    minHeight: "10px"
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15
  },
  checkbox: {
    width: 12,
    height: 12,
    border: "1px solid black",
    marginRight: 5
  },
  checked: {
    backgroundColor: "black"
  },
  fullWidth: {
    width: "100%"
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    textAlign: "center"
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  signatureBox: {
    width: "45%",
    borderTop: "1px solid black",
    paddingTop: 5
  },
  officialUse: {
    borderTop: "1px solid black",
    padding: 5,
    marginTop: 10
  },
  officialUseTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5
  },
  officialUseRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5
  },
  disclaimer: {
    fontSize: 8,
    lineHeight: "10px",
    marginTop: 2,
    textAlign: "justify"
  }
});

// cssMode is used to determine if the component should be rendered in css mode to debug pdf.
export const PermitDocument = ({ data, cssMode = false }: { data: any; cssMode?: boolean }) => {
  const {
    ApplicantName = "",
    ApplicantAddress = "",
    ApplicantAge = "",
    ApplicantPhoneNumber = "",
    County = "",
    UserSignature = "",
    ApplicationStatus = "",
    InspectorSignature = "",
    InspectionTime = "",
    ExpirationDate = "",
    ApplicationDetails: {
      EventType = "",
      NameOfDisplay = "",
      LocationAddress = "",
      TMK = "",
      FiringDate = "",
      FiringTime = "",
      Quantity = "",
      FireworksClass = "",
      ControllerDetails: {
        ControllerName = "",
        ControllerPhoneNumber = "",
        ControllerAge = "",
        ControllerAddress = ""
      } = {}
    } = {},
    DocumentsUploaded: {
      PlotPlan = null,
      RightOfEntry = null,
      CertificateOfFitness = null,
      InsuranceCertificate = null
    } = {},
    ApplicationId = "",
    SubmissionTime = "",
    WholesalerVerifiedTimestamp
  } = data;
  const { date, time } = formatDateTime( WholesalerVerifiedTimestamp );

  const { Document: DocComponent, Page: PageComponent, View: ViewComponent, Text: TextComponent, Image: ImageComponent } = getComponents( cssMode );

  return (
    <DocComponent style={cssMode && { width: "676px", height: "926px" }}>
      <PageComponent size="LETTER" style={styles.page}>
        <ViewComponent style={styles.header}>
          <ViewComponent style={styles.left}>
            <TextComponent style={styles.title}>STATE OF HAWAII</TextComponent>
            <TextComponent style={styles.title}>PERMIT FOR DISPLAY OF FIREWORKS</TextComponent>
            <TextComponent style={styles.title}>
              THIS PERMIT SHALL BE PROMINENTLY DISPLAYED IN PUBLIC VIEW AT EACH PERMITTED LOCATION
            </TextComponent>
          </ViewComponent>
          <ViewComponent style={styles.right}>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>Permit No.:&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>{ApplicationId}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>Permit Fee.:&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>${HAWAII_PAYMENT_INSTRUCTIONS.amount.permit.permitFee}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>Inspection Fee.:&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>${HAWAII_PAYMENT_INSTRUCTIONS.amount.permit.inspectionFee}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>Date Received:&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>{formatDateTime( SubmissionTime ).date}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.section}>
          <ViewComponent style={styles.row}>
            <TextComponent style={{ ...styles.label, width: "20%" }}>SELECT COUNTY:</TextComponent>
            {Object.keys( counties ).map(( county ) => (
              <ViewComponent key={county} style={styles.checkboxContainer}>
                <ViewComponent style={{ ...styles.checkbox, ...( County?.toLowerCase() === counties[county]?.toLowerCase() ? styles.checked : {}) }} />
                <TextComponent>{counties[county]}</TextComponent>
              </ViewComponent>
            ))}
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.section}>
          <ViewComponent style={styles.row}>
            <TextComponent style={{ ...styles.label, width: "20%" }}>CHECK ONLY ONE EVENT:</TextComponent>
            <ViewComponent style={styles.row}>
              {Object.keys( eventType ).map(( type ) => (
                <ViewComponent key={type} style={styles.checkboxContainer}>
                  <ViewComponent style={{ ...styles.checkbox, ...( type === EventType ? styles.checked : {}) }} />
                  <TextComponent>{eventType[type]}</TextComponent>
                </ViewComponent>
              ))}
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.section}>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={{ ...styles.label, width: "29%" }}>Name:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "71%" }}>
                <TextComponent style={styles.value}>{ApplicantName}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "35%" }}>
              <TextComponent style={{ ...styles.label, width: "36%" }}>Phone No.:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "44%" }}>
                <TextComponent style={styles.value}>{formatPhoneNumber( ApplicantPhoneNumber )}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "15%" }}>
              <TextComponent style={{ ...styles.label, width: "40%" }}>Age:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "60%" }}>
                <TextComponent style={styles.value}>{ApplicantAge}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ display: "flex", flexDirection: "row", gap: 0 }}>
            <TextComponent style={{ ...styles.label, width: "18%" }}>Address:</TextComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent style={styles.value}>{ApplicantAddress}</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.section}>
          <TextComponent style={{ marginBottom: 2 }}>
            PERSON CONTROLLING THE FIRING, IF DIFFERENT THAN PERMITTEE
          </TextComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={{ ...styles.label, width: "29%" }}>Name:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "71%" }}>
                <TextComponent style={styles.value}>{ControllerName}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "35%" }}>
              <TextComponent style={{ ...styles.label, width: "36%" }}>Phone No.:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "44%" }}>
                <TextComponent style={styles.value}>{formatPhoneNumber( ControllerPhoneNumber )}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "15%" }}>
              <TextComponent style={{ ...styles.label, width: "40%" }}>Age:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "60%" }}>
                <TextComponent style={styles.value}>{ControllerAge}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ display: "flex", flexDirection: "row", gap: 0 }}>
            <TextComponent style={{ ...styles.label, width: "18%" }}>Address:</TextComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent style={styles.value}>{ControllerAddress}</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.section}>
          <TextComponent style={{ marginBottom: 2 }}>FIRING OF FIREWORKS</TextComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>Name of Display:</TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{NameOfDisplay}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>TMK#:</TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{TMK}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "100%" }}>
              <TextComponent style={{ ...styles.label, width: "15%" }}>Location Address:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "85%" }}>
                <TextComponent style={styles.value}>{LocationAddress}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>Firing Date:</TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{formatDateTime( FiringDate ).date}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>Firing Time: </TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{FiringTime}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>Quantity:</TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{Quantity}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "50%" }}>
              <TextComponent style={styles.label}>Fireworks Class:</TextComponent>
              <ViewComponent style={styles.valueBox}>
                <TextComponent style={styles.value}>{FireworksClass}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={{ ...styles.section, borderBottom: 0 }}>
          <TextComponent>DOCUMENTS PROVIDED</TextComponent>
          <ViewComponent style={{ ...styles.row, gap: 0 }}>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( CertificateOfFitness && styles.checked ) }} />
              <TextComponent>HIOSH Certificate of Fitness</TextComponent>
            </ViewComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( InsuranceCertificate && styles.checked ) }} />
              <TextComponent>Insurance Certificate or Policy</TextComponent>
            </ViewComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( RightOfEntry && styles.checked ) }} />
              <TextComponent>Right of Entry</TextComponent>
            </ViewComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( PlotPlan && styles.checked ) }} />
              <TextComponent>Plot Plan of Firing Area</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={{ marginBottom: 2, border: "2px solid black", padding: 2, fontWeight: "bold", textAlign: "center" }}>
          <TextComponent>Permittee shall obtain all required permits and approvals from applicable county, state, and federal agencies,
            as necessary, to conduct the fireworks display.
          </TextComponent>
        </ViewComponent>
        <ViewComponent style={{ ...styles.section, marginBottom: 0 }}>
          <TextComponent style={{ marginBottom: 2 }}>GENERAL PERMIT PROVISIONS AND PROHIBITIONS:</TextComponent>
          <TextComponent style={{ fontSize: "9px", lineHeight: "10px" }}>
            - A permit may only be issued to a person 18 years of age or older.
            {"\n"}- Permits are nontransferable.
            {"\n"}- Permits are valid only when the fireworks/articles of pyrotechnic are used at the site on the date and
            time indicated on the permit.
            {"\n"}- Permits may be revoked, denied, or suspended if not in compliance with Hawaii Revised Statutes (HRS)
            Chapter 132D: the Revised Ordinances of the applicable County; and the County Fire Department&apos;s Rules and
            Regulations Relating to Fireworks.
          </TextComponent>
        </ViewComponent>
        <TextComponent style={{ marginBottom: 0, fontWeight: "bold", textAlign: "center" }}>
          I have read the above and the attached HRS Chapter 132D, and certify that the information contained herein is
          accurate and that I will abide by all conditions set forth.
        </TextComponent>
        <ViewComponent style={{ ...styles.row, alignItems: "flex-end" }}>
          <ViewComponent style={{ ...styles.column, width: "50%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{ApplicantName}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "50%", height: "30px", justifyContent: "flex-end" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              {WholesalerVerifiedTimestamp && (
                <>
                  <TextComponent>
                    Digitally signed by {ApplicantName},
                  </TextComponent>
                  <TextComponent>
                    Date: {date} {time}
                  </TextComponent>
                </>
              )}
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={{ ...styles.row, alignItems: "flex-end" }}>
          <ViewComponent style={{ ...styles.column, width: "50%" }}>
            <TextComponent>Print Name of Permittee/Applicant</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "50%" }}>
            <ViewComponent>
              <TextComponent>Wholesaler Signature</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>

        <ViewComponent style={{ ...styles.row, alignItems: "flex-end", height: "30px" }}>
          <ViewComponent style={{ ...styles.column, width: "30%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              {/* Need to change  */}
              <ImageComponent
                source={UserSignature}
                style={{ height: "30px" }}
              />
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{formatDateTime( SubmissionTime ).date}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "30%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{FireworksClass}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{Quantity}</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>

        <ViewComponent style={{ ...styles.row, alignItems: "flex-end" }}>
          <ViewComponent style={{ ...styles.column, width: "30%" }}>
            <TextComponent>Signature of Permittee/Applicant</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>
            <TextComponent>Date</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "30%" }}>
            <TextComponent>Fireworks Type</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>
            <TextComponent>Quantity</TextComponent>
          </ViewComponent>
        </ViewComponent>

        <ViewComponent style={styles.officialUse}>
          <TextComponent style={styles.officialUseTitle}>FOR OFFICIAL USE ONLY</TextComponent>
          <ViewComponent style={styles.row}>
            <TextComponent>Permit</TextComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( ApplicationStatus === "approved" && styles.checked ) }} />
              <TextComponent>APPROVED</TextComponent>
            </ViewComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( ApplicationStatus === "rejected" && styles.checked ) }} />
              <TextComponent>DENIED</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, alignItems: "flex-end", height: "30px" }}>
            <ViewComponent style={{ ...styles.column, width: "50%" }}>
              <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
                <ImageComponent
                  source={InspectorSignature}
                  style={{ height: "30px" }}
                />
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.column, width: "50%" }}>
              <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
                <TextComponent>{formatDateTime( InspectionTime ).date}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, alignItems: "flex-end" }}>
            <ViewComponent style={{ ...styles.column, width: "50%", textAlign: "center" }}>
              <TextComponent>Fire Chief or Designee</TextComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.column, width: "50%" }}>
              <TextComponent>Date</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <TextComponent style={styles.disclaimer}>
          THIS PERMIT IS NOT AN ASSURANCE THAT THE USE OF FIREWORKS/ARTICLES PYROTECHNIC DOES NOT POSE A THREAT TO
          THE SAFETY OF PERSONS AND PROPERTY. YOU WILL BE HELD RESPONSIBLE FOR DAMAGES RESULTING FROM YOUR USE
          OF FIREWORKS/ARTICLES PYROTECHNIC. THE APPLICABLE COUNTY DOES NOT BEAR RESPONSIBILITY FOR ANY DAMAGE,
          AS A RESULT OF YOUR USE OF FIREWORKS/ARTICLES PYROTECHNIC TO YOURSELF OR OTHERS. ANY PERSON VIOLATING
          ANY PROVISION OF HRS CHAPTER 132D, COUNTY ORDINANCES, THE FIRE CODE OF THE APPLICABLE COUNTY, AND COUNTY
          FIRE DEPARTMENT&apos;S RULES AND REGULATIONS RELATING TO FIREWORKS SHALL BE SUBJECT TO THE PENALTIES
          PROVIDED IN HRS SECTION 132D-14 AND/OR THE FIRE CODE OF THE APPLICABLE COUNTY.
        </TextComponent>
        <ViewComponent style={{ ...styles.row, marginTop: "10px" }}>
          <TextComponent style={styles.disclaimer}>
            THE PERMIT IS VALID FROM THE DATE OF ISSUANCE THROUGH
          </TextComponent>
          <ViewComponent style={{ ...styles.valueBox, width: "45%" }}>
            <TextComponent style={styles.value}>{formatDateTime( ExpirationDate )?.date}</TextComponent>
          </ViewComponent>
        </ViewComponent>
      </PageComponent>
    </DocComponent>
  );
};

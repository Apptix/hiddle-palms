import { capitalize, formatDateTime } from "@/utils/index";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { counties, licenseType, formatPhoneNumber, HAWAII_PAYMENT_INSTRUCTIONS } from "@/constants/index";

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

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 20,
    fontSize: 10,
    lineHeight: 1
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
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
    fontWeight: "bold",
    marginBottom: 2
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
    gap: 4,
    marginBottom: "2px"
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
    textAlign: "justify",
    fontWeight: "bold"
  }
});

export const LicenseDocument = ({ data, cssMode = false }: { data: any; cssMode?: boolean }) => {
  const {
    ApplicantName = "",
    ApplicantAddress = "",
    ApplicantAge = "",
    ApplicantPhoneNumber = "",
    County = "",
    UserSignature = "",
    InspectorSignature = "",
    InspectionTime = "",
    ExpirationDate = "",
    ApplicationStatus = "",
    ApplicationDetails: {
      LicenseType = "",
      DateActivityBegins = "",
      FireworksClass = "",
      Quantity = "",
      SiteAddress = "",
      SiteBusinessName = "",
      SitePhoneNumber = "",
      EntityType,
      EntityDetails: {
        EntityName = "",
        Officers = [],
        Partners = []
      } = {}
    } = {},
    ApplicationId = "",
    SubmissionTime = ""
  } = data ?? {};

  const { Document: DocComponent, Page: PageComponent, View: ViewComponent, Text: TextComponent, Image: ImageComponent } = getComponents( cssMode );

  return (
    <DocComponent style={cssMode && { width: "676px", height: "926px" }}>
      <PageComponent size="LETTER" style={styles.page}>
        <ViewComponent style={styles.header}>
          <ViewComponent style={styles.left}>
            <TextComponent style={styles.title}>STATE OF HAWAIII FIREWORKS/ARTICLES PYROTECHNIC LICENSE</TextComponent>
            <TextComponent style={styles.title}>HAWAII REVIESED STATUTES (HRS) CHAPTER 132D,</TextComponent>
            <TextComponent style={styles.title}>THE FIRE CODE AND THE RULES AND REGULATIONS RELATING TO</TextComponent>
            <TextComponent style={styles.title}>FIREWORKS OF THE APPLICABLE CITY/COUNTY OF (Select one)</TextComponent>
          </ViewComponent>
          <ViewComponent style={styles.right}>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>License No.&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>{ApplicationId}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>License Fee Rcvd.&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>${HAWAII_PAYMENT_INSTRUCTIONS.amount?.license?.[LicenseType]}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "100%", gap: 0 }}>
              <TextComponent style={{ ...styles.label, width: "45%", textAlign: "right" }}>Date Rcvd.&nbsp;</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                <TextComponent style={styles.value}>{formatDateTime( SubmissionTime )?.date}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>

        <ViewComponent style={{ ...styles.row, justifyContent: "center", padding: "5px" }}>
          {Object.keys( counties ).map(( county ) => (
            <ViewComponent key={county} style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( County === counties[county]?.toLowerCase() ? styles.checked : {}) }} />
              <TextComponent>{counties[county]}</TextComponent>
            </ViewComponent>
          ))}
        </ViewComponent>

        <ViewComponent style={{ justifyContent: "center", marginBottom: "5px" }}>
          <TextComponent style={{ ...styles.title, textAlign: "center" }}>
            THIS LICENSE SHALL BE PROMINENTLY DISPLAYED IN PUBLIC VIEW AT EACH LICENSED LOCATION
          </TextComponent>
        </ViewComponent>

        <ViewComponent style={styles.section}>
          <TextComponent style={{ ...styles.label, width:"20%" }}>LICENSEE:</TextComponent>
          <ViewComponent style={styles.row}>
            <ViewComponent style={{ ...styles.row, width: "40%" }}>
              <TextComponent style={{ ...styles.label, width:"28%" }}>Name:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width:"72%" }}>
                <TextComponent style={styles.value}>{ApplicantName}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "35%" }}>
              <TextComponent style={{ ...styles.label, width:"55%" }}>Business Phone No:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width:"45%" }}>
                <TextComponent style={styles.value}>{formatPhoneNumber( ApplicantPhoneNumber )}</TextComponent>
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.row, width: "25%" }}>
              <TextComponent style={{ ...styles.label, width:"70%" }}>Age of Applicant:</TextComponent>
              <ViewComponent style={{ ...styles.valueBox, width:"30%" }}>
                <TextComponent style={styles.value}>{ApplicantAge}</TextComponent>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap: 0 }}>
            <TextComponent style={{ ...styles.label, width: "15%" }}>Business Address:</TextComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "85%" }}>
              <TextComponent style={styles.value}>{ApplicantAddress}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap: 0, marginTop: "5px" }}>
            <ViewComponent style={{ ...styles.checkboxContainer, marginBottom: "5px" }}>
              <ViewComponent style={{ ...styles.checkbox, ...( EntityType === "sole-proprietor" ? styles.checked : {}) }} />
              <TextComponent>SOLE PROPRIETOR (Name of proprietor)</TextComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "65%" }}>
              <TextComponent style={styles.value}>{EntityType === "sole-proprietor" && EntityName}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap:0 }}>
            <ViewComponent style={{ ...styles.checkboxContainer, marginBottom: "5px" }}>
              <ViewComponent style={{ ...styles.checkbox, ...( EntityType === "partnership" ? styles.checked : {}) }} />
              <TextComponent>PARTNERSHIP (Name of partnership and partners)</TextComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
              <TextComponent style={styles.value}>{EntityType === "partnership" && EntityName}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap: 0, marginTop: "5px" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent style={styles.value}>{EntityType === "partnership" && Partners?.join( "; " )}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap:0, marginTop: "5px" }}>
            <ViewComponent style={{ ...styles.checkboxContainer, marginBottom: "5px" }}>
              <ViewComponent style={{ ...styles.checkbox, ...( EntityType === "corporation" ? styles.checked : {}) }} />
              <TextComponent>CORPORATION (Name of corporation and names and titles of its officers)</TextComponent>
            </ViewComponent>
            <ViewComponent style={{ ...styles.valueBox, width: "40%" }}>
              <TextComponent style={styles.value}>{EntityType === "corporation" && EntityName}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.row, gap:0 }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent style={styles.value}>{EntityType === "corporation" && Officers?.join( "; " )}</TextComponent>
            </ViewComponent>

          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={{ ...styles.column, gap: 0 }}>
          {/* Replace the map with a conditional rendering for the specific license type */}
          {Object.keys( licenseType ).filter( license => license === LicenseType.toLowerCase()).map(( license ) => (
            <ViewComponent style={{ ...styles.section, marginBottom: "5px" }} key={license}>
              <ViewComponent style={{ ...styles.row, justifyContent: "space-between" }}>
                <ViewComponent key={license} style={{ ...styles.checkboxContainer, marginBottom: "5px" }}>
                  <ViewComponent style={{ ...styles.checkbox, ...( LicenseType === license ? styles.checked : {}) }} />
                  <TextComponent>{licenseType[license]}</TextComponent>
                </ViewComponent>
                <ViewComponent style={{ ...styles.row, width: "38%" }}>
                  <TextComponent style={{ ...styles.label, width: "55%" }}>
                    Date { LicenseType === "importer" ? "Importation" : "Activity"} Begins:
                  </TextComponent>
                  <ViewComponent style={{ ...styles.valueBox, width: "45%" }}>
                    <TextComponent style={styles.value}>{formatDateTime( DateActivityBegins )?.date}</TextComponent>
                  </ViewComponent>
                </ViewComponent>
              </ViewComponent>
              {
                license !== "importer" && (
                  <ViewComponent style={styles.row}>
                    <ViewComponent style={{ ...styles.row, width: "100%" }}>
                      <TextComponent style={{ ...styles.label, width:"26%" }}>
                        Business Name of {capitalize( license )} Site:
                      </TextComponent>
                      <ViewComponent style={{ ...styles.valueBox, width:"74%" }}>
                        <TextComponent style={styles.value}>{capitalize( SiteBusinessName )}</TextComponent>
                      </ViewComponent>
                    </ViewComponent>
                  </ViewComponent>
                )
              }
              <ViewComponent style={{ ...styles.row, width: "100%" }}>
                <TextComponent style={{ ...styles.label, width: "25%" }}>
                  Address Of {LicenseType === "importer" ? "Storage" : capitalize( LicenseType ) } Site:
                </TextComponent>
                <ViewComponent style={{ ...styles.valueBox, width: "75%" }}>
                  <TextComponent style={styles.value}>{SiteAddress}</TextComponent>
                </ViewComponent>
              </ViewComponent>
              <ViewComponent style={styles.row}>
                {license !== "importer" && (
                  <ViewComponent style={{ ...styles.row, width: "48%" }}>
                    <TextComponent style={{ ...styles.label, width: "55%" }}>
                      Phone No. of {LicenseType === "importer" ? "Storage" : capitalize( LicenseType ) } Site:
                    </TextComponent>
                    <ViewComponent style={{ ...styles.valueBox, width: "45%" }}>
                      <TextComponent style={styles.value}>{formatPhoneNumber( SitePhoneNumber )}</TextComponent>
                    </ViewComponent>
                  </ViewComponent>
                )}
                <ViewComponent style={{ ...styles.row, width: "32%" }}>
                  <TextComponent style={{ ...styles.label, width: "45%" }}>Fireworks Class:</TextComponent>
                  <ViewComponent style={{ ...styles.valueBox, width: "55%" }}>
                    <TextComponent style={styles.value}>{FireworksClass}</TextComponent>
                  </ViewComponent>
                </ViewComponent>
                <ViewComponent style={{ ...styles.row, width: "20%" }}>
                  <TextComponent style={{ ...styles.label, width:"40%" }}>Quantity:</TextComponent>
                  <ViewComponent style={{ ...styles.valueBox, width:"60%" }}>
                    <TextComponent style={styles.value}>{Quantity}</TextComponent>
                  </ViewComponent>
                </ViewComponent>
              </ViewComponent>
            </ViewComponent>
          ))}
        </ViewComponent>
        <TextComponent style={{ marginTop: 2, marginBottom: 0, fontWeight: "bold" }}>
          I have read the above and certify that the information contained herein is accurate and that I will abide by all conditions set
          forth herein and of HRS Chapter 132D, the Fire Code abd the Rules and Regulations Relating to Fireworks of the applicable City/County.
        </TextComponent>
        <ViewComponent style={{ ...styles.row, alignItems: "flex-end", height: "30px" }}>
          <ViewComponent style={{ ...styles.column, width: "40%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{ApplicantName}</TextComponent>
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "40%" }}>
            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <ImageComponent
                source={UserSignature}
                style={{ height: "30px" }}
              />
            </ViewComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>

            <ViewComponent style={{ ...styles.valueBox, width: "100%" }}>
              <TextComponent>{formatDateTime( SubmissionTime )?.date}</TextComponent>
            </ViewComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={{ ...styles.row, alignItems: "flex-end" }}>
          <ViewComponent style={{ ...styles.column, width: "40%" }}>
            <TextComponent style={{ textAlign: "center", fontWeight: "bold" }}>Print Name of Applicant</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "40%" }}>
            <TextComponent style={{ textAlign: "center", fontWeight: "bold" }}>Signature of Applicant</TextComponent>
          </ViewComponent>
          <ViewComponent style={{ ...styles.column, width: "20%" }}>
            <TextComponent style={{ textAlign: "center", fontWeight: "bold" }}>Date</TextComponent>
          </ViewComponent>
        </ViewComponent>
        <ViewComponent style={styles.officialUse}>
          <TextComponent style={styles.officialUseTitle}>FOR OFFICIAL USE ONLY</TextComponent>
          <ViewComponent style={styles.row}>
            <TextComponent>RECOMMEND</TextComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( ApplicationStatus === "approved" && styles.checked ) }} />
              <TextComponent>APPROVAL</TextComponent>
            </ViewComponent>
            <ViewComponent style={styles.checkboxContainer}>
              <ViewComponent style={{ ...styles.checkbox, ...( ApplicationStatus === "rejected" && styles.checked ) }} />
              <TextComponent>DENIAL</TextComponent>
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
                <TextComponent>{formatDateTime( InspectionTime )?.date}</TextComponent>
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
          Violations of provisions of this license are punishable to provide in the HRS Section 132D-8.6, 132D-14
          and/or the Fire Code of the applicable City/County. This license is nontransferable.
        </TextComponent>
        <ViewComponent style={styles.row}>
          <TextComponent style={styles.disclaimer}>
            THE LICENSE IS VALID FROM THE DATE OF ISSUANCE THROUGH
          </TextComponent>
          <ViewComponent style={{ ...styles.valueBox, width: "45%" }}>
            <TextComponent style={styles.value}>{formatDateTime( ExpirationDate )?.date}</TextComponent>
          </ViewComponent>
        </ViewComponent>
      </PageComponent>
    </DocComponent>
  );
};

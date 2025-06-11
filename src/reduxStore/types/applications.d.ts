interface IApplication {
  ApplicationType: "License" | "Pemit",
  County : string,
  ApplicantName : string,
  ApplicantPhoneNumber : string,
  ApplicantAddress: string,
  ApplicantAge : number,
  ApplicationDetails : dict
}

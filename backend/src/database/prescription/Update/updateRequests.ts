import { PrescriptionDTO } from "@models/Prescription";

export async function updateRequests(prescriptionId, action) {
  try {
    const prescription = await PrescriptionDTO.findById(prescriptionId);

    if (!prescription) {
      throw "No Prescription found";
    }

    prescription.status = 1 // Status denied

    if (action === "Approved") {
      prescription.remainingRefills =
        prescription.remainingRefills + prescription.requestedRefills;
      prescription.status = 2 // Status approved
    }

    prescription.requestedRefills = 0;

    await prescription.save();
  } catch (error) {
    throw error;
  }
}

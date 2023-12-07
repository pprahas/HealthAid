import { PrescriptionDTO } from "@models/Prescription";

export async function updateRequests(prescriptionId, action) {
  try {
    const prescription = await PrescriptionDTO.findById(prescriptionId);

    if (!prescription) {
      throw "No Prescription found";
    }

    if (action === "Approved") {
      prescription.remainingRefills =
        prescription.remainingRefills + prescription.requestedRefills;
    }

    prescription.requestedRefills = 0;

    await prescription.save();
  } catch (error) {
    throw error;
  }
}

import { PrescriptionDTO } from "@models/Prescription";

export async function updateRequestedRefills(prescriptionId, requestedRefills) {
  try {
    const prescription = await PrescriptionDTO.findById(prescriptionId);

    if (!prescription) {
      throw "No Prescription found";
    }

    prescription.requestedRefills = requestedRefills;

    await prescription.save();
  } catch (error) {
    throw error;
  }
}

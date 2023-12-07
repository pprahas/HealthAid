import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";
import { PrescriptionDTO } from "@models/Prescription";
import nodemailer from 'nodemailer';

export enum PrescriptionError {
  patientAccountNotFound = "Patient account with the given ID does not exist",
  doctorAccountNotFound = "Doctor account with the given ID does not exist",
}

export async function createPrescription(
  patientId,
  doctorId,
  date,
  reminderCycle,
  name,
  remainingRefills,
) {
  try {
    const patientAccount = await PatientDTO.findById(patientId);
    if (!patientAccount) {
      throw PrescriptionError.patientAccountNotFound;
    }

    const doctorAccount = await DoctorDTO.findById(doctorId);
    if (!doctorAccount) {
      throw PrescriptionError.doctorAccountNotFound;
    }

    const newPrescription = new PrescriptionDTO({
      patientId: patientId,
      doctorId: doctorId,
      date: date,
      reminderCycle: reminderCycle,
      name: name,
      remainingRefills: remainingRefills,
    });

    patientAccount.prescriptions.push(newPrescription._id);
    doctorAccount.prescriptions.push(newPrescription._id);

    await newPrescription.save();
    await patientAccount.save();
    await doctorAccount.save();

    sendEmail(patientAccount,
      name,
      date,
      reminderCycle,
      remainingRefills);

  } catch (error) {
    throw error;
  }
}

async function sendEmail(patientAccount,
  drugName,
  date,
  reminderCycle,
  remainingRefills) {
  // Set email options
  const yourHTMLContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>HealthAid Prescription</title>
    <style>
        /* Your CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #3498db;
        }

        p {
            margin-bottom: 15px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
        }
    </style>
</head>
  <body>
    <div class="container">
        <h1>Prescription Created for Your HealthAid Appointment</h1>

        <p>
            Dear ${patientAccount.firstName},
        </p>

        <p>
            I hope this message finds you well. We want to inform you that your prescription has been successfully created following your recent telehealth appointment with HealthAid.
        </p>

        <p><strong>Prescription Details:</strong></p>
        <ul>
            <li><strong>Patient Name:</strong> ${patientAccount.firstName} ${patientAccount.lastName}</li>
            <li><strong>Medication:</strong> ${drugName}</li>
            <li><strong>Cycle:</strong> ${reminderCycle}</li>
            <li><strong>Remaining Refills:</strong> ${remainingRefills}</li>
            <li><strong>Date Prescribed:</strong> ${date}</li>
        </ul>

        <p>
            Please take a moment to review the prescription details provided above. If you have any questions or concerns regarding your medication or treatment plan, our dedicated healthcare professionals are here to assist you.
        </p>

        <p>
            As part of our commitment to your well-being, we encourage you to adhere to the prescribed medication schedule and reach out to us if you experience any unexpected side effects or have questions about your treatment.
        </p>

        <p>
            Thank you for choosing HealthAid for your telehealth needs. We value your trust and are dedicated to providing you with the highest quality healthcare services.
        </p>

        <p>
            HealthAid Telehealth Team<br>
            www.HealthAid.com
        </p>

        <p class="footer">
            This is an automated message. Please do not reply to this email.
        </p>
    </div>
</body>
  </html>
  `;

  // Set email options
  const mailOptions = {
    from: 'enjoyagoals@gmail.com', // Sender
    to: patientAccount.email, // Recipient
    subject: 'HealthAid - Prescription has been created', // Email subject
    html: yourHTMLContent, // Email HTML content
  };
  // Create a transport for sending emails (replace with your email service's data)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: 'enjoyagoals@gmail.com',
      pass: 'vqty hujx qqxy ptzk',
    },
  });

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}




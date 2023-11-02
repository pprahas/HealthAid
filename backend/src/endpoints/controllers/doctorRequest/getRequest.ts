import { Request, Response } from "express";
import { getRequest as getReq } from "@database/doctorRequest/getRequest";

export async function getRequest(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const req = await getReq();
    return res.status(200).send(req);
  } catch (error) {
    return res.status(400).send(error);
  }
}

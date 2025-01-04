import { randomBytes } from "crypto";
import apiResponse from "../../../utils/apiResponse.js";
import apiError from "../../../utils/apiError.js";

export default async function handler(req, res) {

  try {
    if (req.method === "GET") {
      const nonce = randomBytes(16).toString("hex");
      const timestamp = Date.now();
      res.status(200).json(
          new apiResponse(
              200,
              {nonce: nonce, timestamp: timestamp},
              "Nonce generated"
          )
      );
    } else {
      res.status(405).json(
          new apiError(
              405,
              "Method not allowed"
          )
      );
    }
  } catch (error) {
    throw new apiError(
        500,
        error.message || "Internal Server Error"
    )
  }
}

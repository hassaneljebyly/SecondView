import { useEffect } from "react";
import { SUCCESS_MESSAGE_DURATION } from "../../utils/constant";

export default function SubmissionSuccessful({
  restHandler,
}: {
  restHandler: () => void;
}) {
  useEffect(() => {
    const timeOutID = setTimeout(() => {
      restHandler();
    }, SUCCESS_MESSAGE_DURATION);
    return () => clearTimeout(timeOutID);
  });
  return <p>✓ Note submitted successfully</p>;
}

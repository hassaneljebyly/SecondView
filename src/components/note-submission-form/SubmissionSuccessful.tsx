import { useEffect, useState } from "react";

export default function SubmissionSuccessful() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1500);
    return () => clearTimeout(timeoutID);
  }, []);
  return showSuccessMessage && <p>✓ Note submitted successfully</p>;
}

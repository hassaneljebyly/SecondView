import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Button from "../components/Button";

function main() {
  const container = document.getElementById("secondView");
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <Button />
      </StrictMode>
    );
  } else {
    const div = document.createElement("div");
    div.setAttribute("id", "secondView");
    document.body.appendChild(div);
    setTimeout(main);
  }
}

main();

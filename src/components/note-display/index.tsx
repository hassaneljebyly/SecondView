const exampleNotes = [
  {
    start: 45, // 0:45
    end: 78, // 1:18
    category: "ERROR",
    note: "The presenter states that penguins live in the Arctic, but penguins are actually found in the Antarctic and Southern Hemisphere. Polar bears live in the Arctic.",
  },
  {
    start: 234, // 3:54
    end: 267, // 4:27
    category: "MISLEADING_CONTENT",
    note: "This statistic is from 2015 and is outdated. According to recent 2024 data from the same organization, this number has actually decreased by 40%.",
  },
  {
    start: 445, // 7:25
    end: 490, // 8:10
    category: "FALSE_CONTEXT",
    note: "This quote is real but taken out of context. The speaker was referring to a hypothetical scenario, not making a factual claim about current events.",
  },
];

export default function NoteDisplay() {
  return <div>index</div>;
}

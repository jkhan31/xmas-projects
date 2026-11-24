# Gift Wrap Calculator

Posts Dec 14 and 16. Build Dec 7-9, film Dec 10, edit Dec 11 (original plan, not re-checked).

Three numbers in, one clear answer out: the minimum paper size, a picture of the layout, and how to fold it.

## Formula (my own derivation, so test it first), with overlap m of at least 1 in or 2.5 cm

- Around the box: 2 x (width + height) + m
- Along the box: length + the larger of width and height + m
- Example: a 10 x 6 x 4 in box needs a sheet of 21 x 17 in.

## Build steps

1. Test the formula first, before any visuals: wrap three real boxes of different shapes with paper cut to the answer. If a gap shows, adjust the end-flap rule and note what you changed.
2. Inputs: length, width, height, a units switch (inches or centimetres), and an overlap setting that cannot go below 1 in or 2.5 cm.
3. Answer: the sheet size, rounded up to a practical cut, with checks for bad input such as zero or negative numbers.
4. Paper layout drawing: code-drawn SVG that scales to the sheet and marks the faces, seam overlap, end flaps and fold lines.
5. Box render: a simple 3D-style box that resizes as the numbers change.
6. Fold steps: four static drawings: wrap and tape the seam, pinch the ends, fold in the side flaps, fold down the top flap and tape.
7. Optional: enter a roll width and see whether the sheet fits and how much length to cut.

## Security

Nothing is stored or sent. All inputs are numbers checked for limits.

## Film

Measure a real box, type the numbers, show the layout on screen, cut and wrap. Second post: the three-box test, including any gap and the fix.

## Done when

Three real boxes wrap with no gaps at the seams, and the layout and fold drawings match what you did by hand.

## Prerequisites

Three real boxes of different shapes by Dec 6, wrapping paper, tape measure, scissors, tape. Nothing else: Claude draws the layout and fold steps as SVG. Biggest risk: the formula is wrong for odd box shapes.

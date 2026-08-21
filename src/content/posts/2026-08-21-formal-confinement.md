---
title: Formal Confinement Prototype
---

_Linkpost: **[formal-confinement.pdf](/papers/formal-confinement.pdf)**. Comment on [lw](https://www.lesswrong.com/s/f9ewpmtz8AogLxvqx/p/yZvrRWM5DE58CzHpZ)_.

## Abstract: 
> We would like to put the AI in a box. We show how to create an interface between the box and the world out of specifications in Lean. It is the AI's responsibility to provide a proof that its (restricted) output abides by the spec. The runnable prototype is at https://github.com/for-all-dev/formal-confinement.

We propose confining an AI behind an interface built from formal specifications: rather than isolation alone, the confined system must produce a machine-checked Lean proof that its outputs satisfy predefined conditions before they're released, drawing on classical computer security concepts adapted for AI safety. Verification overhead ran 1.5–4.2x over the unverified baseline across our benchmarks.

Full writeup: .

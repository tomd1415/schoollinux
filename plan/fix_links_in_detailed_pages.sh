#!/usr/bin/env bash

# This script updates the navigation link in each detailed phase page.
# It changes the text from "Original Phase X" to "Phase X",
# ensures the link points to the detailed page, and adds class="selected" to the <li> tag.

# For Phase 1 (Detailed)
sed -i 's|<li><a href="phase-1-detailed.html">Original Phase 1</a></li>|<li class="selected"><a href="phase-1-detailed.html">Phase 1</a></li>|g' phase-1-detailed.html

# For Phase 2 (Detailed)
sed -i 's|<li><a href="phase-2-detailed.html">Original Phase 2</a></li>|<li class="selected"><a href="phase-2-detailed.html">Phase 2</a></li>|g' phase-2-detailed.html

# For Phase 3 (Detailed)
sed -i 's|<li><a href="phase-3-detailed.html">Original Phase 3</a></li>|<li class="selected"><a href="phase-3-detailed.html">Phase 3</a></li>|g' phase-3-detailed.html

# For Phase 4 (Detailed)
sed -i 's|<li><a href="phase-4-detailed.html">Original Phase 4</a></li>|<li class="selected"><a href="phase-4-detailed.html">Phase 4</a></li>|g' phase-4-detailed.html


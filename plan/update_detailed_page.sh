#!/usr/bin/env bash

# This script modifies the navigation in each phase-X-detailed.html file.
# It removes the link to the original phase-X.html page and replaces it
# with a highlighted, non-clickable element, indicating the current page.

# For Phase 1
sed -i 's|<li><a href="phase-1.html">Phase 1</a></li>|<li><strong>Phase 1 (Detailed)</strong></li>|g' phase-1-detailed.html

# For Phase 2
sed -i 's|<li><a href="phase-2.html">Phase 2</a></li>|<li><strong>Phase 2 (Detailed)</strong></li>|g' phase-2-detailed.html

# For Phase 3
sed -i 's|<li><a href="phase-3.html">Phase 3</a></li>|<li><strong>Phase 3 (Detailed)</strong></li>|g' phase-3-detailed.html

# For Phase 4
sed -i 's|<li><a href="phase-4.html">Phase 4</a></li>|<li><strong>Phase 4 (Detailed)</strong></li>|g' phase-4-detailed.html


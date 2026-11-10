# Performance pass status

The final build passes strict TypeScript and Vite production compilation. An early click on the inline ignition screen was handed to the React gate correctly; the mobile smoke pass opened all seven routes with no browser errors.

Mobile Lighthouse reached 96 in both High and Low quality. The final high run reported 2.3 s LCP and the low run 2.4 s. Before ignition, measured route transfers were about 100–130 KB and all emitted JavaScript chunks total about 128 KB gzip.

The full route matrix was captured before the last adjustment that starts idle module and stop-art preloading during the ignition animation. Its normal-speed results met the frame targets across desktop and mobile. The 4× CPU stress profile and preset transitions still showed jank, so those stress targets are not marked as passed. The final preloading adjustment builds cleanly and all routes smoke-tested, but the full matrix was not repeated after it.

Thirteen of fourteen high-quality screenshot comparisons passed. The remaining Roomly 390 px comparison differs by about 3% because the saved baseline shows an empty project card while the current page shows its project copy. The baseline capture stayed on the card's paused entrance animation even after waiting; this is a fixture mismatch, not a measured layout displacement.

The two-minute leak check passed before the final gate and idle-preload changes; it was not repeated on the final build. Live Vercel cache and Brotli response headers could not be checked because no production deployment URL is configured in the repository.

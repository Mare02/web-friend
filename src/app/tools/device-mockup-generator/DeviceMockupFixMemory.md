Here is the step-by-step implementation plan to switch your `device-mockup.tsx` tool to the **Blob + crossOrigin Patch**, which will drastically reduce browser RAM usage by ~90% compared to Base64.

### 📋 Implementation Plan: Memory-Efficient Blob Patch

#### 1. Revert `handleImageUpload` to use `URL.createObjectURL`
We will remove the `FileReader` (Base64) logic. Instead, we'll use `URL.createObjectURL` which is the most memory-efficient way for browsers to reference a file directly from the user's disk without loading its raw binary into your React state.

*   **Step:** Update `handleImageUpload` to generate a blob URL.
*   **Step:** Ensure we continue to call `URL.revokeObjectURL(oldImageUrl)` when an image is replaced or the frame is removed, which is critical to avoid "ghost" memory leaks.

#### 2. Apply `crossOrigin="anonymous"` to the Preview `<img>`
The main reason `blob:` URLs sometimes break in canvas-drawing libraries is a "Tainted Canvas" security error. Adding the `crossOrigin` attribute to your `<img>` tag tells the browser's rendering engine that this image is safe to be cloned into a canvas.

*   **Step:** Locate the `img` tag inside the phone model screen (around line 438).
*   **Step:** Add `crossOrigin="anonymous"` and `data-screenshot-no-fetch` (a special hint for many modern screenshot libs) to the attributes.

#### 3. Update `modern-screenshot` Options
We need to ensure the export library is explicitly told to handle cross-origin assets correctly so it doesn't fail when it sees a `blob:` URL.

*   **Step:** Add `useCORS: true` and `cacheBust: false` to the `options` object inside both `handleExport` and `copyToClipboard`.
*   **Step:** Keep `skipFonts: true` as we found that was a separate Next.js font issue.

#### 4. Clean Up Memory on Unmount
To make this truly professional, we should ensure all generated blob URLs are wiped when the user leaves the page.

*   **Step:** Add a `useEffect` cleanup function that iterates over all `frames` and calls `URL.revokeObjectURL` on any active image URLs.

---

### Why this fixes the RAM problem:
*   **Base64 (Current):** If you upload a 5MB image, React stores a ~6.5MB string in memory. If you have 5 screens, that's **32.5MB** just in raw text strings in your browser's RAM.
*   **Blob (Plan):** The browser just stores a tiny **~50-character string** (the URL). The actual 5MB image stays compressed on the disk/cache. 5 screens = **~250 bytes** of RAM in React state.

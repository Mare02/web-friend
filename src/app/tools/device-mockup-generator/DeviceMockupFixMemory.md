Refactor this React mockup generator to eliminate memory leaks and high CPU usage caused by DOM rendering and screenshot-based exports.

### Goals

* Remove performance bottlenecks (especially `modern-screenshot`)
* Reduce memory usage from large images and blob URLs
* Prevent unnecessary re-renders
* Keep UI behavior identical
* Improve export performance and reliability

---

### Required Changes

#### 1. Replace DOM screenshot export with Canvas-based renderer

* Remove usage of `modern-screenshot`
* Implement a utility function:

```ts
async function renderMockupToCanvas(frames, model, settings): Promise<HTMLCanvasElement>
```

* Use `<canvas>` API to:

  * Draw background (gradient or solid color)
  * Draw device frame (rounded rectangle + bezel simulation)
  * Clip screen area using `ctx.clip()`
  * Render uploaded images with:

    * translate (x, y)
    * scale
    * rotation
  * Apply shadow using `ctx.shadowBlur` and `ctx.shadowColor`

* Export using:

```ts
canvas.toBlob()
```

---

#### 2. Downscale uploaded images before storing

* When user uploads an image:

  * Resize it using `createImageBitmap` or `<canvas>`
  * Max width: ~1000–1500px
* Store optimized version instead of full-resolution file

---

#### 3. Fix blob URL memory handling

* Avoid long-lived blob URLs where possible
* Prefer base64 or preprocessed images
* If blob URLs are used:

  * Revoke immediately after image is loaded
  * Ensure no stale references remain in state

---

#### 4. Optimize frame rendering

* Extract frame into a separate component:

```ts
const Frame = React.memo(...)
```

* Ensure:

  * Only the updated frame re-renders
  * Avoid recreating entire frames array unnecessarily

---

#### 5. Reduce high-frequency state updates from sliders

* Debounce slider updates OR
* Use `onValueCommit` instead of `onValueChange`

Goal:

* Avoid 60fps state updates during dragging

---

#### 6. Clamp expensive visual effects

* Limit shadow intensity:

```ts
const safeShadow = Math.min(shadow, 20)
```

* Avoid large blur radii that trigger GPU overhead

---

#### 7. Remove unnecessary refs retaining state

* Remove patterns like:

```ts
const framesRef = useRef(frames)
```

unless strictly required

---

#### 8. Improve export pipeline

* Export directly from canvas instead of DOM
* Support:

  * PNG
  * JPEG
* Ensure consistent resolution independent of UI scale

---

### Constraints

* Do NOT change UI/UX behavior
* Keep all existing features
* Maintain clean, readable code

---

### Expected Outcome

* Significantly lower memory usage
* No browser overheating during use
* Faster exports
* Smooth UI interaction even with multiple frames
* No reliance on DOM screenshot libraries

---

### Optional Enhancements (if time permits)

* Lazy-load images
* Add max screens limit (max 10 screens for example)
---

Refactor the code accordingly and provide clean, production-ready implementation.

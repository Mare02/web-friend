"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Download, MonitorSmartphone, Upload, Save, Copy, Check, Plus, Minus, X, Pipette, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";

const GRADIENTS = [
  "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-tr from-emerald-500 to-teal-400",
  "bg-gradient-to-br from-orange-400 to-rose-400",
  "bg-gradient-to-r from-violet-600 to-indigo-600",
  "bg-zinc-900",
  "bg-white"
];

const PHONE_MODELS = [
  { id: "iphone15pro", name: "iPhone 15 Pro", width: 393, height: 852, radius: 48, bezel: 14, notchType: "dynamic-island" },
  { id: "iphone14", name: "iPhone 14", width: 390, height: 844, radius: 46, bezel: 16, notchType: "notch" },
  { id: "pixel8", name: "Pixel 8 Pro", width: 412, height: 892, radius: 40, bezel: 12, notchType: "punch-hole" },
  { id: "generic", name: "Minimal Android", width: 400, height: 850, radius: 24, bezel: 8, notchType: "none" },
];

type MockupFrame = {
  id: string;
  image: string | null;
  gradient: string;
  imgProps: { scale: number; x: number; y: number; rotate: number };
};

export function DeviceMockup() {
  const [frames, setFrames] = useState<MockupFrame[]>([{ id: "1", image: null, gradient: GRADIENTS[0], imgProps: { scale: 100, x: 0, y: 0, rotate: 0 } }]);
  const [activeSettingsFrame, setActiveSettingsFrame] = useState<string | null>(null);
  const [modelId, setModelId] = useState("iphone15pro");
  const [padding, setPadding] = useState([64]);
  const [gap, setGap] = useState([32]);
  const [shadow, setShadow] = useState([30]);
  const [scale, setScale] = useState([70]);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const framesRef = useRef(frames);
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      framesRef.current.forEach(frame => {
        if (frame.image?.startsWith('blob:')) {
          URL.revokeObjectURL(frame.image);
        }
      });
    };
  }, []);

  const { isLoaded, isSignedIn } = useAuth();
  const exportRef = useRef<HTMLDivElement>(null);

  const rawModel = PHONE_MODELS.find(m => m.id === modelId) || PHONE_MODELS[0];
  const s = scale[0] / 100;
  const activeModel = {
    ...rawModel,
    width: rawModel.width * s,
    height: rawModel.height * s,
    radius: rawModel.radius * s,
    bezel: rawModel.bezel * s,
  };

  const handleImageUpload = (frameId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const prevFrame = frames.find(f => f.id === frameId);
      if (prevFrame?.image?.startsWith('blob:')) {
        URL.revokeObjectURL(prevFrame.image);
      }
      setFrames(prev => prev.map(f => f.id === frameId ? { ...f, image: blobUrl } : f));
    }
  };

  const addFrame = () => {
    setFrames(prev => [...prev, { id: Math.random().toString(36).substring(7), image: null, gradient: GRADIENTS[0], imgProps: { scale: 100, x: 0, y: 0, rotate: 0 } }]);
  };

  const setFrameGradient = (frameId: string, gradient: string) => {
    setFrames(prev => prev.map(f => f.id === frameId ? { ...f, gradient } : f));
  };

  const updateImgProps = (frameId: string, props: Partial<MockupFrame['imgProps']>) => {
    setFrames(prev => prev.map(f => f.id === frameId ? { ...f, imgProps: { ...f.imgProps, ...props } } : f));
  };

  const removeFrame = (frameId: string) => {
    if (frames.length <= 1) return;
    const frameToRemove = frames.find(f => f.id === frameId);
    if (frameToRemove?.image?.startsWith('blob:')) {
      URL.revokeObjectURL(frameToRemove.image);
    }
    setFrames(prev => prev.filter(f => f.id !== frameId));
  };

  const clearImage = (frameId: string) => {
    const frameToClear = frames.find(f => f.id === frameId);
    if (frameToClear?.image?.startsWith('blob:')) {
      URL.revokeObjectURL(frameToClear.image);
    }
    setFrames(prev => prev.map(f => f.id === frameId ? { ...f, image: null } : f));
  };

  const handleExport = useCallback(async (format: 'png' | 'jpeg') => {
    if (exportRef.current === null) return;
    setIsExporting(true);

    const { domToPng, domToJpeg } = await import('modern-screenshot');

    const filter = (node: Node) => {
      if (!(node instanceof HTMLElement)) return true;
      const exclusionClasses = ['exclude-from-export'];
      return !exclusionClasses.some(classname => node.classList?.contains(classname));
    };

    const action = format === 'png' ? domToPng : domToJpeg;
    const options = {
        filter,
        scale: 1,
        useCORS: true,
        cacheBust: false,
        skipFonts: true,
        fetch: { bypassingCache: true }
    };

    try {
      const dataUrl = await action(exportRef.current, options);

      const link = document.createElement("a");
      link.download = `mockup-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
    } finally {
      setIsExporting(false);
    }
  }, [exportRef]);

  const copyToClipboard = useCallback(async () => {
    if (exportRef.current === null) return;
    setIsExporting(true);

    const { domToPng } = await import('modern-screenshot');

    const filter = (node: Node) => {
      if (!(node instanceof HTMLElement)) return true;
      const exclusionClasses = ['exclude-from-export'];
      return !exclusionClasses.some(classname => node.classList?.contains(classname));
    };

    const options = {
        filter,
        scale: 2,
        useCORS: true,
        cacheBust: false,
        skipFonts: true,
        fetch: { bypassingCache: true }
    };

    try {
      const dataUrl = await domToPng(exportRef.current, options);

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    } finally {
      setIsExporting(false);
    }
  }, [exportRef]);

  const handleSave = () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      alert("Please sign in to save your mockups!");
      return;
    }
    alert("Save feature requires backend setup. See plan documentation.");
  };

  const renderNotch = (type: string, s: number) => {
    switch (type) {
      case "dynamic-island":
        return (
          <div className="absolute top-3 inset-x-0 w-full flex justify-center z-10 pointer-events-none" style={{ transform: `scale(${s})`, transformOrigin: 'top center' }}>
            <div className="w-[120px] h-[34px] bg-black rounded-full flex items-center justify-end px-3">
              <div className="w-3 h-3 rounded-full bg-zinc-800/80 border border-white/5" />
            </div>
          </div>
        );
      case "notch":
        return (
          <div className="absolute top-0 inset-x-0 w-full flex justify-center z-10 pointer-events-none" style={{ transform: `scale(${s})`, transformOrigin: 'top center' }}>
             <div className="w-[160px] h-[30px] bg-black rounded-b-3xl" />
          </div>
        );
      case "punch-hole":
        return (
           <div className="absolute top-4 inset-x-0 w-full flex justify-center z-10 pointer-events-none" style={{ transform: `scale(${s})`, transformOrigin: 'top center' }}>
             <div className="w-5 h-5 bg-black rounded-full border border-zinc-800" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-full">
      <div className="flex flex-col gap-8">

        {/* Editor Settings */}
        <div className="w-full container mx-auto px-4 pt-8 md:pt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

              <div className="space-y-3">
                <Label>Phone Model</Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE_MODELS.map(m => (
                       <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Padding</span>
                  <span className="text-muted-foreground">{padding[0]}px</span>
                </Label>
                <Slider
                  value={padding}
                  onValueChange={setPadding}
                  max={200}
                  step={4}
                />
              </div>

               <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Gap Between Screens</span>
                  <span className="text-muted-foreground">{gap[0]}px</span>
                </Label>
                <Slider
                  value={gap}
                  onValueChange={setGap}
                  max={200}
                  step={4}
                />
              </div>

              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Shadow</span>
                  <span className="text-muted-foreground">{shadow[0]}%</span>
                </Label>
                <Slider
                  value={shadow}
                  onValueChange={setShadow}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Device Scale</span>
                  <span className="text-muted-foreground">{scale[0]}%</span>
                </Label>
                <Slider
                  value={scale}
                  onValueChange={setScale}
                  min={30}
                  max={120}
                  step={5}
                />
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-5 pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 sm:flex-auto"
                    onClick={() => handleExport('png')}
                    disabled={isExporting || frames.every(f => !f.image)}
                  >
                    <Download className="w-4 h-4 mr-2" /> PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-auto"
                    onClick={() => handleExport('jpeg')}
                    disabled={isExporting || frames.every(f => !f.image)}
                  >
                    <Download className="w-4 h-4 mr-2" /> JPG
                  </Button>
                </div>

                <div className="flex gap-2">
                   <Button
                    variant="secondary"
                    className="flex-1 sm:flex-auto"
                    onClick={copyToClipboard}
                    disabled={isExporting || frames.every(f => !f.image)}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1 sm:flex-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleSave}
                    disabled={isExporting || frames.every(f => !f.image)}
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Project
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Canvas Area */}
        <div className="w-full flex flex-col items-center justify-start border border-border rounded-xl bg-card shadow-sm p-4 relative">



            <div className="w-full overflow-x-auto overflow-y-visible p-2 pb-16 pt-16">
              {/* Actual exportable node */}
              <div
                ref={exportRef}
                className="transition-all duration-300 flex items-center w-max mx-auto px-2"
                style={{
                  gap: `${gap[0]}px`,
                }}
              >
                 {frames.map((frame, index) => (
                    <div key={frame.id} className="relative group shrink-0 transition-all duration-300 hover:-translate-y-1">

                       {/* Frame Actions (Excluded from Export) */}
                      <div className="exclude-from-export opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 inset-x-0 flex justify-center gap-2 z-30">
                         {frames.length > 1 && (
                           <Button size="icon" variant="outline" title="Remove Screen" className="h-8 w-8 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => removeFrame(frame.id)}>
                             <Minus className="w-4 h-4" />
                           </Button>
                         )}
                         {frame.image && (
                           <>
                             <Button size="icon" variant="outline" title="Image Settings" className={`h-8 w-8 rounded-full bg-background ${activeSettingsFrame === frame.id ? 'border-primary text-primary' : ''}`} onClick={() => setActiveSettingsFrame(activeSettingsFrame === frame.id ? null : frame.id)}>
                               <Settings2 className="w-4 h-4" />
                             </Button>
                             <Button size="icon" variant="destructive" title="Remove Image" className="h-8 w-8 rounded-full" onClick={() => clearImage(frame.id)}>
                               <X className="w-4 h-4" />
                             </Button>
                           </>
                         )}
                         <Button size="icon" variant="secondary" title="Upload Image" className="h-8 w-8 rounded-full cursor-pointer relative overflow-hidden" asChild>
                           <label>
                             <Upload className="w-4 h-4" />
                             <input
                               type="file"
                               accept="image/*"
                               className="hidden"
                               onChange={(e) => handleImageUpload(frame.id, e)}
                             />
                           </label>
                         </Button>
                      </div>

                      {/* Frame Gradient Picker (Excluded from Export) */}
                      <div className="exclude-from-export opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-10 inset-x-0 flex justify-center gap-1.5 z-30 flex-wrap px-2">
                         {GRADIENTS.map((g, idx) => (
                           <button
                             key={idx}
                             className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ${
                               g === frame.gradient ? "border-primary scale-125 shadow-sm" : "border-muted/50 hover:border-primary/50"
                             } ${g}`}
                             onClick={() => setFrameGradient(frame.id, g)}
                           />
                         ))}
                         {/* Custom Color Input */}
                         <div className={`relative w-6 h-6 rounded-full overflow-hidden border-2 shrink-0 transition-all flex items-center justify-center ${!frame.gradient.startsWith('bg-') ? 'border-primary scale-125 shadow-sm' : 'border-muted/50 hover:border-primary/50'}`}>
                           <Pipette className="w-3 h-3 text-white absolute pointer-events-none z-10 mix-blend-difference" />
                           <input
                             type="color"
                             className="absolute inset-[-10px] w-[50px] h-[50px] cursor-pointer"
                             value={!frame.gradient.startsWith('bg-') ? frame.gradient : '#e2e8f0'}
                             onChange={(e) => setFrameGradient(frame.id, e.target.value)}
                           />
                         </div>
                      </div>

                      {/* Screen Canvas Background */}
                      <div
                        className={`flex items-center justify-center overflow-hidden transition-colors ${frame.gradient.startsWith('bg-') ? frame.gradient : ''}`}
                        style={{
                          padding: `${padding[0]}px`,
                          backgroundColor: !frame.gradient.startsWith('bg-') ? frame.gradient : undefined
                        }}
                      >
                        {/* Phone Model Container */}
                        <div
                          className="bg-black relative flex flex-col overflow-hidden ring-[1px] ring-white/10"
                          style={{
                            width: `${activeModel.width}px`,
                            height: `${activeModel.height}px`,
                            borderRadius: `${activeModel.radius}px`,
                            padding: `${activeModel.bezel}px`,
                            boxShadow: `0px ${shadow[0]}px ${shadow[0] * 1.5}px -10px rgba(0,0,0,${Math.min(shadow[0]/100, 0.8)})`
                          }}
                        >
                           {/* Hardware Details */}
                           <div className="absolute top-1/4 -right-1 bg-zinc-800 rounded-l-sm" style={{ width: `${Math.max(2, 4 * s)}px`, height: `${48 * s}px` }} /> {/* Power button */}
                           <div className="absolute top-1/4 -left-1 bg-zinc-800 rounded-r-sm" style={{ width: `${Math.max(2, 4 * s)}px`, height: `${64 * s}px` }} /> {/* Volume up */}
                           <div className="absolute top-[35%] -left-1 bg-zinc-800 rounded-r-sm" style={{ width: `${Math.max(2, 4 * s)}px`, height: `${64 * s}px` }} /> {/* Volume down */}

                           {/* Screen Area */}
                          <div
                            className="w-full h-full relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center"
                            style={{ borderRadius: `${Math.max(activeModel.radius - activeModel.bezel, 4)}px` }}
                          >
                              {renderNotch(activeModel.notchType, s)}

                              {!frame.image ? (
                                <label className="exclude-from-export cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-zinc-900 transition-colors">
                                   <MonitorSmartphone className="w-12 h-12 text-zinc-600 mb-4" />
                                   <span className="text-zinc-500 font-medium">Click to upload</span>
                                   <input
                                     type="file"
                                     accept="image/*"
                                     className="hidden"
                                     onChange={(e) => handleImageUpload(frame.id, e)}
                                   />
                                </label>
                              ) : (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={frame.image}
                                    alt={`Screen ${index + 1}`}
                                    crossOrigin="anonymous"
                                    data-screenshot-no-fetch
                                    className="w-full h-full object-cover block absolute inset-0 pointer-events-none"
                                    style={{
                                      transform: `translate(${frame.imgProps.x}px, ${frame.imgProps.y}px) scale(${frame.imgProps.scale / 100}) rotate(${frame.imgProps.rotate}deg)`,
                                      transformOrigin: 'center center'
                                    }}
                                  />

                                  {/* Image Settings Overlay */}
                                  {activeSettingsFrame === frame.id && (
                                    <div className="absolute inset-x-2 top-2 bg-background/40 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl z-50 flex flex-col gap-3 text-xs">
                                      <div className="flex justify-between items-center pb-1 border-b border-border/50">
                                        <span className="font-semibold text-foreground">Transform</span>
                                        <button onClick={() => setActiveSettingsFrame(null)} className="text-muted-foreground hover:text-foreground p-1.5 -mr-1.5 rounded-full hover:bg-muted/50 transition-colors"><X className="w-4 h-4"/></button>
                                      </div>

                                      <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-muted-foreground"><Label className="text-xs">Scale</Label><span>{frame.imgProps.scale}%</span></div>
                                        <Slider min={10} max={300} step={1} value={[frame.imgProps.scale]} onValueChange={([v]) => updateImgProps(frame.id, { scale: v })} />
                                      </div>

                                      <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-muted-foreground"><Label className="text-xs">Horizontal</Label><span>{frame.imgProps.x}px</span></div>
                                        <Slider min={-1000} max={1000} step={1} value={[frame.imgProps.x]} onValueChange={([v]) => updateImgProps(frame.id, { x: v })} />
                                      </div>

                                      <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-muted-foreground"><Label className="text-xs">Vertical</Label><span>{frame.imgProps.y}px</span></div>
                                        <Slider min={-1000} max={1000} step={1} value={[frame.imgProps.y]} onValueChange={([v]) => updateImgProps(frame.id, { y: v })} />
                                      </div>

                                      <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-muted-foreground"><Label className="text-xs">Rotate</Label><span>{frame.imgProps.rotate}°</span></div>
                                        <Slider min={-180} max={180} step={1} value={[frame.imgProps.rotate]} onValueChange={([v]) => updateImgProps(frame.id, { rotate: v })} />
                                      </div>

                                      <Button variant="outline" size="sm" className="w-full text-xs h-7 mt-1 border-dashed bg-background/50 hover:bg-background" onClick={() => updateImgProps(frame.id, { scale: 100, x: 0, y: 0, rotate: 0 })}>Reset</Button>
                                    </div>
                                  )}
                                </>
                              )}
                          </div>
                        </div>
                      </div>

                    </div>
                 ))}

                 {/* Inline Add Screen Button (Excluded from export) */}
                 <div className="exclude-from-export flex flex-col justify-center items-center shrink-0 ml-4 mb-4">
                   <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-dashed border-2 opacity-50 hover:opacity-100 transition-opacity bg-background hover:bg-muted" onClick={addFrame}>
                     <Plus className="w-8 h-8 text-foreground" />
                   </Button>
                 </div>

              </div>
            </div>

        </div>
      </div>
    </div>
  );
}

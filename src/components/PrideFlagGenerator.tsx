import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, RefreshCw, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Pride flag color palettes
const pridePalettes = {
  rainbow: ["#FF0018", "#FFA52C", "#FFFF41", "#008018", "#0000F9", "#86007D"],
  trans: ["#5BCEFA", "#F5A9B8", "#FFFFFF", "#F5A9B8", "#5BCEFA"],
  nonbinary: ["#FCF434", "#FFFFFF", "#9C59D6", "#2C2C2C"],
  lesbian: ["#D46200", "#FF9E00", "#FFFFFF", "#C186C1", "#9C27B0"],
  gaymen: ["#0072FF", "#00D4FF", "#FFFFFF", "#7B2CBF", "#9B26B6"],
  bisexual: ["#D10671", "#8C1D82", "#0033A0"],
  pansexual: ["#FF218C", "#FFD800", "#21B1FF"],
  asexual: ["#000000", "#A3A3A3", "#FFFFFF", "#810081"],
  aromantic: ["#3A7126", "#A7D379", "#FFFFFF", "#C6C6C6", "#5C5C5C"],
  intersex: ["#7902A8", "#D329C2", "#FCD5B5"],
  progress: ["#5BCEFA", "#F5A9B8", "#FFFFFF", "#F5A9B8", "#5BCEFA", "#74048C", "#10002B"],
};

interface PrideFlagGeneratorProps {
  onGenerate?: (colors: string[]) => void;
}

export const PrideFlagGenerator = ({ onGenerate }: PrideFlagGeneratorProps) => {
  const [palette, setPalette] = useState<string[]>(pridePalettes.rainbow);
  const [stripeCount, setStripeCount] = useState(6);
  const [isGradient, setIsGradient] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectPalette = (name: keyof typeof pridePalettes) => {
    const newPalette = pridePalettes[name];
    setPalette(newPalette);
    setStripeCount(newPalette.length);
    onGenerate?.(newPalette);
  };

  const generateRandom = () => {
    const length = Math.floor(Math.random() * 4) + 3; // 3-6 stripes
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      colors.push(
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
      );
    }
    setPalette(colors);
    setStripeCount(length);
    onGenerate?.(colors);
  };

  const copyColors = async () => {
    await navigator.clipboard.writeText(JSON.stringify(palette));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFlag = () => {
    // Create a canvas and download the flag
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 800;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    const stripeHeight = height / palette.length;
    palette.forEach((color, index) => {
      ctx!.fillStyle = color;
      ctx!.fillRect(0, index * stripeHeight, width, stripeHeight);
    });

    const link = document.createElement("a");
    link.download = "pride-flag.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="glass card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="text-primary" size={20} />
          Pride Flag Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Flag Preview */}
        <div
          className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-border"
          style={{
            background: isGradient
              ? `linear-gradient(180deg, ${palette.join(", ")})`
              : undefined,
          }}
        >
          {!isGradient &&
            palette.map((color, index) => (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="h-full w-full"
                style={{
                  backgroundColor: color,
                  position: "absolute",
                  top: `${(index / palette.length) * 100}%`,
                  transform: "translateY(-50%)",
                }}
              />
            ))}
        </div>

        {/* Preset Palettes */}
        <div className="space-y-3">
          <Label>Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(pridePalettes).map((name) => (
              <button
                key={name}
                onClick={() => selectPalette(name as keyof typeof pridePalettes)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors capitalize"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Stripe Count */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Stripe Count</Label>
            <span className="text-sm text-muted-foreground">{stripeCount}</span>
          </div>
          <Slider
            value={[stripeCount]}
            onValueChange={([value]) => setStripeCount(value)}
            min={3}
            max={8}
            step={1}
            className="py-2"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={isGradient}
              onCheckedChange={setIsGradient}
              id="gradient"
            />
            <Label htmlFor="gradient">Gradient mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={showAnimation}
              onCheckedChange={setShowAnimation}
              id="animation"
            />
            <Label htmlFor="animation">Animate</Label>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <Label>Colors</Label>
          <div className="flex flex-wrap gap-2">
            {palette.map((color, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const newColors = [...palette];
                    newColors[index] = palette[(index + 1) % palette.length];
                    newColors[(index + 1) % palette.length] = color;
                    setPalette(newColors);
                  }}
                />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandom}
            className="flex-1"
          >
            <RefreshCw size={14} className="mr-1" />
            Random
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyColors}
            className="flex-1"
          >
            {copied ? (
              <>
                <Sparkles size={14} className="mr-1 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button size="sm" onClick={downloadFlag} className="btn-pride">
            <Download size={14} className="mr-1" />
            Save
          </Button>
        </div>

        {/* Color Codes */}
        <div className="p-3 rounded-lg bg-muted text-sm">
          <p className="font-medium mb-2">Color Codes:</p>
          <code className="text-xs text-muted-foreground">
            {palette.join(", ")}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

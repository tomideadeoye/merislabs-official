import {
  LayoutDashboard,
  MessageSquare,
  BookOpenText,
  Network,
  Briefcase,
  Rocket,
  DatabaseZap,
  BrainCircuit,
  Repeat,
  Users,
  Cog,
  Lightbulb,
  FileText,
  BarChart2,
  HeartPulse,
  FolderOpen,
  Layers,
  Mail,
  Brain,
} from "lucide-react";

export async function testLucideIcons() {
  const icons = {
    LayoutDashboard,
    MessageSquare,
    BookOpenText,
    Network,
    Briefcase,
    Rocket,
    DatabaseZap,
    BrainCircuit,
    Repeat,
    Users,
    Cog,
    Lightbulb,
    FileText,
    BarChart2,
    HeartPulse,
    FolderOpen,
    Layers,
    Mail,
    Brain,
  };

  let allDefined = true;
  for (const [name, icon] of Object.entries(icons)) {
    if (typeof icon !== "function") {
      console.error(`Icon ${name} is undefined or not a function!`);
      allDefined = false;
    }
  }

  if (allDefined) {
    console.log("All lucide-react icons are defined and imported correctly.");
    return true;
  } else {
    console.error("Some lucide-react icons are missing or misnamed. See errors above.");
    return false;
  }
}

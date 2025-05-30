"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { BookOpenText } from "lucide-react";

export default function JournalFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.Journal}
        icon={<BookOpenText className="h-7 w-7" />}
        description="Write and review your journal entries."
      />
      <div>
        <p className="text-gray-400">Journal feature component will go here.</p>
      </div>
    </div>
  );
}

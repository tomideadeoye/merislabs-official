"use client";

import { useSessionState } from "@/hooks/useSessionState";
import { SessionStateKeys, PageNames } from "@/app_state";
import { MoodCheckIn } from "@/components/ui/mood-checkin";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, Zap, Lightbulb, BarChart3, Settings } from "lucide-react";

const quickActions = [
	{ label: PageNames.DRAFT_COMM, href: "/admin/draft-communication", icon: Lightbulb },
	{ label: PageNames.JOURNAL, href: "/admin/journal", icon: Zap },
	{ label: PageNames.PIPELINE, href: "/admin/opportunity-pipeline", icon: BarChart3 },
	{ label: PageNames.SYSTEM, href: "/admin/system-settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const [currentMood] = useSessionState<string | undefined>(SessionStateKeys.CURRENT_MOOD as SessionStateKeys, undefined);
  const [userName] = useSessionState<string>(SessionStateKeys.USER_NAME as SessionStateKeys, "Architect");
  const [memoryInitialized] = useSessionState<boolean>(SessionStateKeys.MEMORY_INITIALIZED as SessionStateKeys, false);

	const welcomeDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	if (!currentMood) {
		return <MoodCheckIn />;
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="Orion System Dashboard"
				icon={<LayoutDashboard className="h-7 w-7" />}
				description={`Overview of your life architecture system. Today is ${welcomeDate}.`}
				showMemoryStatus={true}
				memoryInitialized={memoryInitialized}
			/>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{quickActions.map((action) => (
					<Card key={action.label} className="hover:shadow-blue-500/30 hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-lg font-medium text-blue-400">{action.label}</CardTitle>
							<action.icon className="h-6 w-6 text-gray-400" />
						</CardHeader>
						<CardContent>
							<Button asChild variant="outline" className="mt-4 w-full bg-gray-700 hover:bg-gray-600">
								<Link href={action.href}>Go to {action.label.split(" ").slice(1).join(" ")}</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg text-gray-200">Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-400">Placeholder for recent journal entries, tasks, etc.</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-lg text-gray-200">Goal Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-400">Placeholder for key goal tracking.</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

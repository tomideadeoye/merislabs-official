/**
 * GOAL: API route for fetching Habitica tasks in Orion, using Neon/Postgres for cloud scalability, reliability, and auditability.
 * - Fetches tasks from Habitica API (via lib/habitica_client).
 * - Augments tasks with origin info from Postgres (habitica_task_links table).
 * - Absurdly comprehensive logging for every step, with context and error details.
 * - Connects to: lib/habitica_client.ts, lib/database.ts (Postgres pool), prd.md (feature doc), tests/e2e.test.ts (tests)
 * - All features preserved from SQLite version, now with improved error handling and observability.
 */
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "@repo/shared/habitica_client";
import type { HabiticaTask } from "@repo/shared/types/habitica";
import { query, sql } from "@repo/shared/database";

export async function POST(req: NextRequest) {
  const logContext = {
    route: "/api/orion/habitica/tasks",
    timestamp: new Date().toISOString(),
  };
  try {
    console.info("[HABITICA_TASKS][START]", logContext);

    const { userId, apiToken, type } = await req.json();

    // Use env vars if not provided
    const finalUserId = userId || process.env.HABITICA_USER_ID;
    const finalApiToken = apiToken || process.env.HABITICA_API_TOKEN;

    if (!finalUserId || !finalApiToken) {
      console.warn(
        "[HABITICA_TASKS][VALIDATION_FAIL] Missing userId or apiToken.",
        { ...logContext }
      );
      return NextResponse.json(
        {
          success: false,
          error: "Habitica User ID and API Token are required",
        },
        { status: 400 }
      );
    }

    // Fetch all tasks using the shared client
    let allTasks: HabiticaTask[] = [];
    try {
      allTasks = await getTasks(finalUserId, finalApiToken);
      console.info("[HABITICA_TASKS][FETCHED]", {
        count: allTasks.length,
        ...logContext,
      });
    } catch (fetchErr) {
      console.error("[HABITICA_TASKS][ERROR_FETCHING]", {
        fetchErr,
        ...logContext,
      });
      throw fetchErr;
    }

    // Filter by type if requested, else return all types
    const todos = allTasks.filter((t) => t.type === "todo");
    const dailys = allTasks.filter((t) => t.type === "daily");
    const habits = allTasks.filter((t) => t.type === "habit");
    const rewards = allTasks.filter((t) => t.type === "reward");

    // Augment tasks with origin information from Postgres
    const augment = async (tasks: HabiticaTask[]) => {
      return Promise.all(
        tasks.map(async (task: HabiticaTask) => {
          if (!task._id) return task;
          try {
            const res = await query(
              "SELECT orionSourceModule, orionSourceReferenceId, createdAt FROM habitica_task_links WHERE habiticaTaskId = $1",
              [task._id]
            );
            if (res.rows.length > 0) {
              return {
                ...task,
                orionOrigin: res.rows[0],
              };
            }
            return task;
          } catch (dbError: any) {
            console.error("[HABITICA_TASKS][DB][ERROR_FETCHING_ORIGIN]", {
              taskId: task._id,
              dbError,
            });
            return task; // Return original task if DB error
          }
        })
      );
    };

    const [augTodos, augDailys, augHabits, augRewards] = await Promise.all([
      augment(todos),
      augment(dailys),
      augment(habits),
      augment(rewards),
    ]);

    console.info("[HABITICA_TASKS][SUCCESS]", { ...logContext });

    return NextResponse.json({
      success: true,
      todos: augTodos,
      dailys: augDailys,
      habits: augHabits,
      rewards: augRewards,
    });
  } catch (error: any) {
    console.error("[HABITICA_TASKS][ERROR]", { ...logContext, error });
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

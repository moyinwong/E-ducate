import * as Knex from "knex";
import { tables } from "../tables";

const purchasedCoursesTable = tables.PURCHASED_COURSES;

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(purchasedCoursesTable).del();

  // Inserts seed entries
  await knex(purchasedCoursesTable).insert([
    {
      user_id: 1,
      course_id: 1,
      payment_method: "credit card",
      paid_amount: 99,
      rated_score: null,
      comment: null,
    },
  ]);
}
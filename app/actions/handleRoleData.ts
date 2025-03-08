import { Client } from "@notionhq/client";
import dotenv from "dotenv";

import trimChars from "../utils/trimChars";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_KEY! });
const databaseId = process.env.NOTION_DATABASE_ID!;

let errorCount = 0;
async function addJobListing(role: any, company: any) {
  await new Promise(async (resolve) => await setTimeout(resolve, 3000));

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId, type: "database_id" },
      properties: {
        Name: {
          title: [{ text: { content: role.name } }],
        },
        Category: {
          select: role.category
            ? { name: role.category.replace(/,/g, "") }
            : null,
        },
        ...(role?.good_fit_categories?.length > 0 && {
          "Good Fit Reasons": {
            multi_select: role.good_fit_categories.map((reason: string) => ({
              name: trimChars(reason.replace(/,/g, "")),
            })),
          },
        }),
        ...(!!role?.workplaceType && {
          "Workplace Type": {
            multi_select: [
              {
                name: role.workplaceType,
              },
            ],
          },
        }),
        ...(role?.bad_fit_categories?.length > 0 && {
          "Bad Fit Reasons": {
            multi_select: role.bad_fit_categories.map((reason: string) => ({
              name: trimChars(reason.replace(/,/g, "")),
            })),
          },
        }),
        ...(role?.tech_stack?.length > 0 && {
          "Tech Stack": {
            multi_select: role.tech_stack.map((tech: string) => ({
              name: trimChars(tech.replace(/,/g, "")),
            })),
          },
        }),
        "JD URL": {
          url: role.jdUrl,
        },
        ...(!!role?.active_status && {
          "Active Status": {
            select: { name: role.active_status.replace(/,/g, "") },
          },
        }),
        ...(!!role?.role_pdf_url && {
          "Role URL": {
            url: role.role_pdf_url,
          },
        }),
        "Salary Range": {
          rich_text: [
            {
              type: "text",
              text: {
                content: `${role.salaryLowerBound} - ${role.salaryUpperBound}`,
              },
            },
          ],
        },
        ...(!!company.name && {
          "Company Name": {
            multi_select: [
              {
                name: company.name,
              },
            ],
          },
        }),
        ...(!!company.url && {
          "Company URL": {
            url: company.url,
          },
        }),
        ...(!!company.linkedinUrl && {
          "Company LinkedIn": {
            url: company.linkedinUrl,
          },
        }),
        ...(!!company.size && {
          "Company Size": {
            number: company.size,
          },
        }),
        ...(role?.responsibilities?.length > 0 && {
          Responsibilities: {
            rich_text: [
              ...role.responsibilities.map((responsibility: string) => ({
                type: "text",
                text: {
                  content: responsibility,
                },
              })),
            ],
          },
        }),
        ...(role?.candidateTraits?.length > 0 && {
          "Candidate Traits": {
            multi_select: role.candidateTraits.map((trait: string) => ({
              name: trimChars(trait.replace(/,/g, "")),
            })),
          },
        }),
        "Hiring Urgency": {
          select: role.hiring_urgency ? { name: role.hiring_urgency } : null,
        },
        ...(role?.rejection_categories?.length > 0 && {
          "Rejection Reasons": {
            multi_select: role.rejection_categories.map((reason: string) => ({
              name: trimChars(reason.replace(/,/g, "")),
            })),
          },
        }),
        ...(!!role?.difficulty && {
          Difficulty: {
            multi_select: [
              {
                name: role.difficulty,
              },
            ],
          },
        }),
        "Created At": {
          date: {
            start: role.createdAt,
          },
        },
        "Updated At": {
          date: {
            start: role.updatedAt,
          },
        },
        ...(!!role.experience_info && {
          "Looking For Experience": {
            rich_text: [
              {
                type: "text",
                text: {
                  content: role.experience_info,
                },
              },
            ],
          },
        }),
        ...(!!company.description && {
          Description: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: trimChars(company.description, 2000),
                },
              },
            ],
          },
        }),
      },
    });

    console.log(
      "Job listing added for: ",
      // @ts-ignore
      response.properties.Name.title[0].plain_text,
    );
  } catch (error: any) {
    if (error.status === 409) {
      errorCount += 1;
      console.log(`409 error count: ${errorCount}`);
    } else {
      console.error("Error adding job listing:", error);
    }
  }
}

async function handleRoleData(roles: { [key: string]: any }, company: any) {
  try {
    roles.forEach(async (role: any) => {
      await new Promise(async (resolve) => await setTimeout(resolve, 3000));

      if (role.paused === false && role.inactive === false) {
        await addJobListing(role, company);
      }
    });
  } catch (error) {
    console.error("Error adding page:", error);
  }
}

export default handleRoleData;

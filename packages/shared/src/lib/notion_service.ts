/**
 * Re-export of notion_service functions from the canonical location
 */

export {
  createOpportunityInNotion,
  listOpportunitiesFromNotion,
  getOpportunityDetails,
  getOpportunityContent,
  updateOpportunityStatus,
  addStakeholderToOpportunity,
  saveOutreachToNotion,
  getCVComponentsFromNotion,
  fetchOpportunityByIdFromNotion,
  updateNotionOpportunity,
  getJournalEntriesFromNotion,
  createJournalEntryInNotion,
  fetchContactsFromNotion,
  saveJournalEntryToNotion,
  updateNotionDatabaseSchema
} from '../../lib/notion_service';

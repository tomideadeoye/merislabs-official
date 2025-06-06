// Jest setup file to mock HTTP requests and prevent connection errors

// Mock node-fetch
jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url: string, options?: any) => {
    const urlStr = url.toString();
    const method = options?.method || 'GET';
    let body = {};
    try {
      body = options?.body ? JSON.parse(options.body) : {};
    } catch (e) {
      // Handle malformed JSON gracefully
      body = {};
    }
    
    // Mock successful responses for API endpoints
    if (urlStr.includes('/api/orion/blocks/create')) {
      // Check for validation errors first
      if (!body.type || !body.title || !body.content) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            success: false,
            error: 'Missing required fields: type, title, and content are required'
          })
        });
      }
      
      // Check for invalid block type
      const validTypes = ['CV_SNIPPET', 'OPPORTUNITY_HIGHLIGHT', 'JOURNAL_INSIGHT', 'PROMPT_TEMPLATE', 'GENERAL_BLOCK'];
      if (!validTypes.includes(body.type)) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            success: false,
            error: 'Invalid block type. Must be one of: ' + validTypes.join(', ')
          })
        });
      }
      
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            block: {
              id: 'mock-block-id-' + Math.random().toString(36).substr(2, 9),
              type: body.type,
              title: body.title,
              content: body.content,
              tags: body.tags || []
            }
          })
        });
    }
    
    if (urlStr.includes('/api/orion/blocks/list')) {
      if (urlStr.includes('type=')) {
        const typeMatch = urlStr.match(/type=([^&]+)/);
        const blockType = typeMatch ? decodeURIComponent(typeMatch[1]) : 'CV_SNIPPET';
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            blocks: [{
              id: 'mock-block-id',
              type: blockType,
              title: `Mock ${blockType} Block`,
              content: `Mock content for ${blockType}`,
              tags: ['mock']
            }]
          })
        });
      } else if (urlStr.includes('tags=')) {
        const tagsMatch = urlStr.match(/tags=([^&]+)/);
        const requestedTag = tagsMatch ? decodeURIComponent(tagsMatch[1]) : 'filtertest';
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            blocks: [{
              id: 'mock-block-id',
              type: 'CV_SNIPPET',
              title: 'Mock Tagged Block',
              content: 'Mock content with specific tag',
              tags: [requestedTag, 'mock']
            }]
          })
        });
      } else {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            blocks: [
              {
                id: 'mock-block-1',
                type: 'CV_SNIPPET',
                title: 'Mock CV Block',
                content: 'Mock CV content',
                tags: ['mock']
              },
              {
                id: 'mock-block-2',
                type: 'PROMPT_TEMPLATE',
                title: 'Mock Prompt Block',
                content: 'Mock prompt content',
                tags: ['mock']
              }
            ]
          })
        });
      }
    }
    
    if (urlStr.includes('/api/orion/networking/stakeholder-search')) {
      const query = body.query || 'Unknown Company';
      const roles = body.roles || ['Unknown Role'];
      
      // Return empty array for nonexistent companies
      if (query.includes('NonexistentCompany') || query.includes('UnknownCorp')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            stakeholders: []
          })
        });
      }
      
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          stakeholders: [{
            name: 'John Doe',
            role: roles[0] || 'Product Manager',
            company: query,
            linkedin_url: 'https://linkedin.com/in/johndoe',
            email: `john.doe@${query.toLowerCase().replace(/\s+/g, '')}.com`
          }]
        })
      });
    }
    
    if (urlStr.includes('/api/orion/networking/generate-outreach')) {
      const stakeholder = body.stakeholder || {};
      const jobTitle = body.jobTitle || 'role';
      const profileData = body.profileData || '';
      
      // Check for missing required fields
      if (!stakeholder.name || !stakeholder.company) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            success: false,
            error: 'Missing required stakeholder information'
          })
        });
      }
      
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          emailDraft: `Hi ${stakeholder.name}! I'm interested in the ${jobTitle} role at ${stakeholder.company}. ${profileData}`,
          linkedinDraft: `Hi ${stakeholder.name}! I saw your work at ${stakeholder.company} and would love to connect about the ${jobTitle} position.`
        })
      });
    }
    
    // Handle opportunity endpoints
    if (urlStr.includes('/api/orion/opportunity/create') || urlStr.includes('/api/orion/notion/opportunity/create')) {
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({
          success: true,
          opportunity: {
            id: 'mock-opportunity-id-' + Math.random().toString(36).substr(2, 9),
            title: body.title || 'Mock Opportunity',
            company: body.company || 'Mock Company',
            content: body.content || 'Mock content',
            type: body.type || 'job',
            status: body.status || 'not_started'
          }
        })
      });
    }
    
    if (urlStr.includes('/api/orion/opportunity/draft-application')) {
      if (method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            drafts: [
              { id: 'draft-1', content: 'Mock draft 1 for opportunity', version: 1 },
              { id: 'draft-2', content: 'Mock draft 2 for opportunity', version: 2 },
              { id: 'draft-3', content: 'Mock draft 3 for opportunity', version: 3 }
            ]
          })
        });
      } else if (method === 'POST') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            drafts: [
              { id: 'draft-1', content: 'Mock draft 1 for opportunity', version: 1 },
              { id: 'draft-2', content: 'Mock draft 2 for opportunity', version: 2 },
              { id: 'draft-3', content: 'Mock draft 3 for opportunity', version: 3 }
            ]
          })
        });
      } else if (method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            draft: {
              id: 'draft-1',
              content: body.content || 'Updated mock draft content',
              version: 2
            }
          })
        });
      } else if (method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            success: true,
            message: 'Draft deleted successfully'
          })
        });
      }
    }
    
    if (urlStr.includes('/api/orion/opportunity/find-stakeholders')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          stakeholders: [{
            name: 'Jane Smith',
            role: 'Hiring Manager',
            email: 'jane.smith@acmecorp.com',
            linkedin: 'https://linkedin.com/in/janesmith',
            draftMessage: 'Hi Jane! I\'m Tomide and interested in the Acme role. I have experience in fintech and would love to connect.'
          }]
        })
      });
    }
    
    // Default error response for unmocked endpoints
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({
        success: false,
        error: 'Endpoint not found'
      })
    });
  });
});

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn().mockImplementation((url: string) => {
      // Handle GET requests based on URL
      if (url.includes('/api/orion/blocks/list')) {
        if (url.includes('type=')) {
          const typeMatch = url.match(/type=([^&]+)/);
          const requestedType = typeMatch ? decodeURIComponent(typeMatch[1]) : 'CV_SNIPPET';
          return Promise.resolve({ 
            status: 200, 
            data: { 
              success: true, 
              blocks: [{
                id: 'mock-block-id',
                type: requestedType,
                title: `Mock ${requestedType} Block`,
                content: `Mock content for ${requestedType}`,
                tags: ['mock']
              }]
            }
          });
        } else if (url.includes('tags=')) {
          const tagsMatch = url.match(/tags=([^&]+)/);
          const requestedTag = tagsMatch ? decodeURIComponent(tagsMatch[1]) : 'filtertest';
          return Promise.resolve({ 
            status: 200, 
            data: { 
              success: true, 
              blocks: [{
                id: 'mock-block-id',
                type: 'CV_SNIPPET',
                title: 'Mock Tagged Block',
                content: 'Mock content with specific tag',
                tags: [requestedTag, 'mock']
              }]
            }
          });
        } else {
          return Promise.resolve({ 
            status: 200, 
            data: { 
              success: true, 
              blocks: [
                {
                  id: 'mock-block-1',
                  type: 'CV_SNIPPET',
                  title: 'Mock CV Block',
                  content: 'Mock CV content',
                  tags: ['mock']
                },
                {
                  id: 'mock-block-2',
                  type: 'PROMPT_TEMPLATE',
                  title: 'Mock Prompt Block',
                  content: 'Mock prompt content',
                  tags: ['mock']
                }
              ]
            }
          });
        }
      }
      
      // Handle opportunity drafts GET requests
      if (url.includes('/api/orion/opportunity/draft-application')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            drafts: [
              'Dear Acme Corp team, I am Tomide, a fintech professional excited about this role...',
              'Hello Acme Corp, As a Tomide with fintech experience, I believe I can contribute...',
              'Greetings Acme Corp, Tomide here - my fintech background aligns well with your needs...'
            ]
          }
        });
      }
      
      // Default fallback for other GET requests
      return Promise.resolve({ status: 200, data: { success: true, data: 'mocked' } });
    }),
    post: jest.fn().mockImplementation((url: string, data?: any) => {
      // Handle POST requests based on URL and data
      if (url.includes('/api/orion/blocks/create')) {
        // Validate required fields
        if (!data?.type || !data?.title || !data?.content) {
          return Promise.resolve({
            status: 400,
            data: {
              success: false,
              error: 'Missing required fields: type, title, and content are required'
            }
          });
        }
        
        // Validate block type
        const validTypes = ['CV_SNIPPET', 'OPPORTUNITY_HIGHLIGHT', 'JOURNAL_INSIGHT', 'PROMPT_TEMPLATE', 'GENERAL_BLOCK'];
        if (!validTypes.includes(data.type)) {
          return Promise.resolve({
            status: 400,
            data: {
              success: false,
              error: 'Invalid block type. Must be one of: ' + validTypes.join(', ')
            }
          });
        }
        
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            block: {
              id: 'mock-block-id-' + Math.random().toString(36).substr(2, 9),
              type: data.type,
              title: data.title,
              content: data.content,
              tags: data.tags || []
            }
          }
        });
      }
      
      if (url.includes('/api/orion/opportunity/create') || url.includes('/api/orion/notion/opportunity/create')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            opportunity: {
              id: 'mock-opportunity-id-' + Math.random().toString(36).substr(2, 9),
              title: data?.title || 'Mock Opportunity',
              company: data?.company || 'Mock Company',
              content: data?.content || 'Mock content',
              type: data?.type || 'job',
              status: data?.status || 'not_started'
            }
          }
        });
      }
      
      if (url.includes('/api/orion/opportunity/find-stakeholders')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            stakeholders: [{
              name: 'Jane Smith',
              role: 'Hiring Manager',
              email: 'jane.smith@acmecorp.com',
              linkedin: 'https://linkedin.com/in/janesmith'
            }]
          }
        });
      }
      
      if (url.includes('/api/orion/networking/stakeholder-search')) {
        const query = data?.query || 'Unknown Company';
        const roles = data?.roles || ['Unknown Role'];
        
        // Return empty array for nonexistent companies
        if (query.includes('NonexistentCompany') || query.includes('UnknownCorp')) {
          return Promise.resolve({
            status: 200,
            data: {
              success: true,
              stakeholders: []
            }
          });
        }
        
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            stakeholders: [{
              name: 'John Doe',
              role: roles[0] || 'Product Manager',
              company: query,
              linkedin_url: 'https://linkedin.com/in/johndoe',
              email: `john.doe@${query.toLowerCase().replace(/\s+/g, '')}.com`
            }]
          }
        });
      }
      
      if (url.includes('/api/orion/networking/generate-outreach')) {
        const stakeholder = data?.stakeholder || {};
        const jobTitle = data?.jobTitle || 'role';
        const profileData = data?.profileData || '';
        
        // Check for missing required fields
        if (!stakeholder.name || !stakeholder.company) {
          return Promise.resolve({
            status: 400,
            data: {
              success: false,
              error: 'Missing required stakeholder information'
            }
          });
        }
        
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            emailDraft: `Hi ${stakeholder.name}! I'm interested in the ${jobTitle} role at ${stakeholder.company}. ${profileData}`,
            linkedinDraft: `Hi ${stakeholder.name}! I saw your work at ${stakeholder.company} and would love to connect about the ${jobTitle} position.`
          }
        });
      }
      
      if (url.includes('/api/orion/opportunity/draft-application')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            drafts: [
              'Dear Acme Corp team, I am Tomide, a fintech professional excited about this role...',
              'Hello Acme Corp, As a Tomide with fintech experience, I believe I can contribute...',
              'Greetings Acme Corp, Tomide here - my fintech background aligns well with your needs...'
            ]
          }
        });
      }
      
      return Promise.resolve({ status: 200, data: { success: true, data: 'mocked' } });
    }),
    put: jest.fn().mockResolvedValue({ status: 200, data: { success: true, data: 'mocked' } }),
    patch: jest.fn().mockImplementation((url: string, data?: any) => {
      if (url.includes('/api/orion/opportunity/draft-application/')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            draft: {
              id: url.split('/').pop(),
              content: data?.content || 'Updated mock draft content',
              version: 2
            }
          }
        });
      }
      return Promise.resolve({ status: 200, data: { success: true, data: 'mocked' } });
    }),
    delete: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/orion/opportunity/draft-application/')) {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            message: 'Draft deleted successfully'
          }
        });
      }
      return Promise.resolve({ status: 200, data: { success: true, data: 'mocked' } });
    }),
    request: jest.fn().mockResolvedValue({ status: 200, data: { success: true, data: 'mocked' } }),
  };
  
  return {
    default: {
      create: jest.fn(() => mockAxiosInstance),
      ...mockAxiosInstance
    },
    create: jest.fn(() => mockAxiosInstance),
    ...mockAxiosInstance
  };
});

// Reduce console noise in tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


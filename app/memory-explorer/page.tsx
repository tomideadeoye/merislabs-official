'use client';

import { useState } from 'react';
import { useMemory } from '../hooks/useMemory';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui';
import { DedicatedAddToMemoryFormComponent } from '@/components/ui/orion/DedicatedAddToMemoryFormComponent';

export default function MemoryExplorerPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [memoryType, setMemoryType] = useState('note');
  const { findByType, findByTag, results, isLoading } = useMemory();
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = async (value: string) => {
    setSelectedFilter(value);

    if (value.startsWith('type:')) {
      const type = value.replace('type:', '');
      await findByType(type);
    } else if (value.startsWith('tag:')) {
      const tag = value.replace('tag:', '');
      await findByTag(tag);
    }
  };

  const memoryTypes = [
    { value: 'note', label: 'Note' },
    { value: 'journal_entry', label: 'Journal Entry' },
    { value: 'reflection', label: 'Reflection' },
    { value: 'idea', label: 'Idea' },
    { value: 'task', label: 'Task' },
  ];

  const filterOptions = [
    { value: '', label: 'No Filter' },
    { value: 'type:note', label: 'Type: Note' },
    { value: 'type:journal_entry', label: 'Type: Journal Entry' },
    { value: 'type:reflection', label: 'Type: Reflection' },
    { value: 'type:idea', label: 'Type: Idea' },
    { value: 'tag:important', label: 'Tag: Important' },
    { value: 'tag:personal', label: 'Tag: Personal' },
    { value: 'tag:work', label: 'Tag: Work' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Memory Explorer</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="add">Add Memory</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type or tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <p>Loading search results...</p>
              ) : results.length === 0 ? (
                <p>No search results found.</p>
              ) : (
                <div className="space-y-4 mt-4">
                  {results.map((entry) => (
                    <Card key={entry.payload.source_id} className="bg-gray-700 border-gray-600">
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">{entry.payload.text}</p>
                        <div className="flex flex-wrap items-center text-xs text-gray-400 gap-4">
                          <span>Score: {entry.score?.toFixed(4)}</span>
                          <span>Type: {entry.payload.type}</span>
                          {entry.payload.tags && entry.payload.tags.length > 0 && (
                            <span>Tags: {entry.payload.tags.join(', ')}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={memoryType} onValueChange={setMemoryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select memory type" />
                  </SelectTrigger>
                  <SelectContent>
                    {memoryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DedicatedAddToMemoryFormComponent
                initialType={memoryType}
                initialTags={memoryType}
                onMemoryAdded={() => setActiveTab('search')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

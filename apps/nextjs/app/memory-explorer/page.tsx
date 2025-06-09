'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemorySearch } from '@/components/orion/MemorySearch';
import { MemoryInput } from '@/components/orion/MemoryInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemory } from '@shared/hooks/useMemory';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    { value: 'task', label: 'Task' }
  ];

  const filterOptions = [
    { value: '', label: 'No Filter' },
    { value: 'type:note', label: 'Type: Note' },
    { value: 'type:journal_entry', label: 'Type: Journal Entry' },
    { value: 'type:reflection', label: 'Type: Reflection' },
    { value: 'type:idea', label: 'Type: Idea' },
    { value: 'tag:important', label: 'Tag: Important' },
    { value: 'tag:personal', label: 'Tag: Personal' },
    { value: 'tag:work', label: 'Tag: Work' }
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
                    {filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <MemorySearch />
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
                    {memoryTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <MemoryInput 
                type={memoryType} 
                defaultTags={[memoryType]}
                onSuccess={() => setActiveTab('search')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}